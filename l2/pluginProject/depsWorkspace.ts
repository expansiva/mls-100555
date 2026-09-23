/// <mls fileReference="_100555_/l2/pluginProject/depsWorkspace.ts" enhancement="_blank" />

// The build's source of truth for a project's dependencies is `l5/config.json ->
// workspaceDependencies`: scripts/buildCI/resolveDeps.mjs reads it and nothing else, and
// scripts/runtime/projectInit.mjs resolves the agent through the same field. `mlsDep.json`
// no longer serves the build.
//
// Everything here is framework-free on purpose. The plugin that calls it is a Lit element
// that cannot be imported outside a DOM (`createTreeWalker is not a function`), so this is
// the layer where the rules are tested — with `fetch` injected, never reaching the network.

export interface IDependencyRef {
    id: number;
    name: string;
    auth: string;
    unknown?: boolean;
    removed?: boolean;
}

export interface IProjectDetailsLike {
    id: number;
    name: string;
    userAuth: string;
}

export type FetchLike = (url: string) => Promise<{ status: number }>;

/**
 * GitHub's repo endpoint: 200 exists, 404 does not. No token and no proxy — the response
 * carries `access-control-allow-origin: *`, so the studio can call it from the browser.
 */
export function gitHubRepoApiUrl(orgName: string, id: number): string {
    return `https://api.github.com/repos/${orgName}/mls-${id}`;
}

/**
 * Accepted limit: a PRIVATE repository answers 404 without a token and is refused although
 * it exists. Refusing is the safe side — resolveDeps aborts the whole build when a clone
 * fails, so a dependency written but unreachable stops the project from building at all.
 */
export async function projectExistsOnGitHub(orgName: string, id: number, fetchImpl: FetchLike): Promise<boolean> {
    const response = await fetchImpl(gitHubRepoApiUrl(orgName, id));
    return response.status === 200;
}

export type AddDependencyStatus =
    | 'errorNull'      // no id typed
    | 'errorSame'      // the project itself
    | 'errorAlready'   // already in the list
    | 'errorInvalid'   // neither the host nor GitHub knows it
    | 'restored'       // it was marked removed and came back
    | 'added';         // the host knows it

export interface IAddDependencyInput {
    newDepId: number | null;
    project: number | undefined;
    deps: IDependencyRef[];
    getProjectDetails: (id: number) => IProjectDetailsLike | undefined | null;
    orgName: string | undefined;
    fetchImpl: FetchLike;
}

export interface IAddDependencyResult {
    status: AddDependencyStatus;
    /** The resulting list — the SAME array reference when the dependency was refused. */
    deps: IDependencyRef[];
}

/**
 * The gate the plugin applies before a dependency enters the list.
 *
 * The old gate refused whatever `mls.l5.getProjectDetails` did not know, which is exactly
 * what made adding a NEW dependency impossible: the host only serves what it already has.
 * A project the host does not know is now checked against GitHub instead of refused.
 */
export async function resolveAddDependency(input: IAddDependencyInput): Promise<IAddDependencyResult> {
    const { newDepId, project, deps, getProjectDetails, orgName, fetchImpl } = input;

    if (newDepId === null) return { status: 'errorNull', deps };
    if (newDepId === project) return { status: 'errorSame', deps };

    const existingIndex = deps.findIndex(dep => dep.id === newDepId);
    if (existingIndex !== -1) {
        if (!deps[existingIndex].removed) return { status: 'errorAlready', deps };
        const restored = [...deps];
        restored[existingIndex] = { ...restored[existingIndex], removed: false };
        return { status: 'restored', deps: restored };
    }

    const depDetails = getProjectDetails(newDepId);
    if (depDetails) {
        return {
            status: 'added',
            deps: [...deps, { id: newDepId, name: depDetails.name, auth: depDetails.userAuth }],
        };
    }

    // The host does not serve it. Ask GitHub before refusing — validating BEFORE the save is
    // the whole point: an id written and only discovered at rebuild time costs the project.
    if (!orgName) return { status: 'errorInvalid', deps };
    const exists = await projectExistsOnGitHub(orgName, newDepId, fetchImpl);
    if (!exists) return { status: 'errorInvalid', deps };

    // `unknown` is the mark getDependencies() already uses for an id the host cannot resolve.
    return {
        status: 'added',
        deps: [...deps, { id: newDepId, name: `mls-${newDepId}`, auth: '', unknown: true }],
    };
}

