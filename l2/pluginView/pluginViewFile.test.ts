/// <mls fileReference="_100555_/l2/pluginView/pluginViewFile.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify, overrideMls } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData, PluginViewFile } from '/_100555_/l2/pluginView/pluginViewFile.js';

import '/_100555_/l2/pluginView/pluginViewFile.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-view--plugin-view-file-100555';

// QUIRKS (pre-existing behavior in pluginViewFile.ts, documented here, not fixed):
// 1) '.ogg' is listed in both isAudio() and isVideo(). renderViewMode() checks isAudio()
//    before isVideo(), so a real '.ogg' file always renders as <audio> — the '.ogg' entry
//    inside isVideo()'s list is dead code. Covered by testMediaTypeDetection below.
// 2) isReadableText() is defined but never called anywhere else in the file (dead code).
// 3) createEditor() stores its Monaco editor/host on window.editorTaskView /
//    window.elEditorDetailsView as global singletons. cleanup() never resets them, so
//    every mount of this plugin (including across these tests) reuses/steals the same
//    real Monaco editor DOM node instead of creating an independent one per instance.

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testMediaTypeDetection', env: 'browser', params: [
        { input: { extension: '.png' }, expected: { isImage: true, isAudio: false, isVideo: false } },
        { input: { extension: '.mp3' }, expected: { isImage: false, isAudio: true, isVideo: false } },
        { input: { extension: '.mp4' }, expected: { isImage: false, isAudio: false, isVideo: true } },
        // Quirk: '.ogg' matches both isAudio() and isVideo() — see QUIRKS note (1) above.
        { input: { extension: '.ogg' }, expected: { isImage: false, isAudio: true, isVideo: true } },
    ]},

    { functionName: 'testRenderNoFileSelected', env: 'browser', params: [
        { expected: { hasMessage: true, messageNotEmpty: true } },
    ]},

    { functionName: 'testInitWithTextFile', env: 'browser', params: [
        { input: { nameFile: 'sample.txt', extension: '.txt', content: 'hello world' },
          expected: { hasFile: true, extension: '.txt', current: 2, contentText: 'hello world' } },
    ]},

    { functionName: 'testInitWithBinaryFile', env: 'browser', params: [
        { input: { nameFile: 'sample.png', extension: '.png', url: 'blob://fake-url' },
          expected: { hasFile: true, extension: '.png', current: 1, contentUrl: 'blob://fake-url' } },
    ]},

    // ---- vscode: pure logic, no DOM involved ----
    // Note: pluginViewFile.ts registers the customElement at module scope (@customElement),
    // so importing this file outside the browser requires a `customElements` stub in the
    // vscode runner. The assertion itself (pluginData.title/getSvg) doesn't use any DOM.

    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'View File', svgHasSvgTag: true } },
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

export async function testMediaTypeDetection(testCase: { input: { extension: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginViewFile>(TAG);
        el.extension = testCase.input.extension;
        const result = {
            isImage: (el as any).isImage(),
            isAudio: (el as any).isAudio(),
            isVideo: (el as any).isVideo(),
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testRenderNoFileSelected(testCase: { expected: any }): Promise<string> {
    try {
        // Force an empty file table so mls.stor.files[''] (the default nameFile) is guaranteed
        // undefined. Not asserting on the exact message text since it depends on the app's
        // current language (getMessageKey() reads document.documentElement.lang).
        overrideMls({ stor: { files: {} } });
        const el = await mount<PluginViewFile>(TAG);
        const messageEl = query(el, 'p');
        const result = {
            hasMessage: !!messageEl,
            messageNotEmpty: !!(messageEl?.textContent ?? '').trim(),
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testInitWithTextFile(testCase: { input: { nameFile: string; extension: string; content: string }; expected: any }): Promise<string> {
    try {
        const fakeFile = {
            project: 100555,
            folder: '',
            shortName: testCase.input.nameFile.replace(testCase.input.extension, ''),
            extension: testCase.input.extension,
            versionRef: 1,
            getContent: async () => testCase.input.content,
        } as any;

        overrideMls({
            stor: {
                files: { [testCase.input.nameFile]: fakeFile },
                convertFileToFileReference: (f: any) => `_ref_${f.shortName}`,
                cache: { getURL: async () => '' },
            },
        });

        const el = await mount<PluginViewFile>(TAG, { nameFile: testCase.input.nameFile });
        // Call init() explicitly (rather than relying on the fire-and-forget call inside
        // firstUpdated) so its async work is fully settled before we assert.
        // Note: this sets current=2, which schedules updateEditorContent() (via updated())
        // to run in the background afterwards — exercising real Monaco model creation. That
        // is intentionally not awaited here; this test focuses on init()'s own state effects.
        await (el as any).init();

        const result = {
            hasFile: !!el.file,
            extension: el.extension,
            current: el.current,
            contentText: el.contentText,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testInitWithBinaryFile(testCase: { input: { nameFile: string; extension: string; url: string }; expected: any }): Promise<string> {
    try {
        const fakeFile = {
            project: 100555,
            folder: '',
            shortName: testCase.input.nameFile.replace(testCase.input.extension, ''),
            extension: testCase.input.extension,
            versionRef: 1,
            getContent: async () => undefined,
        } as any;

        overrideMls({
            stor: {
                files: { [testCase.input.nameFile]: fakeFile },
                convertFileToFileReference: (f: any) => `_ref_${f.shortName}`,
                cache: { getURL: async () => testCase.input.url },
            },
        });

        const el = await mount<PluginViewFile>(TAG, { nameFile: testCase.input.nameFile });
        await (el as any).init();

        const result = {
            hasFile: !!el.file,
            extension: el.extension,
            current: el.current,
            contentUrl: el.contentUrl,
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
