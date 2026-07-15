/// <mls fileReference="_100555_/l2/pluginLink/pluginConfigLinks.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify, overrideMls } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginConfigLinks } from '/_100555_/l2/pluginLink/pluginConfigLinks.js';

import '/_100555_/l2/pluginLink/pluginConfigLinks.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-link--plugin-config-links-100555';

// getConfigProject()/updateConfigProject() (libProjectConfig.js) are plain module-level imports,
// not exposed via mls.*, so they can't be swapped with overrideMls(). Instead we mock their own
// mls.stor dependency: mls.stor.getKeyToFiles(project, 5, 'project', '', '.json') is the real key
// format (5/'project'/'.json' are private constants copied here from libProjectConfig.ts), and we
// plant a fake configFile at that key in a spread copy of mls.stor.files.
// NOTE: getConfigProject() caches results in a module-level `projectConfig` map keyed by project
// number, shared by every test (and every other .test.ts in the same run). Each test below that
// touches it uses its own unique fake project number to avoid cross-test cache collisions.

// Quirk (not tested here, nothing to observe): PluginConfigLinks has a private `test` field with
// 4 hardcoded sample links (ChatGPT/GitHub/TechDrop/YouTube) that is never read anywhere in the
// class (not in render(), not in init()) — dead code/leftover fixture data.

function fakeConfigFile(links: any[]) {
    return {
        inLocalStorage: false,
        status: 'saved',
        versionRef: 'v1',
        getContent: async () => JSON.stringify({ links }),
    } as any;
}

export const tests: IPluginTestCase[] = [

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testInitLoadsLinksFromConfig', env: 'browser', params: [
        { expected: { linksCount: 1, firstTitle: 'GitHub', renderedLabel: 'GitHub' } },
    ]},

    { functionName: 'testAddLink', env: 'browser', params: [
        { input: { title: 'GitHub', url: 'https://github.com', color: '#123456' },
          expected: { linksCount: 1, title: 'GitHub', url: 'https://github.com', color: '#123456', titleInputCleared: true } },
    ]},

    { functionName: 'testAddLinkMissingFieldsAlert', env: 'browser', params: [
        { input: { title: '', url: '' }, expected: { linksCount: 0, alertShown: true } },
    ]},

    { functionName: 'testAddLinkDefaultColor', env: 'browser', params: [
        { input: { title: 'NoColor', url: 'https://example.com', color: '' }, expected: { color: '#000000' } },
    ]},

    { functionName: 'testClickDel', env: 'browser', params: [
        { expected: { linksCountAfter: 1, remainingTitle: 'B' } },
    ]},

    { functionName: 'testModeEditToggle', env: 'browser', params: [
        { expected: { afterSetModeEdit: true, afterRemoveModeEdit: false } },
    ]},
];

export async function testSmoke(testCase: { expected: any }): Promise<string> {
    try {
        const result = await mountAndVerify(TAG, { myLinks: [] });
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testInitLoadsLinksFromConfig(testCase: { expected: any }): Promise<string> {
    try {
        const FAKE_PROJECT = 990101;
        const key = mls.stor.getKeyToFiles(FAKE_PROJECT, 5, 'project', '', '.json');
        overrideMls({ actualProject: FAKE_PROJECT });
        overrideMls({ stor: { ...mls.stor, files: { ...mls.stor.files, [key]: fakeConfigFile([{ title: 'GitHub', url: 'https://github.com', color: '#000000' }]) } } });

        const el = await mount<PluginConfigLinks>(TAG, {});
        await el.prepare();

        const result = {
            linksCount: el.myLinks.length,
            firstTitle: el.myLinks[0]?.title,
            renderedLabel: query(el, 'label')?.textContent?.trim(),
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testAddLink(testCase: { input: { title: string; url: string; color: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginConfigLinks>(TAG, { myLinks: [] });
        const editEl = query(el, 'content-edit') as HTMLElement;
        const titleInput = query(editEl, 'input[ref="title"]') as HTMLInputElement;
        (titleInput).value = testCase.input.title;
        (query(editEl, 'input[ref="url"]') as HTMLInputElement).value = testCase.input.url;
        (query(editEl, 'input[ref="color"]') as HTMLInputElement).value = testCase.input.color;

        await (el as any).addLink({ target: editEl } as unknown as MouseEvent);

        const result = {
            linksCount: el.myLinks.length,
            title: el.myLinks[0]?.title,
            url: el.myLinks[0]?.url,
            color: el.myLinks[0]?.color,
            titleInputCleared: titleInput.value === '',
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

// Guard: missing title or url triggers alert('fill all the fields!') and the link is NOT added.
export async function testAddLinkMissingFieldsAlert(testCase: { input: { title: string; url: string }; expected: any }): Promise<string> {
    const originalAlert = window.alert;
    let alertShown = false;
    window.alert = () => { alertShown = true; };
    try {
        const el = await mount<PluginConfigLinks>(TAG, { myLinks: [] });
        const editEl = query(el, 'content-edit') as HTMLElement;
        (query(editEl, 'input[ref="title"]') as HTMLInputElement).value = testCase.input.title;
        (query(editEl, 'input[ref="url"]') as HTMLInputElement).value = testCase.input.url;

        await (el as any).addLink({ target: editEl } as unknown as MouseEvent);

        const result = { linksCount: el.myLinks.length, alertShown };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        window.alert = originalAlert;
        cleanup();
    }
}

// Edge case: an empty color input falls back to '#000000'.
export async function testAddLinkDefaultColor(testCase: { input: { title: string; url: string; color: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginConfigLinks>(TAG, { myLinks: [] });
        const editEl = query(el, 'content-edit') as HTMLElement;
        (query(editEl, 'input[ref="title"]') as HTMLInputElement).value = testCase.input.title;
        (query(editEl, 'input[ref="url"]') as HTMLInputElement).value = testCase.input.url;
        (query(editEl, 'input[ref="color"]') as HTMLInputElement).value = testCase.input.color;

        await (el as any).addLink({ target: editEl } as unknown as MouseEvent);

        const result = { color: el.myLinks[0]?.color };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testClickDel(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginConfigLinks>(TAG, {
            myLinks: [
                { title: 'A', url: 'https://a.example', color: '#111111' },
                { title: 'B', url: 'https://b.example', color: '#222222' },
            ],
        });

        const delSvg = query(el, 'svg.del-link[index="0"]') as unknown as HTMLElement;
        (el as any).clickDel({ target: delSvg, stopPropagation: () => {} } as unknown as MouseEvent);

        const result = { linksCountAfter: el.myLinks.length, remainingTitle: el.myLinks[0]?.title };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testModeEditToggle(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginConfigLinks>(TAG, { myLinks: [] });
        (el as any).setModeEdit();
        const afterSetModeEdit = el.classList.contains('mode-edit');
        (el as any).removeModeEdit();
        const afterRemoveModeEdit = el.classList.contains('mode-edit');

        const result = { afterSetModeEdit, afterRemoveModeEdit };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}
