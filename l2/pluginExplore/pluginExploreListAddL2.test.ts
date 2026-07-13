/// <mls fileReference="_100555_/l2/pluginExplore/pluginExploreListAddL2.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify, overrideMls } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { ServiceListFilesAdd100555 } from '/_100555_/l2/pluginExplore/pluginExploreListAddL2.js';

const TAG = 'plugin-explore--plugin-explore-list-add-l2-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // getNewNameAndValid() short-circuits to false before ever touching mls.stor.files, so these
    // branches are deterministic regardless of the real project currently open in the IDE.
    { functionName: 'testGetNewNameAndValid', env: 'browser', params: [
        { input: { prj: 100555, name: '' }, expected: { isValid: false } },
        { input: { prj: 100555, name: 'my name' }, expected: { isValid: false } },
        { input: { prj: 100555, name: '123' }, expected: { isValid: false } },
        { input: { prj: 100555, name: '1abc' }, expected: { isValid: false } },
        { input: { prj: 0, name: 'ValidLookingName' }, expected: { isValid: false } },
    ]},

    // Same quirk as AddL1: handleInputInput() validates `this.inputShortName.value` (the #iptShortName
    // element found via @query), not `e.target.value`. Only when validation passes does the code switch
    // to using `e.target.value` to build the folder/shortName state (getPath/setState) — an inconsistency
    // we don't exercise here to avoid mutating the shared 'l2.addFile' state with unpredictable input.
    { functionName: 'testHandleInputInputUsesQueriedValue', env: 'browser', params: [
        { input: { queriedValue: 'bad name', targetValue: 'GoodName' }, expected: { error: 'Invalid shortName' } },
        { input: { queriedValue: '', targetValue: 'GoodName' }, expected: { error: 'Invalid shortName' } },
    ]},

    // Real quirk: render() computes `project = mls.actualProject || 0`, which coerces `undefined` to
    // `0` — so the `project !== undefined` check right after is always true, and the `this.msg.please`
    // fallback branch is dead code. The add-file form renders even with no project selected.
    { functionName: 'testRenderAlwaysShowsAddForm', env: 'browser', params: [
        { expected: { formRendered: true, inputRendered: true } },
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

export async function testGetNewNameAndValid(testCase: { input: { prj: number; name: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<ServiceListFilesAdd100555>(TAG, {});
        const isValid = (el as any).getNewNameAndValid(testCase.input.prj, testCase.input.name);
        const result = { isValid };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleInputInputUsesQueriedValue(testCase: { input: { queriedValue: string; targetValue: string }; expected: any }): Promise<string> {
    try {
        overrideMls({ actualProject: 100555 });
        const el = await mount<ServiceListFilesAdd100555>(TAG, {});
        const input = query(el, '#iptShortName') as HTMLInputElement;
        input.value = testCase.input.queriedValue;
        (el as any).handleInputInput({ target: { value: testCase.input.targetValue } });
        const result = { error: el.error };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testRenderAlwaysShowsAddForm(testCase: { expected: any }): Promise<string> {
    try {
        overrideMls({ actualProject: undefined });
        const el = await mount<ServiceListFilesAdd100555>(TAG, {});
        const result = {
            formRendered: !!query(el, '.section-add'),
            inputRendered: !!query(el, '#iptShortName'),
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}
