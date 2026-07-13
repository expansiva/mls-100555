/// <mls fileReference="_100555_/l2/pluginProject/pluginGenerateDist.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData, PluginGenerateDist } from '/_100555_/l2/pluginProject/pluginGenerateDist.js';

const TAG = 'plugin-project--plugin-generate-dist-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // Unlike its siblings, `render()` never checks `this.scope` — it always shows either the resolved
    // tag or the default "agent-box" header, even with scope 'detail'.
    { functionName: 'testRendersRegardlessOfScope', env: 'browser', params: [
        { input: { scope: 'detail' }, expected: { rendered: true } },
    ]},

    // `hasExtension()` is pure string logic operating only on the last path segment.
    { functionName: 'testHasExtension', env: 'browser', params: [
        { input: { path: 'build/module.ts' }, expected: { hasExtension: true } },
        { input: { path: 'build/module' }, expected: { hasExtension: false } },
        { input: { path: 'module.js' }, expected: { hasExtension: true } },
        // Dot in a folder segment must not be confused with a file extension.
        { input: { path: 'folder.v2/module' }, expected: { hasExtension: false } },
    ]},

    // `init()` only reads the project's own project.js config (`getBuildByProject`) — no writes — so
    // it's safe to run for real. Every path through it ends in either `tag` or `error` being set.
    { functionName: 'testInitSetsTagOrError', env: 'browser', params: [
        { expected: { resolvedTagOrError: true } },
    ]},

    // ---- vscode: pure logic, no DOM involved ----

    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'Generate Dist', svgHasSvgTag: true } },
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

export async function testRendersRegardlessOfScope(testCase: { input: { scope: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginGenerateDist>(TAG, { scope: testCase.input.scope as any });
        const result = { rendered: el.childElementCount > 0 };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHasExtension(testCase: { input: { path: string }; expected: any }): Promise<string> {
    // Not appended to the document — avoids triggering connectedCallback/firstUpdated's real
    // dynamic import of the project's project.js via init().
    const el = document.createElement(TAG) as any;
    const result = { hasExtension: el.hasExtension(testCase.input.path) };
    compare(result, testCase.expected);
    return JSON.stringify(result);
}

export async function testInitSetsTagOrError(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginGenerateDist>(TAG);
        await (el as any).init();
        const result = { resolvedTagOrError: !!(el.tag || (el as any).error) };
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
