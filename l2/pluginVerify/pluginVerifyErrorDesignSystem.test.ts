/// <mls fileReference="_100555_/l2/pluginVerify/pluginVerifyErrorDesignSystem.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, overrideMls, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginVerifyErrorDesignSystem } from '/_100555_/l2/pluginVerify/pluginVerifyErrorDesignSystem.js';

const TAG = 'plugin-verify--plugin-verify-error-design-system-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // `setFilesErros` is the same fragile message-parsing routine found in pluginVerifyError.ts
    // (identical implementation): it extracts a numeric project id and a file path out of strings
    // like "--- Error compiling _100554_/l2/x". It is private, called through a cast.
    { functionName: 'testSetFilesErrosParsing', env: 'browser', params: [
        { input: { errors: ['--- Error compiling _100554_/l2/x'] },
          expected: { calls: [{ prj: 100554, path: '/l2/x' }] } },
        // Edge case: a non-numeric "project id" segment falls back to 0 instead of being
        // discarded (see the "// error" comment next to `if (isNaN(prID)) prID = 0;`).
        { input: { errors: ['--- Error compiling _abc_/l2/y.ts'] },
          expected: { calls: [{ prj: 0, path: '/l2/y.ts' }] } },
    ]},

    // Normal (non-canceled) path, for contrast with the quirk test below: when verification
    // of .less files runs to completion, `lessFree` faithfully reflects whether errors were found.
    { functionName: 'testPrepareFiresLessFreeBasedOnErrorsWhenNotCanceled', env: 'browser', params: [
        { expected: { errorsFound: 1, wasCanceled: false, firedLessFree: false } },
    ]},

    // DOCUMENTED QUIRK (current characteristic, not something to fix here): the same quirk present
    // in pluginVerifyError.ts also exists here. When the user cancels verification mid-run,
    // `prepare()` calls `fireEvent(true)` unconditionally — regardless of how many .less compile
    // errors were already collected in `listErrors`. So the dispatched 'ProjectCompilationComplete'
    // event reports `lessFree: true` even though errors were found (the design-system analog of
    // the `tsFree` quirk — same root cause, key is just named `lessFree` here).
    { functionName: 'testPrepareCancelForcesLessFreeTrueDespiteErrors', env: 'browser', params: [
        { expected: { errorsFound: 2, wasCanceled: true, firedLessFree: true } },
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
        const el = await mount<PluginVerifyErrorDesignSystem>(TAG);
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

let firedEvents: any[] = [];
const PROJECT = 999002;

/**
 * Drives `prepare()` end-to-end without touching the real LESS compiler: `mls.stor.files` is
 * mocked so the "designSystem" lookup finds an `inLocalStorage` file (entering the compile
 * branch), and each fake `.less` file's `getContent()` throws directly — this is caught by the
 * same try/catch that would normally catch a `preCompileLessByThemeOrDefault` failure, so an
 * entry is pushed into the error list without ever invoking the real LESS compiler.
 */
function mockPrepareDependencies(el: PluginVerifyErrorDesignSystem, cancelOnSecondFile: boolean) {
    const designSystemKey = `${PROJECT}|2|designSystem||.ts`;
    const files: Record<string, any> = {
        [designSystemKey]: { inLocalStorage: true },
        lessFile1: {
            project: PROJECT,
            extension: '.less',
            folder: 'Default',
            shortName: 'fileA.less',
            getContent: async () => { throw new Error('mock compile fail A'); },
        },
    };
    if (cancelOnSecondFile) {
        files.lessFile2 = {
            project: PROJECT,
            extension: '.less',
            folder: 'Default',
            shortName: 'fileB.less',
            getContent: async () => {
                // Simulate the user clicking "cancel" mid-verification, after an error was already found.
                (el as any).cancelVerify();
                throw new Error('mock compile fail B');
            },
        };
    }
    return overrideMls({
        actualProject: PROJECT,
        actualLevel: 'test-level',
        stor: {
            getKeyToFiles: (prj: number, level: number, path: string, folder: string, ext: string) => `${prj}|${level}|${path}|${folder}|${ext}`,
            files,
        },
        events: {
            fire: async (_levels: any, _type: any, desc?: string) => {
                firedEvents.push(desc ? JSON.parse(desc) : undefined);
            },
        },
    });
}

export async function testPrepareFiresLessFreeBasedOnErrorsWhenNotCanceled(testCase: { expected: any }): Promise<string> {
    firedEvents = [];
    try {
        const el = await mount<PluginVerifyErrorDesignSystem>(TAG, { autoPrepare: false });
        mockPrepareDependencies(el, false);

        await el.prepare();

        const result = {
            errorsFound: el.listErrors.length,
            wasCanceled: !(el as any).continueVerify,
            firedLessFree: firedEvents[0]?.lessFree,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testPrepareCancelForcesLessFreeTrueDespiteErrors(testCase: { expected: any }): Promise<string> {
    firedEvents = [];
    try {
        const el = await mount<PluginVerifyErrorDesignSystem>(TAG, { autoPrepare: false });
        mockPrepareDependencies(el, true);

        await el.prepare();

        const result = {
            errorsFound: el.listErrors.length,
            wasCanceled: !(el as any).continueVerify,
            firedLessFree: firedEvents[0]?.lessFree,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}
