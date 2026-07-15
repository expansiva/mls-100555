/// <mls fileReference="_100555_/l2/pluginExplore/pluginExploreListAddL4.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginExploreListAddL4 } from '/_100555_/l2/pluginExplore/pluginExploreListAddL4.js';

import '/_100555_/l2/pluginExplore/pluginExploreListAddL4.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-explore--plugin-explore-list-add-l4-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // Same as AddL3's getNewNameAndValid(): no local regex, delegates straight to isNameValid(), whose
    // early checks short-circuit before touching mls.stor.files — deterministic regardless of the real
    // project currently open in the IDE.
    { functionName: 'testGetNewNameAndValid', env: 'browser', params: [
        { input: { prj: 1, name: '', folder: '' }, expected: { isValid: false } },
        { input: { prj: 1, name: 'my name', folder: '' }, expected: { isValid: false } },
        { input: { prj: 1, name: '123', folder: '' }, expected: { isValid: false } },
        { input: { prj: 1, name: '1abc', folder: '' }, expected: { isValid: false } },
        { input: { prj: 0, name: 'ValidLookingName', folder: '' }, expected: { isValid: false } },
    ]},

    // With `modules` empty (default, since autoPrepare is false) the <select id="iptModule"> has no
    // <option>, so its `.value` is '' — verifyModuleConfig() must throw 'Not found module' rather than
    // proceeding to look up a module file in mls.stor.
    { functionName: 'testVerifyModuleConfigThrowsWhenNoModule', env: 'browser', params: [
        { expected: { thrown: 'Not found module' } },
    ]},

    { functionName: 'testRenderShowsFormContainer', env: 'browser', params: [
        { expected: { hasFormContainer: true, hasModuleSelect: true, hasPageInput: true, hasPromptTextarea: true } },
    ]},

    // autoPrepare defaults to false, so firstUpdated() returns immediately without calling
    // prepare()/init() — `modules` should stay at its initial empty state.
    { functionName: 'testFirstUpdatedSkipsInitWhenAutoPrepareFalse', env: 'browser', params: [
        { expected: { modules: [] } },
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

export async function testGetNewNameAndValid(testCase: { input: { prj: number; name: string; folder: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginExploreListAddL4>(TAG, {});
        const isValid = (el as any).getNewNameAndValid(testCase.input.prj, testCase.input.name, testCase.input.folder);
        const result = { isValid };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testVerifyModuleConfigThrowsWhenNoModule(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginExploreListAddL4>(TAG, {});
        let thrown = '';
        try {
            (el as any).verifyModuleConfig();
        } catch (e: any) {
            thrown = e.message;
        }
        const result = { thrown };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testRenderShowsFormContainer(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginExploreListAddL4>(TAG, {});
        const result = {
            hasFormContainer: !!query(el, '.form-container'),
            hasModuleSelect: !!query(el, '#iptModule'),
            hasPageInput: !!query(el, '#iptPage'),
            hasPromptTextarea: !!query(el, '#iptPrompt'),
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testFirstUpdatedSkipsInitWhenAutoPrepareFalse(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginExploreListAddL4>(TAG, { autoPrepare: false });
        const result = { modules: el.modules };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}
