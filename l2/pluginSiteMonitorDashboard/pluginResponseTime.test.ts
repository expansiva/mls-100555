/// <mls fileReference="_100555_/l2/pluginSiteMonitorDashboard/pluginResponseTime.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData, PluginResponseTime } from '/_100555_/l2/pluginSiteMonitorDashboard/pluginResponseTime.js';

const TAG = 'plugin-site-monitor-dashboard--plugin-response-time-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // pluginResponseTime never sets a legend — only `title` is gated by `mode`.
    { functionName: 'testPrepare', env: 'browser', params: [
        { input: { mode: 'full' },
          expected: { hasTitle: true, hasLegend: false, bodyHasWidget: true } },
        { input: { mode: 'simplified' },
          expected: { hasTitle: false, hasLegend: false, bodyHasWidget: true } },
    ]},

    { functionName: 'testHandleChange', env: 'browser', params: [
        { input: { selectedValue: 'week' }, expected: { filter: 'week' } },
        { input: { selectedValue: 'all' }, expected: { filter: 'all' } },
    ]},

    { functionName: 'testRenderRespectsScope', env: 'browser', params: [
        { input: { scope: 'dashboard' }, expected: { containerRendered: true } },
        { input: { scope: 'detail' }, expected: { containerRendered: false } },
    ]},

    // ---- vscode: pure logic, no DOM involved ----

    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'Response Time', svgHasSvgTag: true } },
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

export async function testPrepare(testCase: { input: { mode: 'simplified' | 'full' }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginResponseTime>(TAG, { scope: 'dashboard', mode: testCase.input.mode });
        await el.prepare();
        const result = {
            hasTitle: !!el.chartData.title,
            hasLegend: !!el.chartData.legend,
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
        const el = await mount<PluginResponseTime>(TAG, { scope: 'dashboard' });
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
        const el = await mount<PluginResponseTime>(TAG, { scope: testCase.input.scope as any });
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
