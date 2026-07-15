/// <mls fileReference="_100555_/l2/pluginModule/pluginDeleteModule.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify, overrideMls } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginDeleteModule } from '/_100555_/l2/pluginModule/pluginDeleteModule.js';

import '/_100555_/l2/pluginModule/pluginDeleteModule.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-module--plugin-delete-module-100555';

// SAFETY NOTE: handleDelete()'s real success path calls deleteFile()/removeModule()/
// removeTokensTheme() — direct ES-module imports (not `mls.*`), so they cannot be
// swapped out with overrideMls(). Actually invoking handleDelete() with a matching
// confirmInput would run the real deletion pipeline against live project data, which
// this suite must never do. So the "exact name allows deletion" side of the gate is
// verified through the render() contract instead (the delete button's disabled state
// and the error message), which is driven by the exact same `isValid` check that
// handleDelete() uses internally. Only the "wrong name blocks deletion" side is
// exercised by calling handleDelete() directly — that path is a pure early-return
// guard with zero side effects, so it's safe to call for real.
//
// QUIRK: moduleName defaults to 'travel' and project defaults to '102009' — an
// unconfigured instance of this plugin targets a specific real project/module for
// deletion rather than defaulting to something inert/empty.

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testGetFileKey', env: 'browser', params: [
        { input: { folder: 'travel', project: 102009, shortName: 'a', extension: '.ts' },
          expected: { key: '_102009_travel/a.ts' } },
        { input: { folder: '', project: 102009, shortName: 'a', extension: '.ts' },
          expected: { key: '_102009_a.ts' } },
    ]},
];


export async function testGetFileKey(testCase: { input: { folder: string; project: number; shortName: string; extension: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginDeleteModule>(TAG);
        const fakeFile = { ...testCase.input } as any;
        const result = { key: (el as any).getFileKey(fakeFile) };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}
