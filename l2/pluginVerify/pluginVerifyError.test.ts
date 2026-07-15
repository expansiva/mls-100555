/// <mls fileReference="_100555_/l2/pluginVerify/pluginVerifyError.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, overrideMls, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginVerifyError } from '/_100555_/l2/pluginVerify/pluginVerifyError.js';

import '/_100555_/l2/pluginVerify/pluginVerifyError.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-verify--plugin-verify-error-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
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