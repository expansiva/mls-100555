/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectConfig.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData, PluginProjectConfig } from '/_100555_/l2/pluginProject/pluginProjectConfig.js';

import '/_100555_/l2/pluginProject/pluginProjectConfig.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-project--plugin-project-config-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testRenderRespectsScope', env: 'browser', params: [
        { input: { scope: 'dashboard' }, expected: { containerRendered: true } },
        { input: { scope: 'detail' }, expected: { containerRendered: false } },
    ]},

    // `prepare()` creates a real Monaco editor (`monaco.editor.create`) and reads/writes the actual
    // open project's config via `libProjectConfig` — calling it here would leak a live editor instance
    // and could mutate real project state, so we only verify the `autoPrepare` gate that guards it
    // (mirrors `firstUpdated()`: prepare only runs automatically when `autoPrepare` is true).
    { functionName: 'testAutoPrepareGuard', env: 'browser', params: [
        { input: { autoPrepare: false }, expected: { modelCreated: false } },
    ]},

    // ---- vscode: pure logic, no DOM involved ----
    // Note: pluginProjectConfig.ts registers the customElement at module scope (@customElement),
    // so importing this file outside the browser requires a `customElements` stub in the vscode runner.
    // The assertion itself (pluginData.title/getSvg) doesn't use any DOM.

    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'Config', svgHasSvgTag: true } },
    ]},
];

export async function testSmoke(testCase: { expected: any }): Promise<string> {
    try {
        const result = await mountAndVerify(TAG, { scope: 'dashboard' });
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testRenderRespectsScope(testCase: { input: { scope: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginProjectConfig>(TAG, { scope: testCase.input.scope as any });
        const result = { containerRendered: !!query(el, '.plugin-container') };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testAutoPrepareGuard(testCase: { input: { autoPrepare: boolean }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginProjectConfig>(TAG, { scope: 'dashboard', autoPrepare: testCase.input.autoPrepare });
        const result = { modelCreated: !!(el as any).model };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testPluginData(testCase: { expected: any }): Promise<string> {
    const svg = pluginData.getSvg() as any;
    const svgText = Array.isArray(svg?.strings) ? svg.strings.join('') : String(svg);
    const result = {
        title: pluginData.title,
        svgHasSvgTag: svgText.includes('<svg'),
    };
    compare(result, testCase.expected);
    return JSON.stringify(result);
}
