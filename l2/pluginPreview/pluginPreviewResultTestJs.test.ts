/// <mls fileReference="_100555_/l2/pluginPreview/pluginPreviewResultTestJs.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginPreviewResultJs as PluginPreviewResultTestJsClass } from '/_100555_/l2/pluginPreview/pluginPreviewResultTestJs.js';

const TAG = 'plugin-preview--plugin-preview-result-test-js-100555';

// NOTE (pre-existing bug shared with pluginPreviewResultJs.ts): this file's class is also
// exported as `PluginPreviewResultJs` (same name as the class in the sibling
// pluginPreviewResultJs.ts). No collision happens within this file since only this module's
// class is imported here, but it is aliased on import (`as PluginPreviewResultTestJsClass`)
// to avoid any ambiguity if both test files are ever consolidated.

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testMsizePropagatesToEditor', env: 'browser', params: [
        { input: { msize: 'l2_full' }, expected: { msizeAttr: 'l2_full' } },
        // Lit reports every declared reactive property as "changed" on the first update,
        // so `updated()` fires even when `msize` isn't explicitly set, propagating the default ''.
        { input: {}, expected: { msizeAttr: '' } },
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

export async function testMsizePropagatesToEditor(testCase: { input: { msize?: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginPreviewResultTestJsClass>(TAG, testCase.input);
        const editor = query(el, 'collab-monaco-editor-102027');
        const result = { msizeAttr: editor?.getAttribute('msize') ?? null };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}
