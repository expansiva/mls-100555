/// <mls fileReference="_100555_/l2/pluginArchitecture/pluginQuestionArchitecture.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify, overrideMls } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginQuestionArchitecture } from '/_100555_/l2/pluginArchitecture/pluginQuestionArchitecture.js';

const TAG = 'plugin-architecture--plugin-question-architecture-100555';

// _callAgent() is a private instance method, not exposed via mls.*, so it's overridden directly
// on the mounted element instance (plain JS assignment) instead of via overrideMls().

export const tests: IPluginTestCase[] = [

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testAskAgentEmptyQuestion', env: 'browser', params: [
        { expected: { loading: false, hasResult: false } },
    ]},

    { functionName: 'testAskAgentSuccess', env: 'browser', params: [
        { input: { question: 'Where is the login flow?' },
          expected: { loading: false, hasResult: true, fileCount: 1, firstFileName: 'agentFoo', renderedDescription: 'Handles login', resultHeader: 'Arquivos encontrados' } },
    ]},

    // Real bug: _callAgent() returns '' (falsy) on its own internal error path. askAgent() then
    // does `if (!json) { this.result = undefined; return; }` — that `return` is inside the `try`
    // block and there is no `finally`, so `this.loading = false;` (placed right after the
    // try/catch) is skipped. `loading` stays stuck at `true` forever, and the "Ask" button
    // (bound with `?disabled=${this.loading}`) stays disabled until the component is re-mounted.
    { functionName: 'testAskAgentEmptyJsonBug', env: 'browser', params: [
        { expected: { loadingStuckTrue: true, hasResult: false } },
    ]},

    { functionName: 'testAskAgentNotFoundFlexible', env: 'browser', params: [
        { expected: { loading: false, hasResult: false } },
    ]},

    { functionName: 'testFireEvents', env: 'browser', params: [
        { expected: { setFullName: '_100555_pluginBar/pluginFoo', action: 'open', shortName: 'pluginFoo' } },
    ]},
];

export async function testSmoke(testCase: { expected: any }): Promise<string> {
    try {
        const result = await mountAndVerify(TAG, { scope: 'dashboard' });
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

// Guard: askAgent() returns immediately when the question is empty/whitespace-only,
// before ever touching `loading`/`result`.
export async function testAskAgentEmptyQuestion(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginQuestionArchitecture>(TAG, { scope: 'dashboard' });
        (el as any).question = '   ';
        await (el as any).askAgent();
        const result = { loading: (el as any).loading, hasResult: !!(el as any).result };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testAskAgentSuccess(testCase: { input: { question: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginQuestionArchitecture>(TAG, { scope: 'dashboard' });
        (el as any).question = testCase.input.question;
        // findFlexibleNodes() walks the whole object tree looking for `{ type: 'flexible' }` nodes
        // and reads `.result` off the first one found.
        (el as any)._callAgent = async () => ({
            type: 'flexible',
            result: { files: [{ file: 'agentFoo.defs', description: 'Handles login' }] },
        });
        await (el as any).askAgent();
        await el.updateComplete;

        // Quirk: the "files found" section header is a hardcoded Portuguese literal
        // (`<h3>Arquivos encontrados</h3>`) inside render(), unlike every other user-facing
        // string in this component, which goes through this.msg (message_pt/message_en).
        // It never switches to English even when document.documentElement.lang is 'en'.
        const result = {
            loading: (el as any).loading,
            hasResult: !!(el as any).result,
            fileCount: (el as any).result?.files?.length,
            firstFileName: query(el, '.file-name')?.textContent?.trim(),
            renderedDescription: query(el, '.file-desc')?.textContent?.trim(),
            resultHeader: query(el, '.result-area h3')?.textContent?.trim(),
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testAskAgentEmptyJsonBug(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginQuestionArchitecture>(TAG, { scope: 'dashboard' });
        (el as any).question = 'Where is the login flow?';
        (el as any)._callAgent = async () => '';
        await (el as any).askAgent();
        const result = { loadingStuckTrue: (el as any).loading === true, hasResult: !!(el as any).result };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

// When the agent's json has no `{ type: 'flexible' }` node, askAgent() throws internally
// ("Not found step flexible"), the catch swallows it (console.error), and — unlike the empty-json
// case above — `loading` correctly resets to false because the throw happens inside the try/catch,
// not via an early `return`.
export async function testAskAgentNotFoundFlexible(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginQuestionArchitecture>(TAG, { scope: 'dashboard' });
        (el as any).question = 'Where is the login flow?';
        (el as any)._callAgent = async () => ({ foo: 'bar' });
        await (el as any).askAgent();
        const result = { loading: (el as any).loading, hasResult: !!(el as any).result };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

// fireEvents() is the side effect behind clicking a found file (openFile() delegates to it).
// Captured here directly, mocking mls.actual/mls.actualLevel/mls.events as the "transport".
export async function testFireEvents(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginQuestionArchitecture>(TAG, { scope: 'dashboard' });
        const calls: { setFullName?: string; firePayload?: any } = {};
        const fakeFile = {
            level: 2, project: 100555, shortName: 'pluginFoo', extension: '.ts', folder: 'pluginBar',
            getOrCreateModel: async () => undefined,
        };
        overrideMls({
            actual: { 2: { setFullName: (name: string) => { calls.setFullName = name; } } },
            actualLevel: 2,
            events: { fire: (_levels: any, _types: any, payload: string, _timeout: number) => { calls.firePayload = JSON.parse(payload); } },
        });
        await (el as any).fireEvents('open', fakeFile as any);
        const result = {
            setFullName: calls.setFullName,
            action: calls.firePayload?.action,
            shortName: calls.firePayload?.shortName,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}
