/// <mls fileReference="_100555_/l2/pluginSystem/pluginSystemLanguage.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData, PluginSystemLanguage100555 } from '/_100555_/l2/pluginSystem/pluginSystemLanguage.js';

import '/_100555_/l2/pluginSystem/pluginSystemLanguage.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-system--plugin-system-language-100555';

// Real key read/written by getUserLanguage()/setUserLanguage() — NOT the theme's shared
// '_100554_serviceUserSettings_theme' key, but still real localStorage, so we isolate it too.
const USER_SETTINGS_KEY = 'userSettings';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testAutoPrepareGuard', env: 'browser', params: [
        { input: { autoPrepare: false }, expected: { prepareCalled: false } },
        { input: { autoPrepare: true }, expected: { prepareCalled: true } },
    ]},

    // Note (current characteristic, not a bug fix target): `actualLanguage` is declared with a
    // default of 'pt-BR', but every render() call runs getUserLanguage() which unconditionally
    // overwrites it from localStorage — so the declared default is never observable after the
    // first render. getUserLanguage() is also invoked as a side effect *inside* render(), which
    // mutates a reactive property during rendering (a Lit anti-pattern), yet currently works
    // because it doesn't cause an update loop.
    { functionName: 'testGetUserLanguage', env: 'browser', params: [
        { input: { userSettings: null }, expected: { actualLanguage: 'default' } },
        { input: { userSettings: '{}' }, expected: { actualLanguage: 'default' } },
        { input: { userSettings: '{"language":"en-US"}' }, expected: { actualLanguage: 'en-US' } },
        { input: { userSettings: '{"language":"pt-BR"}' }, expected: { actualLanguage: 'pt-BR' } },
    ]},

    { functionName: 'testMessageLanguage', env: 'browser', params: [
        { input: { htmlLang: 'en' }, expected: { summaryText: 'Languages' } },
        { input: { htmlLang: 'pt' }, expected: { summaryText: 'Linguagens' } },
        { input: { htmlLang: '' }, expected: { summaryText: 'Languages' } },
    ]},

    // ---- vscode: pure logic, no DOM involved ----
    // Note: pluginSystemLanguage.ts registers the customElement at module scope (@customElement),
    // so importing this file outside the browser requires a `customElements` stub in the vscode runner.
    // The assertion itself (pluginData.title/getSvg) doesn't use any DOM.

    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'Language', svgHasSvgTag: true } },
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

export async function testAutoPrepareGuard(testCase: { input: { autoPrepare: boolean }; expected: any }): Promise<string> {
    try {
        let prepareCalled = false;
        // Shadow the prototype's prepare() with an own-property spy assigned before the element
        // is appended (mount() does Object.assign() before appendChild), so firstUpdated()'s
        // fire-and-forget this.prepare() call is observable without depending on init()'s internals.
        await mount<any>(TAG, {
            autoPrepare: testCase.input.autoPrepare,
            prepare: async () => { prepareCalled = true; },
        });
        const result = { prepareCalled };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testGetUserLanguage(testCase: { input: { userSettings: string | null }; expected: any }): Promise<string> {
    const previous = localStorage.getItem(USER_SETTINGS_KEY);
    try {
        if (testCase.input.userSettings === null) localStorage.removeItem(USER_SETTINGS_KEY);
        else localStorage.setItem(USER_SETTINGS_KEY, testCase.input.userSettings);
        const el = await mount<PluginSystemLanguage100555>(TAG);
        const result = { actualLanguage: el.actualLanguage };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
        if (previous === null) localStorage.removeItem(USER_SETTINGS_KEY);
        else localStorage.setItem(USER_SETTINGS_KEY, previous);
    }
}

export async function testMessageLanguage(testCase: { input: { htmlLang: string }; expected: any }): Promise<string> {
    const previousLang = document.documentElement.lang;
    try {
        document.documentElement.lang = testCase.input.htmlLang;
        const el = await mount<PluginSystemLanguage100555>(TAG);
        const summary = query(el, 'summary');
        const result = { summaryText: (summary?.textContent ?? '').trim() };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
        document.documentElement.lang = previousLang;
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
