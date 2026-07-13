/// <mls fileReference="_100555_/l2/pluginEditL3/pluginEditStyleAST.test.ts" enhancement="_blank" />

import { IPluginTestCase, compare } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { LessAST } from '/_100555_/l2/pluginEditL3/pluginEditStyleAST.js';

// LessAST has no @customElement tag - it's a plain class that parses/edits LESS or CSS text
// through a Monaco text model. Every case below runs in 'browser' because it needs the real
// `monaco` global (used elsewhere in this codebase the same way, e.g. enhancementStyle.ts /
// libModel.ts call `monaco.editor.createModel(...)` directly, no wrapper) to build a real
// ITextModel - the AST logic itself has no other DOM dependency.

function createModel(content: string): monaco.editor.ITextModel {
    return monaco.editor.createModel(content, 'less');
}

export const tests: IPluginTestCase[] = [

    { functionName: 'testReparseBuildsNestedBlocks', env: 'browser', params: [
        { expected: { blockKeys: ['.foo', '.foo .bar'] } },
    ]},

    { functionName: 'testSelectBehavior', env: 'browser', params: [
        { expected: {
            existingSelectResult: true, existingSelected: '.foo', existingRules: { color: 'red' },
            // Quirk: select() on a missing selector returns null but does NOT clear `selected`/
            // `rules` - the stale state from the previous successful select() lingers. Documented
            // as an observed characteristic, not "fixed" here.
            missResult: null, staleSelected: '.foo', staleRules: { color: 'red' },
        } },
    ]},

    { functionName: 'testSetRuleWithoutSelectionThrows', env: 'browser', params: [
        { expected: { threw: true, message: 'Nenhum seletor selecionado.' } },
    ]},

    { functionName: 'testSetRuleAddsNewProperty', env: 'browser', params: [
        { expected: { rules: { color: 'red', background: 'blue' } } },
    ]},

    { functionName: 'testSetRuleReplacesExistingProperty', env: 'browser', params: [
        { expected: { rules: { color: 'green' } } },
    ]},

    // Quirk: passing an empty value removes the property line when it exists, and is a silent
    // no-op when the property doesn't exist (no error, no line inserted for an "empty" property).
    { functionName: 'testSetRuleEmptyValue', env: 'browser', params: [
        { input: { property: 'color' }, expected: { rules: { background: 'blue' } } },
        { input: { property: 'display' }, expected: { rules: { color: 'red', background: 'blue' } } },
    ]},

    { functionName: 'testGetRulesIgnoresNestedDeclarations', env: 'browser', params: [
        { expected: { rules: { color: 'red' } } },
    ]},

    { functionName: 'testAddSelectorCreatesNestedPathAndRules', env: 'browser', params: [
        { expected: { hasParent: true, hasChild: true, childRules: { color: 'red' } } },
    ]},

    { functionName: 'testRemoveSelectorClearsSelectionWhenActive', env: 'browser', params: [
        { expected: { selectedAfterRemove: null, hasFoo: false, hasBar: true, barRules: { color: 'blue' } } },
    ]},

    { functionName: 'testExportSelectorGroupStrictSimpleSelector', env: 'browser', params: [
        { input: { baseSelector: 'h2' }, expected: 'h2 { color: red; font-size: 12px; }' },
        { input: { baseSelector: '' }, expected: '' },
        { input: { baseSelector: 'nonexistent' }, expected: '' },
    ]},

    { functionName: 'testExportSelectorGroupStrictGroupsMatchingChildren', env: 'browser', params: [
        { expected: '.card { .title { font-weight: bold; } .title:hover { color: blue; } }' },
    ]},
];

export async function testReparseBuildsNestedBlocks(testCase: { expected: any }): Promise<string> {
    const model = createModel('.foo {\n    color: red;\n    .bar {\n        color: blue;\n    }\n}');
    try {
        const ast = new LessAST(model);
        const result = { blockKeys: [...ast.blocks.keys()] };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        model.dispose();
    }
}

