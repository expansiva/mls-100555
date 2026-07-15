/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectFindFiles.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData, PluginProjectFindFiles } from '/_100555_/l2/pluginProject/pluginProjectFindFiles.js';

import '/_100555_/l2/pluginProject/pluginProjectFindFiles.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-project--plugin-project-find-files-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testRenderRespectsScope', env: 'browser', params: [
        { input: { scope: 'dashboard' }, expected: { containerRendered: true } },
        { input: { scope: 'detail' }, expected: { containerRendered: false } },
    ]},

    // Peculiarity: passing `mode: 'map'` as a mount property (different from the class default
    // 'list') makes Lit's `updated()` see 'mode' as changed on the very first update, which
    // auto-triggers `configMode()` — so the mind-map widget already renders (with just the root
    // node, since `matchedFiles` is still empty) even though no search ever ran.
    { functionName: 'testRenderModeSwitch', env: 'browser', params: [
        { input: { mode: 'list' }, expected: { hasResultsList: true, hasMindMap: false } },
        { input: { mode: 'map' }, expected: { hasResultsList: false, hasMindMap: false } },
    ]},

    // `configMode()` silently drops any matched file that no longer exists in `mls.stor.files` —
    // only the root "findFiles" node survives when every matched key is unknown to the project.
    { functionName: 'testConfigModeDropsMissingFiles', env: 'browser', params: [
        { input: { matchedFiles: ['definitely_missing_key_1', 'definitely_missing_key_2'] }, expected: { nodeCount: 1, current: 'findFiles' } },
    ]},

    // ---- vscode: pure logic, no DOM involved ----

    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'Find in Files', svgHasSvgTag: true } },
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
        const el = await mount<PluginProjectFindFiles>(TAG, { scope: testCase.input.scope as any });
        const result = { containerRendered: !!query(el, '.plugin-container') };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testRenderModeSwitch(testCase: { input: { mode: 'list' | 'map' }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginProjectFindFiles>(TAG, { scope: 'dashboard', mode: testCase.input.mode });
        const result = {
            hasResultsList: !!query(el, '.results-list'),
            hasMindMap: !!query(el, 'widget-mind-map-l4-100554'),
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testConfigModeDropsMissingFiles(testCase: { input: { matchedFiles: string[] }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginProjectFindFiles>(TAG, { scope: 'dashboard' });
        (el as any).matchedFiles = testCase.input.matchedFiles;
        (el as any).configMode();
        const dataJson = (el as any).dataJson;
        const result = { nodeCount: dataJson.nodes.length, current: dataJson.current };
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
