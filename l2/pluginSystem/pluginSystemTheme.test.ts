/// <mls fileReference="_100555_/l2/pluginSystem/pluginSystemTheme.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData, PluginSystemTheme100555 } from '/_100555_/l2/pluginSystem/pluginSystemTheme.js';

import '/_100555_/l2/pluginSystem/pluginSystemTheme.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-system--plugin-system-theme-100555';

// IMPORTANT: this key is intentionally NOT namespaced to this project — it's shared with
// another part of the system living in a different project (mls-100554). We clear/restore it
// around every test that touches it to keep this suite isolated from that shared state.
const THEME_KEY = '_100554_serviceUserSettings_theme';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testAutoPrepareGuard', env: 'browser', params: [
        { input: { autoPrepare: false }, expected: { prepareCalled: false } },
        { input: { autoPrepare: true }, expected: { prepareCalled: true } },
    ]},

    // Note (current characteristic, not a bug fix target): like pluginSystemLanguage.ts,
    // getUserSettings() runs inside render() and mutates the reactive `actualTheme` property as
    // a side effect of rendering — the declared default ('default') is never observable after
    // the first render.
    { functionName: 'testGetUserSettings', env: 'browser', params: [
        { input: { storedTheme: 'dark' }, expected: { actualTheme: 'dark' } },
        { input: { storedTheme: 'light' }, expected: { actualTheme: 'light' } },
        { input: { storedTheme: null, osDark: true }, expected: { actualTheme: 'dark' } },
        { input: { storedTheme: null, osDark: false }, expected: { actualTheme: 'light' } },
    ]},

    // ---- vscode: pure logic, no DOM involved ----
    // Note: pluginSystemTheme.ts registers the customElement at module scope (@customElement),
    // so importing this file outside the browser requires a `customElements` stub in the vscode runner.
    // The assertion itself (pluginData.title/getSvg) doesn't use any DOM.

    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'Theme', svgHasSvgTag: true } },
    ]},
];

export async function testSmoke(testCase: { expected: any }): Promise<string> {
    const previous = localStorage.getItem(THEME_KEY);
    localStorage.removeItem(THEME_KEY);
    try {
        const result = await mountAndVerify(TAG);
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
        if (previous === null) localStorage.removeItem(THEME_KEY);
        else localStorage.setItem(THEME_KEY, previous);
    }
}

export async function testAutoPrepareGuard(testCase: { input: { autoPrepare: boolean }; expected: any }): Promise<string> {
    try {
        let prepareCalled = false;
        // Shadow the prototype's prepare() with an own-property spy assigned before the element
        // is appended (mount() does Object.assign() before appendChild).
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

export async function testGetUserSettings(testCase: { input: { storedTheme: string | null; osDark?: boolean }; expected: any }): Promise<string> {
    const previous = localStorage.getItem(THEME_KEY);
    const originalMatchMedia = window.matchMedia;
    try {
        if (testCase.input.storedTheme === null) localStorage.removeItem(THEME_KEY);
        else localStorage.setItem(THEME_KEY, testCase.input.storedTheme);

        if (typeof testCase.input.osDark === 'boolean') {
            (window as any).matchMedia = () => ({ matches: testCase.input.osDark }) as MediaQueryList;
        }

        const el = await mount<PluginSystemTheme100555>(TAG);
        const result = { actualTheme: el.actualTheme };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
        window.matchMedia = originalMatchMedia;
        if (previous === null) localStorage.removeItem(THEME_KEY);
        else localStorage.setItem(THEME_KEY, previous);
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
