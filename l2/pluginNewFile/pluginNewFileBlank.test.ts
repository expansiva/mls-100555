/// <mls fileReference="_100555_/l2/pluginNewFile/pluginNewFileBlank.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginNewFileBlank } from '/_100555_/l2/pluginNewFile/pluginNewFileBlank.js';

import '/_100555_/l2/pluginNewFile/pluginNewFileBlank.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-new-file--plugin-new-file-blank-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // `template` is the empty string on this plugin (by design — it creates a truly blank file),
    // so getTemplate() only ever produces the fileReference header line. `folder` is handled
    // correctly here (trailing slash added conditionally), unlike pluginNewFileAgent.
    { functionName: 'testGetTemplateBodyAlwaysEmpty', env: 'browser', params: [
        { input: { project: 100555, shortName: 'myFile' },
          expected: { trimmed: '/// <mls fileReference="_100555_/l2/myFile.ts" enhancement="_blank"/>' } },
        { input: { project: 100555, shortName: 'myFile', folder: 'sub' },
          expected: { trimmed: '/// <mls fileReference="_100555_/l2/sub/myFile.ts" enhancement="_blank"/>' } },
    ]},

    // Same missing-service bug as the other pluginNewFile* forms: `service` is resolved via
    // `this.closest(...)` in the constructor, before the element is attached anywhere, so it is
    // always null under mount() and the guard throws instead of showing a friendly error.
    { functionName: 'testHandleAddFileGuardThrows', env: 'browser', params: [
        { expected: { threw: true } },
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

export async function testGetTemplateBodyAlwaysEmpty(testCase: { input: { project: number; shortName: string; folder?: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginNewFileBlank>(TAG, { project: testCase.input.project, shortName: testCase.input.shortName, folder: testCase.input.folder });
        const template = (el as any).getTemplate() as string;
        const result = { trimmed: template.trim() };
        compare(result, testCase.expected);
        return template;
    } finally {
        cleanup();
    }
}

export async function testHandleAddFileGuardThrows(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginNewFileBlank>(TAG);
        let threw = false;
        try {
            await (el as any).handleAddFile();
        } catch (e) {
            threw = true;
        }
        const result = { threw };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}
