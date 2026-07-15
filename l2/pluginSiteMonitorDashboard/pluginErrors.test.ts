/// <mls fileReference="_100555_/l2/pluginSiteMonitorDashboard/pluginErrors.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData, PluginErrors } from '/_100555_/l2/pluginSiteMonitorDashboard/pluginErrors.js';

import '/_100555_/l2/pluginSiteMonitorDashboard/pluginErrors.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-site-monitor-dashboard--plugin-errors-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // pluginErrors has no `mode` property — the filter itself picks which dataset is rendered.
    { functionName: 'testPrepare', env: 'browser', params: [
        { input: { filter: 'today' }, expected: { firstValue: 3, bodyHasWidget: true } },
        { input: { filter: 'week' }, expected: { firstValue: 14, bodyHasWidget: true } },
        { input: { filter: 'all' }, expected: { firstValue: 143, bodyHasWidget: true } },
    ]},

    { functionName: 'testHandleChange', env: 'browser', params: [
        { input: { selectedValue: 'week' }, expected: { filter: 'week' } },
        { input: { selectedValue: 'mounth' }, expected: { filter: 'mounth' } },
    ]},

    { functionName: 'testRenderRespectsScope', env: 'browser', params: [
        { input: { scope: 'dashboard' }, expected: { containerRendered: true } },
        { input: { scope: 'detail' }, expected: { containerRendered: false } },
    ]},

    // ---- vscode: pure logic, no DOM involved ----

    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'Errors', svgHasSvgTag: true } },
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

export async function testPrepare(testCase: { input: { filter: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginErrors>(TAG, { scope: 'dashboard', filter: testCase.input.filter });
        await el.prepare();
        const chartData = el.chartData as any;
        const result = {
            firstValue: chartData.dataset.source[0][1],
            bodyHasWidget: !!query(el, 'widget-collab-chart-100554'),
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleChange(testCase: { input: { selectedValue: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginErrors>(TAG, { scope: 'dashboard' });
        el.handleChange({ target: { value: testCase.input.selectedValue } } as unknown as MouseEvent);
        const result = { filter: el.filter };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testRenderRespectsScope(testCase: { input: { scope: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginErrors>(TAG, { scope: testCase.input.scope as any });
        const result = { containerRendered: !!query(el, '.plugin-container') };
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