export async function testSelectBehavior(testCase: { expected: any }): Promise<string> {
    const model = createModel('.foo {\n    color: red;\n}');
    try {
        const ast = new LessAST(model);
        const existingSelectResult = ast.select('.foo');
        const existingSelected = ast.selected;
        const existingRules = ast.rules;
        const missResult = ast.select('.missing');
        const result = {
            existingSelectResult, existingSelected, existingRules,
            missResult, staleSelected: ast.selected, staleRules: ast.rules,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        model.dispose();
    }
}

export async function testSetRuleWithoutSelectionThrows(testCase: { expected: any }): Promise<string> {
    const model = createModel('.foo {\n    color: red;\n}');
    try {
        const ast = new LessAST(model);
        let threw = false;
        let message = '';
        try {
            ast.setRule('color', 'blue');
        } catch (e: any) {
            threw = true;
            message = e.message;
        }
        const result = { threw, message };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        model.dispose();
    }
}

export async function testSetRuleAddsNewProperty(testCase: { expected: any }): Promise<string> {
    const model = createModel('.foo {\n    color: red;\n}');
    try {
        const ast = new LessAST(model);
        ast.select('.foo');
        ast.setRule('background', 'blue');
        const result = { rules: ast.getRules('.foo') };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        model.dispose();
    }
}

export async function testSetRuleReplacesExistingProperty(testCase: { expected: any }): Promise<string> {
    const model = createModel('.foo {\n    color: red;\n}');
    try {
        const ast = new LessAST(model);
        ast.select('.foo');
        ast.setRule('color', 'green');
        const result = { rules: ast.getRules('.foo') };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        model.dispose();
    }
}

export async function testSetRuleEmptyValue(testCase: { input: { property: string }; expected: any }): Promise<string> {
    const model = createModel('.foo {\n    color: red;\n    background: blue;\n}');
    try {
        const ast = new LessAST(model);
        ast.select('.foo');
        ast.setRule(testCase.input.property, '');
        const result = { rules: ast.getRules('.foo') };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        model.dispose();
    }
}

export async function testGetRulesIgnoresNestedDeclarations(testCase: { expected: any }): Promise<string> {
    const model = createModel('.foo {\n    color: red;\n    .bar {\n        color: blue;\n    }\n}');
    try {
        const ast = new LessAST(model);
        const result = { rules: ast.getRules('.foo') };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        model.dispose();
    }
}

export async function testAddSelectorCreatesNestedPathAndRules(testCase: { expected: any }): Promise<string> {
    const model = createModel('');
    try {
        const ast = new LessAST(model);
        ast.addSelector('.foo .bar', { color: 'red' });
        const result = {
            hasParent: ast.blocks.has('.foo'),
            hasChild: ast.blocks.has('.foo .bar'),
            childRules: ast.getRules('.foo .bar'),
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        model.dispose();
    }
}

export async function testRemoveSelectorClearsSelectionWhenActive(testCase: { expected: any }): Promise<string> {
    const model = createModel('.foo {\n    color: red;\n}\n.bar {\n    color: blue;\n}');
    try {
        const ast = new LessAST(model);
        ast.select('.foo');
        ast.removeSelector('.foo');
        const result = {
            selectedAfterRemove: ast.selected,
            hasFoo: ast.blocks.has('.foo'),
            hasBar: ast.blocks.has('.bar'),
            barRules: ast.getRules('.bar'),
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        model.dispose();
    }
}

export async function testExportSelectorGroupStrictSimpleSelector(testCase: { input: { baseSelector: string }; expected: any }): Promise<string> {
    const model = createModel('h2 {\n    color: red;\n    font-size: 12px;\n}');
    try {
        const ast = new LessAST(model);
        const result = ast.exportSelectorGroupStrict(testCase.input.baseSelector);
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        model.dispose();
    }
}

export async function testExportSelectorGroupStrictGroupsMatchingChildren(testCase: { expected: any }): Promise<string> {
    const model = createModel(
        '.card {\n    color: black;\n}\n' +
        '.card .title {\n    font-weight: bold;\n}\n' +
        '.card .title:hover {\n    color: blue;\n}\n' +
        '.card .subtitle {\n    font-size: 10px;\n}'
    );
    try {
        const ast = new LessAST(model);
        const result = ast.exportSelectorGroupStrict('.card .title');
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        model.dispose();
    }
}
