/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectDeleteFiles.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData, PluginProjectDeleteFiles } from '/_100555_/l2/pluginProject/pluginProjectDeleteFiles.js';

import '/_100555_/l2/pluginProject/pluginProjectDeleteFiles.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-project--plugin-project-delete-files-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testRenderRespectsScope', env: 'browser', params: [
        { input: { scope: 'dashboard' }, expected: { containerRendered: true } },
        { input: { scope: 'detail' }, expected: { containerRendered: false } },
    ]},

    // `getFileKey` builds the display/selection key for a file; the folder/no-folder branches
    // produce visibly different formats and are worth locking down.
    { functionName: 'testGetFileKey', env: 'browser', params: [
        { input: { project: 1, folder: 'sub', shortName: 'a', extension: '.ts' }, expected: { key: '_1_sub/a.ts' } },
        { input: { project: 1, folder: '', shortName: 'a', extension: '.ts' }, expected: { key: '_1_a.ts' } },
    ]},

    // The "Delete" button only appears once `filesToDelete` has entries — set the state directly
    // (no need to run the real `onSearch()` network/storage flow) and check the rendered button count.
    { functionName: 'testDeleteButtonVisibility', env: 'browser', params: [
        { input: { fileCount: 0 }, expected: { buttonCount: 1 } },
        { input: { fileCount: 1 }, expected: { buttonCount: 2 } },
    ]},

    // ---- vscode: pure logic, no DOM involved ----

    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'Delete local files', svgHasSvgTag: true } },
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
        const el = await mount<PluginProjectDeleteFiles>(TAG, { scope: testCase.input.scope as any });
        const result = { containerRendered: !!query(el, '.plugin-container') };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testGetFileKey(testCase: { input: { project: number; folder: string; shortName: string; extension: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginProjectDeleteFiles>(TAG, { scope: 'dashboard' });
        const file = testCase.input as unknown as mls.stor.IFileInfo;
        const result = { key: (el as any).getFileKey(file) };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testDeleteButtonVisibility(testCase: { input: { fileCount: number }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginProjectDeleteFiles>(TAG, { scope: 'dashboard' });
        const files: mls.stor.IFileInfo[] = [];
        for (let i = 0; i < testCase.input.fileCount; i++) {
            files.push({ project: 1, folder: '', shortName: `file${i}`, extension: '.ts' } as unknown as mls.stor.IFileInfo);
        }
        el.filesToDelete = files;
        await el.updateComplete;
        const result = { buttonCount: el.querySelectorAll('button').length };
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
