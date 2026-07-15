/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectRunTest.test.ts" enhancement="_blank" />

// pluginProjectRunTest.ts is itself a runner for PAGE tests (openBackground + iframe preview via
// waitForPreviewLoaded/TsTestAst) — different from the plugin runner these very tests execute under.
// End-to-end coverage would require mocking the Monaco compiler and the preview iframe, which is out
// of scope; instead we cover the pure calculation/formatting helpers in isolation, plus a smoke test.

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData, PluginProjectRunTest } from '/_100555_/l2/pluginProject/pluginProjectRunTest.js';

import '/_100555_/l2/pluginProject/pluginProjectRunTest.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-project--plugin-project-run-test-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testCountTotalTests', env: 'browser', params: [
        { input: { tests: { fileA: { tests: [{ functionName: 'a', params: [{}, {}] }, { functionName: 'b', params: [{}] }] } } }, expected: { total: 3 } },
        { input: { tests: {} }, expected: { total: 0 } },
    ]},

    // `calcProgress` guards `total <= 0` by returning early — it leaves `progress` at whatever it was
    // before, it does NOT reset it to 0. The second case captures that stale-value peculiarity.
    { functionName: 'testCalcProgress', env: 'browser', params: [
        { input: { sequence: [{ total: 10, actual: 5 }] }, expected: { progress: 50 } },
        { input: { sequence: [{ total: 4, actual: 1 }] }, expected: { progress: 25 } },
        { input: { sequence: [{ total: 10, actual: 5 }, { total: 0, actual: 3 }] }, expected: { progress: 50 } },
    ]},

    { functionName: 'testCreateResume', env: 'browser', params: [
        { input: { total: 5, success: 5, failed: 0 }, expected: { text: '5 tests executed — 5 passed, 0 failed.', hasSuccessIcon: true, hasFailedIcon: false } },
        { input: { total: 5, success: 0, failed: 5 }, expected: { text: '5 tests executed — 0 passed, 5 failed.', hasSuccessIcon: false, hasFailedIcon: true } },
    ]},

    { functionName: 'testCreateResumeFinal', env: 'browser', params: [
        { input: { total: 4, success: 3, failed: 1, start: 0, end: 400 }, expected: { hasExecutionTime: true, usesSecondsFormat: false, usesMsFormat: true } },
        { input: { total: 4, success: 3, failed: 1, start: 0, end: 2500 }, expected: { hasExecutionTime: true, usesSecondsFormat: true, usesMsFormat: false } },
        { input: { total: 0, success: 0, failed: 0, start: 0, end: 100 }, expected: { hasNA: true } },
    ]},

    // ---- vscode: pure logic, no DOM involved ----

    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'Run Tests', svgHasSvgTag: true } },
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

export async function testCountTotalTests(testCase: { input: { tests: any }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginProjectRunTest>(TAG);
        const total = (el as any).countTotalTests(testCase.input.tests);
        const result = { total };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testCalcProgress(testCase: { input: { sequence: { total: number; actual: number }[] }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginProjectRunTest>(TAG);
        for (const step of testCase.input.sequence) {
            (el as any).calcProgress(step.total, step.actual);
        }
        const result = { progress: el.progress };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testCreateResume(testCase: { input: { total: number; success: number; failed: number }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginProjectRunTest>(TAG);
        const node = (el as any).createResume(testCase.input.total, testCase.input.success, testCase.input.failed) as HTMLElement;
        const result = {
            text: node.textContent,
            hasSuccessIcon: node.innerHTML.includes('fa-check'),
            hasFailedIcon: node.innerHTML.includes('fa-times'),
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testCreateResumeFinal(testCase: { input: { total: number; success: number; failed: number; start: number; end: number }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginProjectRunTest>(TAG);
        const node = (el as any).createResumeFinal(testCase.input.total, testCase.input.success, testCase.input.failed, testCase.input.start, testCase.input.end) as HTMLElement;
        const html = node.innerHTML;
        const result: any = {};
        if ('hasExecutionTime' in testCase.expected) result.hasExecutionTime = html.includes('Execution Time');
        if ('usesSecondsFormat' in testCase.expected) result.usesSecondsFormat = /\d+\.\d{2}s/.test(html);
        if ('usesMsFormat' in testCase.expected) result.usesMsFormat = /\d+\.\d{2}ms/.test(html);
        if ('hasNA' in testCase.expected) result.hasNA = html.includes('N/A');
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
