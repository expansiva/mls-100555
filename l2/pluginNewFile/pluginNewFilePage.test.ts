/// <mls fileReference="_100555_/l2/pluginNewFile/pluginNewFilePage.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginNewFilePage } from '/_100555_/l2/pluginNewFile/pluginNewFilePage.js';

const TAG = 'plugin-new-file--plugin-new-file-page-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // getTemplateTS() calls changeWidget() and changeStateName() on this template too, but the
    // template only has `[tagName]`/`[className]` placeholders — no `[widgetName]` or
    // `[stateName]` — so those two calls are harmless no-ops.
    { functionName: 'testGetTemplateTS', env: 'browser', params: [
        { input: { project: 100555, shortName: 'myPage' },
          expected: { hasTag: true, hasClassName: true, widgetSubstitutionIsNoOp: true, hasNoLeftoverPlaceholders: true } },
    ]},

    { functionName: 'testGetTemplateHTML', env: 'browser', params: [
        { input: { project: 100555, shortName: 'myPage' }, expected: { result: '<my-page-100555></my-page-100555>' } },
        { input: {}, expected: { result: '' } },
    ]},

    // Same missing-service bug as the other pluginNewFile* forms: `service` is resolved via
    // `this.closest(...)` in the constructor, before the element is attached anywhere, so it is
    // always null under mount() and the guard throws instead of showing a friendly error.
    // Note: the i18n bundle also defines an `errorPageName` message ("file name must start with
    // page"), but handleAddFile() never checks that shortName actually starts with "page" — the
    // message is unused/dead. Not exercised here since there is nothing to observe without a
    // service ancestor and without invoking the real createNewFile()/createAllFiles() IO path.
    { functionName: 'testHandleAddFileGuardThrows', env: 'browser', params: [
        { expected: { threw: true } },
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

export async function testGetTemplateTS(testCase: { input: { project: number; shortName: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginNewFilePage>(TAG, { project: testCase.input.project, shortName: testCase.input.shortName });
        const template = (el as any).getTemplateTS() as string;
        const result = {
            hasTag: template.includes(`@customElement('my-page-100555')`),
            hasClassName: template.includes('export class MyPage100555'),
            widgetSubstitutionIsNoOp: !template.includes('_100555_myPage'),
            hasNoLeftoverPlaceholders: !template.includes('[tagName]') && !template.includes('[className]'),
        };
        compare(result, testCase.expected);
        return template;
    } finally {
        cleanup();
    }
}

export async function testGetTemplateHTML(testCase: { input: { project?: number; shortName?: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginNewFilePage>(TAG, { project: testCase.input.project, shortName: testCase.input.shortName });
        const result = { result: (el as any).getTemplateHTML() as string };
        compare(result, testCase.expected);
        return result.result;
    } finally {
        cleanup();
    }
}

export async function testHandleAddFileGuardThrows(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginNewFilePage>(TAG);
        let threw = false;
        try {
            await (el as any).handleAddFile();
        } catch (e) {
            threw = true;
        }
        const result = { threw };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}
