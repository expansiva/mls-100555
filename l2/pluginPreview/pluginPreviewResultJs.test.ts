/// <mls fileReference="_100555_/l2/pluginPreview/pluginPreviewResultJs.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginPreviewResultJs } from '/_100555_/l2/pluginPreview/pluginPreviewResultJs.js';

import '/_100555_/l2/pluginPreview/pluginPreviewResultJs.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-preview--plugin-preview-result-js-100555';

// QUIRK (pre-existing bug in pluginPreviewResultJs.ts): render() emits a bare
// <collab-monaco-editor> tag (and @query looks for that same bare tag), but the real
// custom element registered by collabMonacoEditor.js is 'collab-monaco-editor-102027'.
// So the editor host rendered here is an ordinary, unregistered element — querying it and
// setting attributes on it still works via plain DOM tag matching (tested below), but none
// of the actual CollabMonacoEditor component behavior (its own render/shadow DOM/etc.) applies.

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
        const el = await mount<PluginPreviewResultJs>(TAG, testCase.input);
        const editor = query(el, 'collab-monaco-editor');
        const result = { msizeAttr: editor?.getAttribute('msize') ?? null };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}
