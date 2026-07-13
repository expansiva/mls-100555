/// <mls fileReference="_100555_/l2/pluginModule/pluginDeleteModule.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify, overrideMls } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginDeleteModule } from '/_100555_/l2/pluginModule/pluginDeleteModule.js';

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

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testGetFilesModule', env: 'browser', params: [
        { expected: { shortNames: ['a', 'b'] } },
    ]},

    { functionName: 'testConfirmationGate', env: 'browser', params: [
        // No input yet: button disabled, but no nagging error message.
        { input: { confirmInput: '' }, expected: { buttonDisabled: true, hasErrorMsg: false } },
        // Wrong name: button stays disabled and the error message shows up.
        { input: { confirmInput: 'wrongName' }, expected: { buttonDisabled: true, hasErrorMsg: true } },
        // Exact match: button becomes enabled, no error message.
        { input: { confirmInput: 'travel' }, expected: { buttonDisabled: false, hasErrorMsg: false } },
        // Exact match with surrounding whitespace: confirmInput.trim() still matches.
        { input: { confirmInput: '  travel  ' }, expected: { buttonDisabled: false, hasErrorMsg: false } },
    ]},

    { functionName: 'testHandleDeleteBlocksWrongName', env: 'browser', params: [
        { expected: { isDeleted: false, isDeleting: false } },
    ]},

    { functionName: 'testGetFileKey', env: 'browser', params: [
        { input: { folder: 'travel', project: 102009, shortName: 'a', extension: '.ts' },
          expected: { key: '_102009_travel/a.ts' } },
        { input: { folder: '', project: 102009, shortName: 'a', extension: '.ts' },
          expected: { key: '_102009_a.ts' } },
    ]},
];

export async function testSmoke(testCase: { expected: any }): Promise<string> {
    try {
        overrideMls({ stor: { files: {} } });
        const result = await mountAndVerify(TAG);
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testGetFilesModule(testCase: { expected: any }): Promise<string> {
    try {
        overrideMls({
            stor: {
                files: {
                    // exact folder match -> included
                    f1: { project: 102009, folder: 'travel', shortName: 'a', extension: '.ts' },
                    // nested folder, first segment matches moduleName -> included
                    f2: { project: 102009, folder: 'travel/sub', shortName: 'b', extension: '.ts' },
                    // folder doesn't match moduleName -> excluded
                    f3: { project: 102009, folder: 'other', shortName: 'c', extension: '.ts' },
                    // folder matches but project doesn't -> excluded
                    f4: { project: 999999, folder: 'travel', shortName: 'd', extension: '.ts' },
                },
            },
        });
        const el = await mount<PluginDeleteModule>(TAG, { moduleName: 'travel', project: '102009' });
        const result = { shortNames: el.filesToDelete.map((f: any) => f.shortName).sort() };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testConfirmationGate(testCase: { input: { confirmInput: string }; expected: any }): Promise<string> {
    try {
        overrideMls({ stor: { files: {} } });
        const el = await mount<PluginDeleteModule>(TAG); // moduleName defaults to 'travel'
        el.confirmInput = testCase.input.confirmInput;
        await el.updateComplete;
        const button = query(el, 'button') as HTMLButtonElement | null;
        const errorMsg = query(el, '.error-msg');
        const result = {
            buttonDisabled: button?.disabled ?? null,
            hasErrorMsg: !!errorMsg,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleDeleteBlocksWrongName(testCase: { expected: any }): Promise<string> {
    try {
        overrideMls({ stor: { files: {} } });
        const el = await mount<PluginDeleteModule>(TAG); // moduleName defaults to 'travel'
        el.confirmInput = 'definitely-not-the-module-name';
        // Safe to call directly: handleDelete() only reaches the deletion pipeline
        // when confirmInput.trim() === moduleName, which is false here.
        await (el as any).handleDelete();
        const result = { isDeleted: el.isDeleted, isDeleting: el.isDeleting };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

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
