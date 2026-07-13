/// <mls fileReference="_100555_/l2/pluginNewFile/pluginNewFileAgent.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
// pluginNewFileAgent.ts exports its class as `PluginNewFileBlank` (pre-existing copy-paste bug —
// it should have been named `PluginNewFileAgent`). Importing with an alias so the test reads naturally.
import { PluginNewFileBlank as PluginNewFileAgent } from '/_100555_/l2/pluginNewFile/pluginNewFileAgent.js';

const TAG = 'plugin-new-file--plugin-new-file-agent-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // No folder is set: pluginNewFileAgent hardcodes a "/" before the shortName in the generated
    // fileReference path, so an empty folder produces a double slash (pre-existing bug, not fixed here).
    { functionName: 'testGetTemplateDefaultAgent', env: 'browser', params: [
        { input: { project: 100555, shortName: 'myAgent' },
          expected: { fileReferenceHasDoubleSlash: true, hasAgentName: true, hasAgentProject: true } },
    ]},

    { functionName: 'testGetTemplateTemplateTypeSwitch', env: 'browser', params: [
        { input: { templateType: 'agent' }, expected: { hasExecutionMode: false, hasBeforePromptStep: false } },
        { input: { templateType: 'agentParallel' }, expected: { hasExecutionMode: true, hasBeforePromptStep: true } },
        { input: { templateType: 'agentWithClarification' }, expected: { hasExecutionMode: false, hasBeforePromptStep: true } },
    ]},

    // `service` comes from `this.closest('service-detail-100554')`, evaluated as a field
    // initializer in the constructor — i.e. before the element is attached anywhere. So it is
    // always null under mount(), and the missing-name guard throws instead of showing the
    // friendly error message (pre-existing bug shared by all pluginNewFile* forms).
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

export async function testGetTemplateDefaultAgent(testCase: { input: { project: number; shortName: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginNewFileAgent>(TAG, { project: testCase.input.project, shortName: testCase.input.shortName });
        const template = (el as any).getTemplate() as string;
        const result = {
            fileReferenceHasDoubleSlash: template.includes(`_${testCase.input.project}_/l2//${testCase.input.shortName}.ts`),
            hasAgentName: template.includes(`agentName: "${testCase.input.shortName}"`),
            hasAgentProject: template.includes(`agentProject: ${testCase.input.project}`),
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testGetTemplateTemplateTypeSwitch(testCase: { input: { templateType: 'agent' | 'agentParallel' | 'agentWithClarification' }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginNewFileAgent>(TAG, { project: 100555, shortName: 'myAgent', templateType: testCase.input.templateType as any });
        const template = (el as any).getTemplate() as string;
        const result = {
            hasExecutionMode: template.includes('executionMode'),
            hasBeforePromptStep: template.includes('beforePromptStep'),
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleAddFileGuardThrows(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginNewFileAgent>(TAG);
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
