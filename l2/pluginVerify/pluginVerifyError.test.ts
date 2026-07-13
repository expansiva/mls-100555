/// <mls fileReference="_100555_/l2/pluginVerify/pluginVerifyError.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, overrideMls, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginVerifyError } from '/_100555_/l2/pluginVerify/pluginVerifyError.js';

const TAG = 'plugin-verify--plugin-verify-error-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // `setFilesErros` is the fragile message-parsing routine: it extracts a numeric project id
    // and a file path out of strings like "--- Error compiling _100554_/l2/x". It is private,
    // so it is called through a cast on a mounted instance.
    { functionName: 'testSetFilesErrosParsing', env: 'browser', params: [
        { input: { errors: ['--- Error compiling _100554_/l2/x'] },
          expected: { calls: [{ prj: 100554, path: '/l2/x' }] } },
        // Edge case: a non-numeric "project id" segment. The source falls back to 0
        // (see the "// error" comment next to `if (isNaN(prID)) prID = 0;`) instead of
        // discarding the entry, so it still attempts a (very likely wrong) file lookup.
        { input: { errors: ['--- Error compiling _abc_/l2/y.ts'] },
          expected: { calls: [{ prj: 0, path: '/l2/y.ts' }] } },
    ]},

    // Normal (non-canceled) path, for contrast with the quirk test below: when verification
    // runs to completion, `tsFree` faithfully reflects whether errors were found.
    { functionName: 'testPrepareFiresTsFreeBasedOnErrorsWhenNotCanceled', env: 'browser', params: [
        { expected: { errorsFound: 1, wasCanceled: false, firedTsFree: false } },
    ]},

    // DOCUMENTED QUIRK (current characteristic, not something to fix here): when the user
    // cancels verification mid-run, `prepare()` calls `fireEvent(true)` unconditionally —
    // regardless of how many errors were already collected in `listErrors`. So the dispatched
    // 'ProjectCompilationComplete' event reports `tsFree: true` even though errors were found.
    { functionName: 'testPrepareCancelForcesTsFreeTrueDespiteErrors', env: 'browser', params: [
        { expected: { errorsFound: 2, wasCanceled: true, firedTsFree: true } },
    ]},
];

export async function testSmoke(testCase: { expected: any }): Promise<string> {
    try {
        const result = await mountAndVerify(TAG);
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testSetFilesErrosParsing(testCase: { input: { errors: string[] }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginVerifyError>(TAG);
        const calls: { prj: number; path: string }[] = [];
        overrideMls({
            stor: {
                getKeyToFiles: (prj: number, _level: number, path: string, _folder: string, _ext: string) => {
                    calls.push({ prj, path });
                    return `${prj}|${path}`;
                },
                files: {},
            },
        });
        (el as any).setFilesErros(testCase.input.errors);
        const result = { calls };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

/** Shared mls mock setup so `prepare()` can run end-to-end without touching real Monaco/typescript services. */
function mockPrepareDependencies(el: PluginVerifyError, compileAllMock: (project: number, onProgress?: (c: number, t: number, r: string[]) => boolean) => Promise<string[]>) {
    return overrideMls({
        actualProject: 999001,
        actualLevel: 'test-level',
        editor: {
            InitMonaco: async () => {},
            getModels: () => ({ ts: true }),
        },
        l5: {
            getProjectDependencies: () => [],
        },
        stor: {
            LOCALPROJECTNUMBER: -999,
            getKeyToFiles: (prj: number, _level: number, path: string) => `${prj}|${path}`,
            files: {},
        },
        l2: {
            typescript: {
                compileAll: compileAllMock,
            },
        },
        events: {
            fire: async (_levels: any, _type: any, desc?: string) => {
                firedEvents.push(desc ? JSON.parse(desc) : undefined);
            },
        },
    });
}

let firedEvents: any[] = [];

export async function testPrepareFiresTsFreeBasedOnErrorsWhenNotCanceled(testCase: { expected: any }): Promise<string> {
    firedEvents = [];
    try {
        const el = await mount<PluginVerifyError>(TAG, { autoPrepare: false });
        mockPrepareDependencies(el, async (_project, onProgress) => {
            const results = ['--- Error compiling _999001_/l2/fileA.ts'];
            onProgress?.(1, 1, results);
            return results;
        });

        await el.prepare();

        const result = {
            errorsFound: el.listErrors.length,
            wasCanceled: !(el as any).continueVerify,
            firedTsFree: firedEvents[0]?.tsFree,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testPrepareCancelForcesTsFreeTrueDespiteErrors(testCase: { expected: any }): Promise<string> {
    firedEvents = [];
    try {
        const el = await mount<PluginVerifyError>(TAG, { autoPrepare: false });
        mockPrepareDependencies(el, async (_project, onProgress) => {
            const results = ['--- Error compiling _999001_/l2/fileA.ts'];
            onProgress?.(1, 2, results);
            // Simulate the user clicking "cancel" mid-verification, after an error was already found.
            (el as any).cancelVerify();
            results.push('--- Error compiling _999001_/l2/fileB.ts');
            onProgress?.(2, 2, results);
            return results;
        });

        await el.prepare();

        const result = {
            errorsFound: el.listErrors.length,
            wasCanceled: !(el as any).continueVerify,
            firedTsFree: firedEvents[0]?.tsFree,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}
