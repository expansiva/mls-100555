/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectReadMe.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData, PluginProjectReadMe } from '/_100555_/l2/pluginProject/pluginProjectReadMe.js';

import '/_100555_/l2/pluginProject/pluginProjectReadMe.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-project--plugin-project-read-me-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testRenderRespectsScope', env: 'browser', params: [
        { input: { scope: 'dashboard' }, expected: { containerRendered: true, hasEditor: true } },
        { input: { scope: 'detail' }, expected: { containerRendered: false, hasEditor: false } },
    ]},

    // `prepare()`/`setReadme()` create a real README.md file in the currently open project when one
    // doesn't exist yet (`this.createFile(...)`) — a genuine write to live project state, so it is
    // intentionally not exercised here. We only check the `autoPrepare` gate that guards it, the same
    // way `pluginProjectConfig.test.ts` does for its own Monaco-backed `prepare()`.
    { functionName: 'testAutoPrepareGuard', env: 'browser', params: [
        { input: { autoPrepare: false }, expected: { mkEditorHasCallback: false } },
    ]},

    // ---- vscode: pure logic, no DOM involved ----

    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'README.md', svgHasSvgTag: true } },
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
        const el = await mount<PluginProjectReadMe>(TAG, { scope: testCase.input.scope as any });
        const result = {
            containerRendered: !!query(el, '.plugin-container'),
            hasEditor: !!query(el, 'collab-edit-md-100554'),
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testAutoPrepareGuard(testCase: { input: { autoPrepare: boolean }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginProjectReadMe>(TAG, { scope: 'dashboard', autoPrepare: testCase.input.autoPrepare });
        const result = { mkEditorHasCallback: !!(el as any).mkEditor?.cbFinishEdit };
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
