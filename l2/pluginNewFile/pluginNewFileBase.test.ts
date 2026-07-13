/// <mls fileReference="_100555_/l2/pluginNewFile/pluginNewFileBase.test.ts" enhancement="_blank" />

import { IPluginTestCase, compare } from '/_102027_/l2/plugins/pluginTestUtils.js';
import {
    changeClassName,
    changeWidget,
    changeShortName,
    changeTagName,
    changeProject,
    changeFolder,
    changeStateName,
    getTemplateImport,
    createNewFile,
} from '/_100555_/l2/pluginNewFile/pluginNewFileBase.js';

// pluginNewFileBase.ts has no @customElement/tag — it's a pure-function module used by the
// other pluginNewFile* forms, so every case here runs without a DOM.

export const tests: IPluginTestCase[] = [

    { functionName: 'testChangeClassName', env: 'vscode', params: [
        { input: { source: '[className]', project: 100555, shortName: 'foo' }, expected: { result: 'Foo100555' } },
    ]},

    { functionName: 'testChangeWidget', env: 'vscode', params: [
        { input: { source: '[widgetName]', project: 100555, shortName: 'foo' }, expected: { result: '_100555_foo' } },
    ]},

    { functionName: 'testChangeShortName', env: 'vscode', params: [
        { input: { source: '[shortName]', shortName: 'foo' }, expected: { result: 'foo' } },
    ]},

    { functionName: 'testChangeTagName', env: 'vscode', params: [
        { input: { source: '[tagName]', tagName: 'my-tag-100555' }, expected: { result: 'my-tag-100555' } },
    ]},

    { functionName: 'testChangeProject', env: 'vscode', params: [
        { input: { source: '[project]', project: 100555 }, expected: { result: '100555' } },
    ]},

    { functionName: 'testChangeFolder', env: 'vscode', params: [
        { input: { source: '[folder]', folder: 'sub' }, expected: { result: 'sub' } },
    ]},

    { functionName: 'testChangeStateName', env: 'vscode', params: [
        { input: { source: '[stateName]', stateName: 'myState' }, expected: { result: 'myState' } },
    ]},

    { functionName: 'testGetTemplateImport', env: 'vscode', params: [
        { input: { project: 100554, shortName: 'aiAgentBase', folder: '' }, expected: { result: '/_100554_/l2/aiAgentBase.js' } },
        { input: { project: 100554, shortName: 'aiAgentBase', folder: 'sub' }, expected: { result: '/_100554_/l2/sub/aiAgentBase.js' } },
    ]},

    // createNewFile() runs isNameValid(...) before touching createAllFiles()/mls.stor, so an
    // invalid shortName throws synchronously without any real file IO — safe to exercise directly.
    { functionName: 'testCreateNewFileInvalidName', env: 'vscode', params: [
        { input: { shortName: 'my file' }, expected: { threw: true, messageMentionsInvalidName: true } },
        { input: { shortName: '123startsWithDigit' }, expected: { threw: true, messageMentionsInvalidName: true } },
    ]},
];

export async function testChangeClassName(testCase: { input: { source: string; project: number; shortName: string }; expected: any }): Promise<string> {
    const result = changeClassName(testCase.input.source, testCase.input.project, testCase.input.shortName);
    compare({ result }, testCase.expected);
    return result;
}

export async function testChangeWidget(testCase: { input: { source: string; project: number; shortName: string }; expected: any }): Promise<string> {
    const result = changeWidget(testCase.input.source, testCase.input.project, testCase.input.shortName);
    compare({ result }, testCase.expected);
    return result;
}

export async function testChangeShortName(testCase: { input: { source: string; shortName: string }; expected: any }): Promise<string> {
    const result = changeShortName(testCase.input.source, testCase.input.shortName);
    compare({ result }, testCase.expected);
    return result;
}

export async function testChangeTagName(testCase: { input: { source: string; tagName: string }; expected: any }): Promise<string> {
    const result = changeTagName(testCase.input.source, testCase.input.tagName);
    compare({ result }, testCase.expected);
    return result;
}

export async function testChangeProject(testCase: { input: { source: string; project: number }; expected: any }): Promise<string> {
    const result = changeProject(testCase.input.source, testCase.input.project);
    compare({ result }, testCase.expected);
    return result;
}

export async function testChangeFolder(testCase: { input: { source: string; folder: string }; expected: any }): Promise<string> {
    const result = changeFolder(testCase.input.source, testCase.input.folder);
    compare({ result }, testCase.expected);
    return result;
}

export async function testChangeStateName(testCase: { input: { source: string; stateName: string }; expected: any }): Promise<string> {
    const result = changeStateName(testCase.input.source, testCase.input.stateName);
    compare({ result }, testCase.expected);
    return result;
}

export async function testGetTemplateImport(testCase: { input: { project: number; shortName: string; folder: string }; expected: any }): Promise<string> {
    const result = getTemplateImport(testCase.input.project, testCase.input.shortName, testCase.input.folder);
    compare({ result }, testCase.expected);
    return result;
}

export async function testCreateNewFileInvalidName(testCase: { input: { shortName: string }; expected: any }): Promise<string> {
    let threw = false;
    let messageMentionsInvalidName = false;
    try {
        await createNewFile({
            project: 100555,
            position: 'left',
            shortName: testCase.input.shortName,
            enhancement: '_blank',
            sourceTS: '',
            openPreview: false,
        });
    } catch (e: any) {
        threw = true;
        messageMentionsInvalidName = String(e?.message ?? '').includes('Invalid name');
    }
    const result = { threw, messageMentionsInvalidName };
    compare(result, testCase.expected);
    return JSON.stringify(result);
}
