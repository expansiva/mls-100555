/// <mls fileReference="_100555_/l2/pluginNewFile/pluginNewFileService.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginNewFileService } from '/_100555_/l2/pluginNewFile/pluginNewFileService.js';

const TAG = 'plugin-new-file--plugin-new-file-service-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // Unlike pluginNewFileAgent/pluginNewFileWebComponent (which widget-name only the shortName),
    // pluginNewFileService folds the folder into the widget name too (`folder/shortName`).
    { functionName: 'testGetTemplate', env: 'browser', params: [
        { input: { shortName: 'serviceFoo' }, expected: { hasClassName: true, widgetIncludesFolder: true } },
        { input: { shortName: 'serviceFoo', folder: 'sub' }, expected: { hasClassName: true, widgetIncludesFolder: true } },
    ]},

    // Both guard branches (missing name, and shortName not starting with "service") call
    // `this.service.setError(...)`. `service` is resolved via `this.closest(...)` in the
    // constructor, before the element is attached anywhere, so it is always null under mount()
    // and both branches throw instead of showing a friendly error (pre-existing bug shared by
    // all pluginNewFile* forms). The valid-name happy path is intentionally not exercised here:
    // it would fall through to the real createNewFile()/createAllFiles() IO path.
    { functionName: 'testHandleAddFileGuardThrows', env: 'browser', params: [
        { input: {}, expected: { threw: true } },
        { input: { project: 100555, shortName: 'notAService' }, expected: { threw: true } },
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

export async function testGetTemplate(testCase: { input: { shortName: string; folder?: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginNewFileService>(TAG, { project: 100555, shortName: testCase.input.shortName, folder: testCase.input.folder });
        const template = (el as any).getTemplate() as string;
        const expectedWidget = testCase.input.folder ? `_100555_${testCase.input.folder}/${testCase.input.shortName}` : `_100555_${testCase.input.shortName}`;
        const result = {
            hasClassName: template.includes('export class ServiceFoo100555'),
            widgetIncludesFolder: template.includes(expectedWidget),
        };
        compare(result, testCase.expected);
        return template;
    } finally {
        cleanup();
    }
}

export async function testHandleAddFileGuardThrows(testCase: { input: { project?: number; shortName?: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginNewFileService>(TAG, { project: testCase.input.project, shortName: testCase.input.shortName });
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
