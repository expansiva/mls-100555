/// <mls fileReference="_100555_/l2/pluginExplore/pluginExploreList.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify, overrideMls } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData, PluginExploreList } from '/_100555_/l2/pluginExplore/pluginExploreList.js';

const TAG = 'plugin-explore--plugin-explore-list-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // showAdd() maps mls.actualLevel -> mode and dynamically imports the matching sibling before switching.
    { functionName: 'testShowAdd', env: 'browser', params: [
        { input: { actualLevel: 1 }, expected: { mode: 'addL1' } },
        { input: { actualLevel: 2 }, expected: { mode: 'addL2' } },
        { input: { actualLevel: 3 }, expected: { mode: 'addL3' } },
        { input: { actualLevel: 4 }, expected: { mode: 'addL4' } },
    ]},

    // render() switches purely on `this.mode` and renders the matching sibling tag, regardless of
    // whether that sibling module was actually imported first (showAdd() normally does the import,
    // but nothing in render() enforces that ordering).
    { functionName: 'testRenderByMode', env: 'browser', params: [
        { input: { mode: 'addL1', tag: 'plugin-explore--plugin-explore-list-add-l1-100555' }, expected: { childRendered: true } },
        { input: { mode: 'addL2', tag: 'plugin-explore--plugin-explore-list-add-l2-100555' }, expected: { childRendered: true } },
        { input: { mode: 'addL3', tag: 'plugin-explore--plugin-explore-list-add-l3-100555' }, expected: { childRendered: true } },
        { input: { mode: 'addL4', tag: 'plugin-explore--plugin-explore-list-add-l4-100555' }, expected: { childRendered: true } },
    ]},

    // isValidNewName() short-circuits to false before ever touching mls.stor.files/mls.actualLevel,
    // so these branches are deterministic regardless of the real project currently open in the IDE.
    { functionName: 'testIsValidNewName', env: 'browser', params: [
        { input: { project: '', name: 'anything' }, expected: { isValid: false } },
        { input: { project: '100555', name: '' }, expected: { isValid: false } },
        { input: { project: '100555', name: 'a'.repeat(300) }, expected: { isValid: false } },
    ]},

    // filterArrayHistory() is a pure array filter — it never reads `this`.
    { functionName: 'testFilterArrayHistory', env: 'browser', params: [
        { input: {
            alvo: [
                { shortName: 'a', folder: '', extension: '.ts', project: 1 },
                { shortName: 'b', folder: '', extension: '.ts', project: 1 },
            ],
            base: [
                { shortName: 'a', folder: '', extension: '.ts', project: 1 },
            ],
        }, expected: { names: ['a'] } },
        { input: { alvo: [], base: [{ shortName: 'a', folder: '', extension: '.ts', project: 1 }] }, expected: { names: [] } },
        { input: {
            alvo: [{ shortName: 'a', folder: '', extension: '.less', project: 1 }],
            base: [{ shortName: 'a', folder: '', extension: '.ts', project: 1 }],
        }, expected: { names: [] } },
    ]},

    // getAllName() has several branches driven by modeView/filterProject/isHistory, and the two
    // `isHistory` checks are separate `if`s (not else-if) — when both apply, the second silently
    // overwrites the first. Cases below pin the real branch results, including that quirk and the
    // fact that modeView !== 0 drops the folder prefix even for the "current project" branch.
    { functionName: 'testGetAllName', env: 'browser', params: [
        { input: { modeView: 0, filterProject: 0, isHistory: false, project: 200, folder: 'sub', shortName: 'foo' },
          expected: { name: '_200_sub/foo' } },
        { input: { modeView: 0, filterProject: 100555, isHistory: false, project: 100555, folder: 'sub', shortName: 'foo' },
          expected: { name: 'sub/foo' } },
        { input: { modeView: 1, filterProject: 100555, isHistory: false, project: 100555, folder: 'sub', shortName: 'foo' },
          expected: { name: 'foo' } },
        { input: { modeView: 0, filterProject: 0, isHistory: true, project: 300, folder: 'sub', shortName: 'foo' },
          expected: { name: '300_sub/foo' } },
        { input: { modeView: 0, filterProject: 100555, isHistory: false, project: 100555, folder: '', shortName: 'foo', modeFilter: 'other' },
          expected: { name: 'foo.ts' } },
    ]},

    // ---- vscode: pure logic, no DOM involved ----
    // Note: pluginExploreList.ts registers the customElement at module scope (@customElement),
    // so importing this file outside the browser requires a `customElements` stub in the vscode runner.
    // The assertion itself (pluginData.title/getSvg) doesn't use any DOM.

    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'List', svgHasSvgTag: true } },
    ]},
];

export async function testSmoke(testCase: { expected: any }): Promise<string> {
    try {
        const result = await mountAndVerify(TAG, {});
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testShowAdd(testCase: { input: { actualLevel: number }; expected: any }): Promise<string> {
    try {
        overrideMls({ actualLevel: testCase.input.actualLevel });
        const el = await mount<PluginExploreList>(TAG, {});
        await (el as any).showAdd();
        const result = { mode: el.mode };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testRenderByMode(testCase: { input: { mode: string; tag: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginExploreList>(TAG, { mode: testCase.input.mode as any });
        const result = { childRendered: !!query(el, testCase.input.tag) };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testIsValidNewName(testCase: { input: { project: string; name: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginExploreList>(TAG, {});
        const fakeFile = {} as mls.stor.IFileInfo;
        const isValid = (el as any).isValidNewName(fakeFile, { mode: 'create', project: testCase.input.project, name: testCase.input.name, folder: '' });
        const result = { isValid };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testFilterArrayHistory(testCase: { input: { alvo: any[]; base: any[] }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginExploreList>(TAG, {});
        const filtered = (el as any).filterArrayHistory(testCase.input.alvo, testCase.input.base);
        const result = { names: filtered.map((f: any) => f.shortName) };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testGetAllName(testCase: { input: any; expected: any }): Promise<string> {
    try {
        overrideMls({ actualProject: 100555 });
        const el = await mount<PluginExploreList>(TAG, {});
        el.filterProject = testCase.input.filterProject;
        el.modeView = testCase.input.modeView;
        if (testCase.input.modeFilter) (el as any).modeFilter = testCase.input.modeFilter;
        const file = {
            project: testCase.input.project,
            folder: testCase.input.folder,
            shortName: testCase.input.shortName,
            extension: '.ts',
        } as mls.stor.IFileInfo;
        const name = (el as any).getAllName(file, !!testCase.input.isHistory);
        const result = { name };
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
