/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectDetail.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData, PluginProjectDetail } from '/_100555_/l2/pluginProject/pluginProjectDetail.js';
import '/_100555_/l2/pluginProject/pluginProjectDetail.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

import '/_100555_/l2/pluginProject/pluginProjectInfo.js';

const TAG = 'plugin-project--plugin-project-detail-100555';
const INFO_TAG = 'plugin-project--plugin-project-info-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // Unlike its siblings, `render()` here never checks `this.scope` — the "Project" details/summary
    // and the <contentprojectinfo> placeholder are always rendered, even with scope 'detail'.
    { functionName: 'testRendersRegardlessOfScope', env: 'browser', params: [
        { input: { scope: 'dashboard' }, expected: { hasContentProjectInfo: true, hasContentProject: true } },
        { input: { scope: 'detail' }, expected: { hasContentProjectInfo: true, hasContentProject: true } },
    ]},

    // `loadProject()` is a one-shot flow gated by `localStorage.getItem('serviceDetail')`; with no
    // key present it must bail out before touching either placeholder container.
    { functionName: 'testLoadProjectNoServiceDetail', env: 'browser', params: [
        { expected: { infoEmpty: true, projectEmpty: true } },
    ]},

    // With a 'serviceDetail' entry present (pointing at the currently open project, to avoid a real
    // `loadProjectInfoIfNeeded` network call for a different one), it injects the info plugin tag
    // and consumes/removes the localStorage entry (one-shot).
    { functionName: 'testLoadProjectFromServiceDetail', env: 'browser', params: [
        { expected: { infoTagInjected: true, projectContentSet: true, serviceDetailConsumed: true } },
    ]},

    // ---- vscode: pure logic, no DOM involved ----

    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'Project Detail', svgHasSvgTag: true } },
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

export async function testRendersRegardlessOfScope(testCase: { input: { scope: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginProjectDetail>(TAG, { scope: testCase.input.scope as any });
        const result = {
            hasContentProjectInfo: !!query(el, 'contentprojectinfo'),
            hasContentProject: !!query(el, 'contentproject'),
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testLoadProjectNoServiceDetail(testCase: { expected: any }): Promise<string> {
    const prevValue = localStorage.getItem('serviceDetail');
    localStorage.removeItem('serviceDetail');
    try {
        const el = await mount<PluginProjectDetail>(TAG);
        await (el as any).loadProject();
        const result = {
            infoEmpty: (el as any).contentprojectinfo?.innerHTML === '',
            projectEmpty: (el as any).contentproject?.innerHTML === '',
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        if (prevValue !== null) localStorage.setItem('serviceDetail', prevValue);
        cleanup();
    }
}

export async function testLoadProjectFromServiceDetail(testCase: { expected: any }): Promise<string> {
    const prevValue = localStorage.getItem('serviceDetail');
    try {
        const project = mls.actualProject;
        if (!project) throw new Error('No active project in the IDE — this test needs one open, same precondition the plugin runner itself relies on.');
        const el = await mount<PluginProjectDetail>(TAG);
        localStorage.setItem('serviceDetail', JSON.stringify({ prj: project }));
        await (el as any).loadProject();
        const result = {
            infoTagInjected: !!(el as any).contentprojectinfo?.innerHTML.includes(INFO_TAG),
            projectContentSet: !!(el as any).contentproject?.innerHTML,
            serviceDetailConsumed: localStorage.getItem('serviceDetail') === null,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        localStorage.removeItem('serviceDetail');
        if (prevValue !== null) localStorage.setItem('serviceDetail', prevValue);
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
