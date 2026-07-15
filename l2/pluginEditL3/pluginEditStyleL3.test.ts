/// <mls fileReference="_100555_/l2/pluginEditL3/pluginEditStyleL3.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify, overrideMls } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginEditStyleL3 } from '/_100555_/l2/pluginEditL3/pluginEditStyleL3.js';

import '/_100555_/l2/pluginEditL3/pluginEditStyleL3.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-edit-l3--plugin-edit-style-l3-100555';

// firstUpdated() fires an un-awaited `init()` chain (initMonaco_Editor -> openFile) that reaches
// into `mls.actual[3]`, `mls.stor`, `window.preview.iframe` and mutates the shared
// `mls.editor.instances`/`mls.editor.InitEditor` singletons. Per the testing guide, real IDE
// state must not be relied on, so every case below overrides `mls.actual`/`mls.editor` first:
// `actual: []` makes `mls.actual[3].getFullName()` throw synchronously as the very first
// statement of `openFile()`, before it ever touches `this.error` - this keeps every case
// deterministic regardless of whatever file is actually open in the IDE, without needing to
// reconstruct the rest of the real `openFile()` environment. The stubbed `mls.editor` avoids
// polluting the real `instances` map / calling the real `InitEditor` with a throwaway editor.
function stubMlsForMount(): void {
    overrideMls({
        actual: [],
        editor: { instances: {}, InitEditor: () => {}, getModels: () => undefined },
    });
}

export const tests: IPluginTestCase[] = [

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testResolveSelector', env: 'browser', params: [
        { input: { selector: '&.active' }, expected: { resolved: '.active' } },
        { input: { selector: '.card &.active' }, expected: { resolved: '.card.active' } },
        { input: { selector: '.foo .bar &.hover .baz' }, expected: { resolved: '.foo .bar.hover .baz' } },
    ]},

    { functionName: 'testForceUpdateResetsError', env: 'browser', params: [
        { expected: { errorAfter: '' } },
    ]},

    // Quirk: when there's no error, the editor's `style` attribute is built from the literal
    // string 'display: ""' (source: `this.error ? 'display:none' : 'display: ""'`), which is
    // invalid CSS (an empty quoted string is not a valid `display` value). This looks like a
    // copy/paste bug (probably meant to be `''` or `'display:block'`), but it's asserted here as
    // the actual current behavior rather than "fixed".
    { functionName: 'testRenderReflectsError', env: 'browser', params: [
        { input: { error: 'Something broke' }, expected: { hasErrorHeading: true, editorStyleAttr: 'display:none' } },
        { input: { error: '' }, expected: { hasErrorHeading: false, editorStyleAttr: 'display: ""' } },
    ]},
];

export async function testSmoke(testCase: { expected: any }): Promise<string> {
    stubMlsForMount();
    try {
        const result = await mountAndVerify(TAG);
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testResolveSelector(testCase: { input: { selector: string }; expected: any }): Promise<string> {
    stubMlsForMount();
    try {
        const el = await mount<PluginEditStyleL3>(TAG);
        // resolveSelector is private in the source - accessed via cast, same instance the runner
        // would otherwise only reach through DOM/mls-heavy public flows.
        const resolved = (el as any).resolveSelector(testCase.input.selector);
        const result = { resolved };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testForceUpdateResetsError(testCase: { expected: any }): Promise<string> {
    stubMlsForMount();
    try {
        const el = await mount<PluginEditStyleL3>(TAG);
        el.error = 'boom';
        await el.forceUpdate();
        const result = { errorAfter: el.error };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testRenderReflectsError(testCase: { input: { error: string }; expected: any }): Promise<string> {
    stubMlsForMount();
    try {
        const el = await mount<PluginEditStyleL3>(TAG);
        el.error = testCase.input.error;
        await el.updateComplete;
        const editorEl = query(el, 'collab-monaco-editor-102027');
        const result = {
            hasErrorHeading: !!query(el, 'h3'),
            editorStyleAttr: editorEl?.getAttribute('style') ?? null,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}
