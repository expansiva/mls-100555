/// <mls fileReference="_100555_/l2/pluginNewFile/pluginNewFileWebComponent.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginNewFileWebComponent } from '/_100555_/l2/pluginNewFile/pluginNewFileWebComponent.js';

import '/_100555_/l2/pluginNewFile/pluginNewFileWebComponent.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-new-file--plugin-new-file-web-component-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // getTemplate() calls changeWidget() on this template, but the template has no
    // `[widgetName]` placeholder at all (unlike pluginNewFileService/pluginNewFilePage) — the
    // call is a harmless no-op, nothing widget-named ever appears in the output.
    { functionName: 'testGetTemplate', env: 'browser', params: [
        { input: { project: 100555, shortName: 'myWidget' },
          expected: { hasTag: true, hasClassName: true, widgetSubstitutionIsNoOp: true } },
    ]},

    // Same missing-service bug as the other pluginNewFile* forms: `service` is resolved via
    // `this.closest(...)` in the constructor, before the element is attached anywhere, so it is
    // always null under mount() and the guard throws instead of showing a friendly error.
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

export async function testGetTemplate(testCase: { input: { project: number; shortName: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginNewFileWebComponent>(TAG, { project: testCase.input.project, shortName: testCase.input.shortName });
        const template = (el as any).getTemplate() as string;
        const result = {
            hasTag: template.includes(`@customElement('my-widget-100555')`),
            hasClassName: template.includes('export class MyWidget100555'),
            widgetSubstitutionIsNoOp: !template.includes('_100555_myWidget'),
        };
        compare(result, testCase.expected);
        return template;
    } finally {
        cleanup();
    }
}

export async function testHandleAddFileGuardThrows(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginNewFileWebComponent>(TAG);
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
