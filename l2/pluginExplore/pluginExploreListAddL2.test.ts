/// <mls fileReference="_100555_/l2/pluginExplore/pluginExploreListAddL2.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify, overrideMls } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { ServiceListFilesAdd100555 } from '/_100555_/l2/pluginExplore/pluginExploreListAddL2.js';

import '/_100555_/l2/pluginExplore/pluginExploreListAddL2.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-explore--plugin-explore-list-add-l2-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // getNewNameAndValid() short-circuits to fals e before ever touching mls.stor.files, so these
    // branches are deterministic regardless of the real project currently open in the IDE.
    { functionName: 'testGetNewNameAndValid', env: 'browser', params: [
        { input: { prj: 100555, name: '' }, expected: { isValid: false } },
        { input: { prj: 100555, name: 'my name' }, expected: { isValid: false } },
        { input: { prj: 100555, name: '123' }, expected: { isValid: false } },
        { input: { prj: 100555, name: '1abc' }, expected: { isValid: false } },
        { input: { prj: 0, name: 'ValidLookingName' }, expected: { isValid: false } },
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

