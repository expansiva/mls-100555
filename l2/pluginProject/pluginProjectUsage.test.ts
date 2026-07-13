/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectUsage.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData, PluginProjectUsage } from '/_100555_/l2/pluginProject/pluginProjectUsage.js';

const TAG = 'plugin-project--plugin-project-usage-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testRenderRespectsScope', env: 'browser', params: [
        { input: { scope: 'dashboard' }, expected: { containerRendered: true } },
        { input: { scope: 'detail' }, expected: { containerRendered: false } },
    ]},

    // `prepare()` only reads project data (settings/details/config/file count) — no writes — so it's
    // safe to run against the real open project. We assert shape, not exact values, since the numbers
    // depend on whatever project happens to be open when the runner executes.
    { functionName: 'testPrepare', env: 'browser', params: [
        { expected: { designSystemsIsNumber: true, filesIsNumber: true, lastModifiedIsString: true } },
    ]},

    // ---- vscode: pure logic, no DOM involved ----

    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'Usage', svgHasSvgTag: true } },
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
        const el = await mount<PluginProjectUsage>(TAG, { scope: testCase.input.scope as any });
        const result = { containerRendered: !!query(el, '.plugin-container') };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testPrepare(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginProjectUsage>(TAG, { scope: 'dashboard' });
        await el.prepare();
        const result = {
            designSystemsIsNumber: typeof el.designSystems === 'number',
            filesIsNumber: typeof el.files === 'number',
            lastModifiedIsString: typeof el.projectLastModified === 'string',
        };
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
