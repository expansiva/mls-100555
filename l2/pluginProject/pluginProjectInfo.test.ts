/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectInfo.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData, PluginProjectInfo } from '/_100555_/l2/pluginProject/pluginProjectInfo.js';

const TAG = 'plugin-project--plugin-project-info-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testRenderRespectsScope', env: 'browser', params: [
        { input: { scope: 'dashboard' }, expected: { containerRendered: true } },
        { input: { scope: 'detail' }, expected: { containerRendered: false } },
    ]},

    // `addDependency()` has three early-return guards before it ever touches `mls.l5` —
    // each one is independently observable through `labelErrorDeps`.
    { functionName: 'testAddDependencyGuards', env: 'browser', params: [
        { input: { project: 5, newDepId: null, existingDeps: [] }, expected: { labelErrorDeps: 'Please enter the dependency ID.' } },
        { input: { project: 5, newDepId: 5, existingDeps: [] }, expected: { labelErrorDeps: 'You cannot add the project itself as a dependency.' } },
        { input: { project: 5, newDepId: 7, existingDeps: [{ id: 7, name: 'X', auth: 'public' }] }, expected: { labelErrorDeps: 'This dependency has already been added.' } },
    ]},

    // `moveDepUp`/`moveDepDown` guard the array boundaries (first item can't move up, last can't move down).
    { functionName: 'testMoveDep', env: 'browser', params: [
        { input: { method: 'up', index: 0, ids: [1, 2, 3] }, expected: { ids: [1, 2, 3] } },
        { input: { method: 'up', index: 1, ids: [1, 2, 3] }, expected: { ids: [2, 1, 3] } },
        { input: { method: 'down', index: 2, ids: [1, 2, 3] }, expected: { ids: [1, 2, 3] } },
        { input: { method: 'down', index: 0, ids: [1, 2, 3] }, expected: { ids: [2, 1, 3] } },
    ]},

    // ---- vscode: pure logic, no DOM involved ----

    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'Project Settings', svgHasSvgTag: true } },
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
        const el = await mount<PluginProjectInfo>(TAG, { scope: testCase.input.scope as any });
        const result = { containerRendered: !!query(el, '.plugin-container') };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testAddDependencyGuards(testCase: { input: { project: number; newDepId: number | null; existingDeps: { id: number; name: string; auth: string }[] }; expected: any }): Promise<string> {
    // `this.msg` is picked from `document.documentElement.lang` at render time, and the expected
    // strings below are the English copy — pin the language for the duration of this test so the
    // assertion doesn't depend on whatever language the real IDE happens to be running in.
    const prevLang = document.documentElement.lang;
    document.documentElement.lang = 'en';
    try {
        const el = await mount<PluginProjectInfo>(TAG, { scope: 'dashboard', project: testCase.input.project });
        (el as any).deps = testCase.input.existingDeps;
        (el as any).newDepId = testCase.input.newDepId;
        (el as any).addDependency();
        const result = { labelErrorDeps: el.labelErrorDeps };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        document.documentElement.lang = prevLang;
        cleanup();
    }
}

export async function testMoveDep(testCase: { input: { method: 'up' | 'down'; index: number; ids: number[] }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginProjectInfo>(TAG, { scope: 'dashboard' });
        (el as any).deps = testCase.input.ids.map((id) => ({ id, name: `dep${id}`, auth: 'public' }));
        if (testCase.input.method === 'up') {
            (el as any).moveDepUp(testCase.input.index);
        } else {
            (el as any).moveDepDown(testCase.input.index);
        }
        const result = { ids: (el as any).deps.map((d: any) => d.id) };
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
