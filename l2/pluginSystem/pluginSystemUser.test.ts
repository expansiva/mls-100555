/// <mls fileReference="_100555_/l2/pluginSystem/pluginSystemUser.test.ts" enhancement="_blank" />

// NOTE (pre-existing bug in pluginSystemUser.ts, NOT fixed here): the exported class is named
// `PluginSystemLanguage100555` — a copy/paste leftover from pluginSystemLanguage.ts. It should
// be named something like `PluginSystemUser100555`. To avoid confusion with the (different,
// correctly named) class from pluginSystemLanguage.ts, this file mounts by the literal tag
// string and only imports `pluginData` (which is not affected by the misnaming).
import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData } from '/_100555_/l2/pluginSystem/pluginSystemUser.js';

import '/_100555_/l2/pluginSystem/pluginSystemUser.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-system--plugin-system-user-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testAutoPrepareGuard', env: 'browser', params: [
        { input: { autoPrepare: false }, expected: { prepareCalled: false } },
        { input: { autoPrepare: true }, expected: { prepareCalled: true } },
    ]},

    // init() reads the 'show' attribute off a real `<collab-console>` element in the document,
    // if one exists, to seed `consoleEnabled`.
    { functionName: 'testInitConsoleState', env: 'browser', params: [
        { input: { showAttr: null }, expected: { consoleEnabled: false } },
        { input: { showAttr: 'true' }, expected: { consoleEnabled: true } },
        { input: { showAttr: 'false' }, expected: { consoleEnabled: false } },
    ]},

    // onChangeConsoleEnabled() writes the checkbox state back onto the `<collab-console>`
    // element's 'show' attribute (no location.reload() side effect here, unlike the language/
    // theme siblings' click handlers, so it's safe to exercise directly through a real DOM event).
    { functionName: 'testOnChangeConsoleEnabled', env: 'browser', params: [
        { input: { checked: true }, expected: { showAttr: 'true' } },
        { input: { checked: false }, expected: { showAttr: 'false' } },
    ]},

    // ---- vscode: pure logic, no DOM involved ----
    // Note: pluginSystemUser.ts registers the customElement at module scope (@customElement),
    // so importing this file outside the browser requires a `customElements` stub in the vscode runner.
    // The assertion itself (pluginData.title/getSvg) doesn't use any DOM.
    //
    // Also note (current characteristic, not fixed here): pluginData.title is "User Preferencies"
    // — a typo for "User Preferences" already present in the source; the expected value below
    // intentionally preserves it verbatim.
    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'User Preferencies', svgHasSvgTag: true } },
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

export async function testInitConsoleState(testCase: { input: { showAttr: string | null }; expected: any }): Promise<string> {
    let consoleEl: HTMLElement | null = null;
    try {
        if (testCase.input.showAttr !== null) {
            consoleEl = document.createElement('collab-console');
            consoleEl.setAttribute('show', testCase.input.showAttr);
            document.body.appendChild(consoleEl);
        }
        const el = await mount<any>(TAG);
        // init() has no internal `await`, so its side effect on `consoleEnabled` already runs
        // synchronously when called; calling prepare() explicitly here (rather than relying on
        // the fire-and-forget call from firstUpdated()) makes completion deterministic for the test.
        await el.prepare();
        const result = { consoleEnabled: el.consoleEnabled };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        consoleEl?.remove();
        cleanup();
    }
}

export async function testOnChangeConsoleEnabled(testCase: { input: { checked: boolean }; expected: any }): Promise<string> {
    const consoleEl = document.createElement('collab-console');
    consoleEl.setAttribute('show', 'false');
    document.body.appendChild(consoleEl);
    try {
        const el = await mount<any>(TAG);
        const input = query(el, '#console-input') as HTMLInputElement;
        input.checked = testCase.input.checked;
        input.dispatchEvent(new Event('change'));
        const result = { showAttr: consoleEl.getAttribute('show') };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        consoleEl.remove();
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
