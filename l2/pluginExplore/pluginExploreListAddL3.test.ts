/// <mls fileReference="_100555_/l2/pluginExplore/pluginExploreListAddL3.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginExploreListAddL3 } from '/_100555_/l2/pluginExplore/pluginExploreListAddL3.js';

const TAG = 'plugin-explore--plugin-explore-list-add-l3-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // Unlike AddL1/AddL2's getNewNameAndValid(), this one has no local whitespace/digit regex of its
    // own — it delegates straight to isNameValid(), which happens to run the same checks internally.
    // These branches short-circuit before ever touching mls.stor.files, so they're deterministic
    // regardless of the real project currently open in the IDE.
    { functionName: 'testGetNewNameAndValid', env: 'browser', params: [
        { input: { prj: 1, name: '', folder: '' }, expected: { isValid: false } },
        { input: { prj: 1, name: 'my name', folder: '' }, expected: { isValid: false } },
        { input: { prj: 1, name: '123', folder: '' }, expected: { isValid: false } },
        { input: { prj: 1, name: '1abc', folder: '' }, expected: { isValid: false } },
        { input: { prj: 0, name: 'ValidLookingName', folder: '' }, expected: { isValid: false } },
    ]},

    { functionName: 'testRenderShowsFormContainer', env: 'browser', params: [
        { expected: { hasFormContainer: true, hasModuleSelect: true, hasOrganismInput: true, hasPromptTextarea: true } },
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
        const el = await mount<PluginExploreListAddL3>(TAG, {});
        const isValid = (el as any).getNewNameAndValid(testCase.input.prj, testCase.input.name, testCase.input.folder);
        const result = { isValid };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testRenderShowsFormContainer(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginExploreListAddL3>(TAG, {});
        const result = {
            hasFormContainer: !!query(el, '.form-container'),
            hasModuleSelect: !!query(el, '#iptModule'),
            hasOrganismInput: !!query(el, '#iptOrganism'),
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
        const el = await mount<PluginExploreListAddL3>(TAG, { autoPrepare: false });
        const result = { modules: el.modules };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}
