/// <mls fileReference="_100555_/l2/pluginSiteMonitorDashboard/pluginActiveUsers.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData, PluginActiveUsers } from '/_100555_/l2/pluginSiteMonitorDashboard/pluginActiveUsers.js';

import '/_100555_/l2/pluginSiteMonitorDashboard/pluginActiveUsers.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-site-monitor-dashboard--plugin-active-users-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testPrepare', env: 'browser', params: [
        { input: { mode: 'full' },
          expected: { hasTitle: true, hasLegend: true, bodyHasWidget: true } },
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
    // Note: pluginActiveUsers.ts registers the customElement at module scope (@customElement),
    // so importing this file outside the browser requires a `customElements` stub in the vscode runner.
    // The assertion itself (pluginData.title/getSvg) doesn't use any DOM.

    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'Active Users', svgHasSvgTag: true } },
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
        const el = await mount<PluginActiveUsers>(TAG, { scope: 'dashboard', mode: testCase.input.mode });
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
        const el = await mount<PluginActiveUsers>(TAG, { scope: 'dashboard' });
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
        const el = await mount<PluginActiveUsers>(TAG, { scope: testCase.input.scope as any });
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