export interface IApplyWorkspaceResult {
    content: string;
    changed: boolean;
}

/**
 * Rewrites ONLY `workspaceDependencies`, preserving its shape.
 *
 * The array of strings is the real form in l5/config.json, and
 * `projectInit.missingWorkspaceDependencies` requires `Array.isArray(list)` — a project whose
 * list became an object is refused by the host. Treating the array as a key/value map (what
 * updateFileConfig does) writes numeric ids as INDEXES: one dependency turns the file into
 * ~1 MB of `null`.
 *
 * `projects` — the release fecho validated by scripts/validateClientConfig.mjs — is never
 * touched: it is an independent list and already diverges from this one on purpose.
 */
export function applyWorkspaceDependencies(content: string, deps: number[]): IApplyWorkspaceResult {
    const config = JSON.parse(content);
    const trailingNewline = content.endsWith('\n') ? '\n' : '';

    const desired: string[] = [];
    for (const dep of deps) {
        const id = String(dep);
        if (!/^\d+$/.test(id)) continue;
        if (!desired.includes(id)) desired.push(id);
    }

    const current = config.workspaceDependencies;
    const before = JSON.stringify(current ?? null);

    if (current && !Array.isArray(current) && typeof current === 'object') {
        // The original buildCI object form. Keep the shape — changing it here would be a
        // second, unasked migration; only the key set moves.
        const workspaceDependencies = current as Record<string, unknown>;
        for (const key of Object.keys(workspaceDependencies)) {
            if (!desired.includes(key)) delete workspaceDependencies[key];
        }
        for (const id of desired) {
            if (!(id in workspaceDependencies)) workspaceDependencies[id] = { repo: '', commit: '' };
        }
    } else {
        config.workspaceDependencies = desired;
    }

    const changed = JSON.stringify(config.workspaceDependencies) !== before;
    return { content: `${JSON.stringify(config, null, 2)}${trailingNewline}`, changed };
}

export interface IStorFileLike {
    inLocalStorage: boolean;
    status?: string;
    getContent(): Promise<unknown>;
}

export interface ISaveWorkspaceDependenciesIO {
    file: IStorFileLike;
    deps: number[];
    setContent: (file: IStorFileLike, value: { content: string; contentType: 'string' }) => Promise<unknown>;
    setContents: (files: IStorFileLike[], message: string) => Promise<unknown>;
    message: string;
}

/**
 * Writes the file into the stor and hands it to `setContents`, which is the actual save:
 * DriverVm answers the fork/branch/PR ceremony with `true` without doing anything, so the
 * whole flow exists to reach `setContents` — from there the host writes to disk, commits and
 * calls scheduleRebuildOnSave on its own. Nothing is forced from here.
 *
 * `inLocalStorage = false` is what the driver's readFilePayload counts on, and it is what the
 * serviceSave loop does before saving.
 *
 * @returns whether anything was written — an unchanged file never reaches `setContents`.
 */
export async function saveWorkspaceDependencies(io: ISaveWorkspaceDependenciesIO): Promise<boolean> {
    const { file, deps, setContent, setContents, message } = io;

    const content = await file.getContent();
    if (typeof content !== 'string') return false;

    const { content: next, changed } = applyWorkspaceDependencies(content, deps);
    if (!changed) return false;

    await setContent(file, { content: next, contentType: 'string' });
    file.status = 'changed';
    file.inLocalStorage = false;
    await setContents([file], message);
    return true;
}
