/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleIndexItem.test.ts" enhancement="_blank" />

// Note: unlike the CSS editors in this folder, pluginStyleIndexItem is NOT a style editor -
// it's a list item/wrapper that renders info about ANOTHER style plugin (an `IHelpers`-like
// descriptor) and lazily mounts that plugin's tag inside a container when expanded/opened.

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify, overrideMls } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginStyleIndexItem } from '/_100555_/l2/pluginStyle/pluginStyleIndexItem.js';

import '/_100555_/l2/pluginStyle/pluginStyleIndexItem.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-style--plugin-style-index-item-100555';

function makeHelp(overrides: Partial<any> = {}): any {
    return {
        name: 'Padding',
        priority: 1,
        widget: '_100555_/l2/pluginStyle/pluginStylePadding.ts',
        tags: ['padding*'],
        description: 'Adjust paddings',
        mode: 'collapsed',
        liked: false,
        likedAnimation: false,
        showInfo: false,
        ...overrides,
    };
}

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    // mode defaults to 'collapsed', which means firstUpdated() does NOT try to open the wrapped
    // plugin - keeps the smoke test free of the (mls-dependent) dynamic tag resolution.
    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testHandleLikeClick', env: 'browser', params: [
        { input: { liked: false }, expected: { liked: true, likedAnimation: true } },
        { input: { liked: true }, expected: { liked: false, likedAnimation: false } },
    ]},

    { functionName: 'testHandleInfoClick', env: 'browser', params: [
        { input: { showInfo: false }, expected: { showInfo: true } },
        { input: { showInfo: true }, expected: { showInfo: false } },
    ]},

    // handleExpandedClick resolves `help.widget` into a tag via mls.actual[0].setFullName(...).getStorFileBase()
    // (utils.getPath) - mocked here via overrideMls, since it's real IDE project lookup infra.
    { functionName: 'testHandleExpandedClick', env: 'browser', params: [
        { expected: { modeAfterOpen: 'expanded', containerDisplayAfterOpen: 'block', modeAfterClose: 'collapsed' } },
    ]},

    // Edge case: without a `help`, every click handler is a safe no-op (guarded by `if (!this.help) return;`).
    { functionName: 'testHandlersNoopWithoutHelp', env: 'browser', params: [
        { expected: { threw: false, mode: 'collapsed' } },
    ]},
];

export async function testSmoke(testCase: { expected: any }): Promise<string> {
    try {
        const result = await mountAndVerify(TAG, { help: makeHelp() });
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleLikeClick(testCase: { input: { liked: boolean }; expected: any }): Promise<string> {
    try {
        const help = makeHelp({ liked: testCase.input.liked, likedAnimation: false });
        const el = await mount<PluginStyleIndexItem>(TAG, { help });
        await el.handleLikeClick({ stopPropagation: () => {} } as unknown as MouseEvent);
        const result = { liked: help.liked, likedAnimation: help.likedAnimation };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleInfoClick(testCase: { input: { showInfo: boolean }; expected: any }): Promise<string> {
    try {
        const help = makeHelp({ showInfo: testCase.input.showInfo });
        const el = await mount<PluginStyleIndexItem>(TAG, { help });
        await el.handleInfoClick({ stopPropagation: () => {} } as unknown as MouseEvent);
        const result = { showInfo: help.showInfo };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleExpandedClick(testCase: { expected: any }): Promise<string> {
    const restore = overrideMls({
        actual: [{ setFullName: () => ({ getStorFileBase: () => ({ folder: '', project: 100555, shortName: 'pluginStylePadding' }) }) }],
    });
    try {
        const help = makeHelp();
        const el = await mount<PluginStyleIndexItem>(TAG, { help });
        const icon = query(el, '.i-expanded') as HTMLElement;

        await el.handleExpandedClick({ stopPropagation: () => {}, target: icon } as unknown as MouseEvent);
        await el.updateComplete;
        const container = query(el, '.plugin-item-container') as HTMLElement;
        const modeAfterOpen = el.mode;
        const containerDisplayAfterOpen = container?.style.display;

        await el.handleExpandedClick({ stopPropagation: () => {}, target: icon } as unknown as MouseEvent);
        const modeAfterClose = el.mode;

        const result = { modeAfterOpen, containerDisplayAfterOpen, modeAfterClose };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        restore();
        cleanup();
    }
}

export async function testHandlersNoopWithoutHelp(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleIndexItem>(TAG, { help: undefined });
        let threw = false;
        try {
            await el.handleExpandedClick({ stopPropagation: () => {}, target: el } as unknown as MouseEvent);
            await el.handleLikeClick({ stopPropagation: () => {} } as unknown as MouseEvent);
            await el.handleInfoClick({ stopPropagation: () => {} } as unknown as MouseEvent);
        } catch {
            threw = true;
        }
        const result = { threw, mode: el.mode };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}
