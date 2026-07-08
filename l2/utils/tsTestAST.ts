/// <mls fileReference="_100555_/l2/utils/tsTestAST.ts" enhancement="_102027_/l2/enhancementLit" />

import { MonacoDriver } from "/_100555_/l2/utils/tsTestMonaco.js";

/**
 * Represents an AST node.
 * @typedef {Object} ASTNode
 * @property {string} type - The type of the AST node (e.g., 'Program', 'FunctionDeclaration').
 * @property {string} [name] - The name of the node (e.g., function name).
 * @property {any} [value] - The value associated with the node (e.g., function body or array content).
 * @property {ASTNode[]} [children] - An array of child nodes.
 * @property {number} [startLine] - The start line of the node in the source code.
 * @property {number} [endLine] - The end line of the node in the source code.
 */

type ASTNode = {
    type: string;
    name?: string;
    value?: any;
    children?: ASTNode[];
    startLine: number;
    endLine: number;
};

/**
 * Class to parse a TypeScript test file and generate an AST.
 */
export class TsTestAst {
    public ast: ASTNode | undefined;
    public modelTest: mls.editor.IModelTest | undefined;
    public monacoDriver: MonacoDriver;
    public editor: monaco.editor.IStandaloneCodeEditor;


    /**
     * Creates an instance of TsTestAst.
     * @param {mls.editor.IModelTest} modelTest - The Monaco editor model test instance.
     */
    constructor(modelTest: mls.editor.IModelTest, editor: monaco.editor.IStandaloneCodeEditor) {
        this.modelTest = modelTest;
        this.editor = editor;
        this.monacoDriver = new MonacoDriver(editor);
        this.parse();
    }

    /**
     * Parses the TypeScript code from the model test and returns the AST.
     * @returns {ASTNode | undefined} The generated AST, or undefined if parsing fails.
     */
    parse = (): ASTNode | undefined => {
        if (!this.modelTest?.model) return;
        const value = this.modelTest.model.getValue();
        this.ast = this.parseTypeScript(value);
        return this.ast;
    }

    /**
     * Gets the integrations from the parsed AST.
     * @returns {any[]} The integrations parsed from the AST.
     */
    getIntegrations() {
        return this._getIntegrations();
    }

    /**
     * Gets the tests from the parsed AST.
     * @returns {any[]} The tests parsed from the AST.
     */
    getTests() {
        return this._getTests();
    }

    /**
     * Adds a new test to the AST and inserts it into the test array in the Monaco editor.
     * @param {ICANTest} test - The test object to be added.
     * @param {Function} fcTest - The test function to be associated with the test.
     * @returns {boolean} True if the test was added successfully, false otherwise.
     * @throws {Error} Throws an error if the test already exists or if there are issues with the AST.
     */
    addTest(test: ICANTest, fcTest: Function | string) {
        return this._addTest(test, fcTest);
    }

    /**
     * Deletes a test from the AST and updates the Monaco editor.
     * @param {String} testName - The test name to be removed.
     * @returns {boolean} True if the test was removed successfully, false otherwise.
     * @throws {Error} Throws an error if the test already exists or if there are issues with the AST.
     */
    deleteTest(testName: string, index?: number) {
        return this._deleteTest(testName, index);
    }

    /**
     * Navigate to the specified test function within the Monaco Editor.
     * 
     * This function parses the AST to locate the test function declaration and moves 
     * the cursor to its position in the Monaco Editor.
     * 
     * @param {string} functionName - The name of the test function to navigate to.
     * @throws {Error} Throws an error if the test model is invalid or if the specified test does not exist.
     * @returns {boolean} Returns `true` if the test function was found and navigation was successful, otherwise `false`.
     */
    goToTest(testName: string) {
        return this._goToTest(testName);
    }

    /**
     * Retrieves test function information without executing it.
     * 
     * This function searches for the specified test function in the AST, extracts 
     * its name, parameters, and associated test file name, and returns this information.
     * 
     * @param {string} functionName - The name of the test function.
     * @param {number} paramsIndex - The index of the parameters set to retrieve.
     * @throws {Error} Throws an error if the test model is invalid.
     * @returns {ITestInfo | undefined} An object containing test metadata, or `undefined` if the test is not found.
     */
    getTestInfo(functionName: string, paramsIndex: number = 0) {
        return this._getTestInfo(functionName, paramsIndex)
    }

    /**
    * Executes a test function dynamically imported from a test file.
    * 
    * This function locates the test in the AST, retrieves its parameters, and dynamically 
    * imports the corresponding test file. The specified function is then executed with 
    * the given parameters.
    * 
    * @param {string} functionName - The name of the test function to execute.
    * @param {number} [paramsIndex=0] - The index of the parameters set to use when executing the function.
    * @throws {Error} Throws an error if the test model is invalid, the function is not found, or the import fails.
    * @returns {Promise<string>} Resolves with the result of the executed function.
    */
    async runTest(testName: string, paramsIndex: number = 0) {
        return this._runTest(testName, paramsIndex);
    }

    /**
     * Adds a new integration to the test file.
     * @param {ICANIntegration} integration - The integration to be added.
     * @param {Function} fc - The function associated with the integration.
     * @returns {boolean} Returns true if the integration was successfully added.
     */
    addIntegration(integration: ICANIntegration, fc: Function | string) {
        return this._addIntegration(integration, fc);
    }

    /**
     * Parses TypeScript code into an AST.
     * @param {string} code - The TypeScript code to parse.
     * @returns {ASTNode} The generated AST from the code.
     */
    private parseTypeScript(code: string): ASTNode {
        const ast: ASTNode = { type: 'Program', children: [], endLine: 0, startLine: 0 };
        const totalLines = code.split('\n').length;
        ast.startLine = 1;
        ast.endLine = totalLines;

        const imports = this.parseImports(code);
        const arr = this.parseArrays(code);
        const fcs = this.parseFunctionNames(code);
        ast.children = [...imports, ...arr, ...fcs];
        return ast;
    }

    /**
     * Parses imports from TypeScript code and returns an array of AST nodes.
     * @param {string} code - The TypeScript code to parse.
     * @returns {ASTNode[]} An array of AST nodes representing the imports in the code.
     */
    private parseImports(code: string): ASTNode[] {
        const rc: ASTNode[] = [];
        const importRegex = /import\s+(?:\{([^}]*)\}|\*\s+as\s+(\w+)|(\w+))\s+from\s+['"]([^'"]+)['"];/g;
        let match;

        while ((match = importRegex.exec(code)) !== null) {
            const [fullMatch, namedImports, namespaceImport, defaultImport, modulePath] = match;
            const startLine = code.substring(0, match.index).split('\n').length;
            const endLine = startLine;

            rc.push({
                type: 'ImportDeclaration',
                name: defaultImport || namespaceImport || namedImports?.trim() || '',
                value: modulePath,
                startLine,
                endLine
            });
        }

        return rc;
    }

    /**
     * Parses arrays from TypeScript code and returns an array of AST nodes.
     * @param {string} code - The TypeScript code to parse.
     * @returns {ASTNode[]} An array of AST nodes representing the arrays in the code.
     */
    private parseArrays(code: string): ASTNode[] {

        const rc: ASTNode[] = [];
        const arrayRegex = /export\s+const\s+(\w+)\s*:\s*[\w\[\]<,>\s]*=\s*\[/g;

        let match;
        while ((match = arrayRegex.exec(code)) !== null) {
            const arrayName = match[1];
            const startIdx = match.index + match[0].length - 1;

            let openBrackets = 1;
            let endIdx = startIdx;
            while (endIdx < code.length && openBrackets > 0) {
                endIdx++;
                if (code[endIdx] === "[") openBrackets++;
                if (code[endIdx] === "]") openBrackets--;
            }

            if (openBrackets !== 0) {
                throw new Error(`Unmatched brackets in array: ${arrayName}`);
            }

            const arrayContent = code.substring(startIdx, endIdx + 1);
            const startLine = code.substring(0, startIdx).split("\n").length;
            const endLine = startLine + arrayContent.split("\n").length - 1;

            rc.push({
                type: "ArrayDeclaration",
                name: arrayName,
                value: arrayContent,
                startLine,
                endLine,
            });
        }

        return rc;
    }



    /**
     * Parses function names from TypeScript code and returns an array of function declarations as AST nodes.
     * @param {string} code - The TypeScript code to parse.
     * @returns {ASTNode[]} An array of AST nodes representing function declarations in the code.
     */
    private parseFunctionNames(code: string): ASTNode[] {
        const functionRegex = /(?:export\s+)?function\s+(\w+)\s*\(/gm;
        let match;
        const rc: ASTNode[] = [];

        while ((match = functionRegex.exec(code)) !== null) {

            const functionName = match[1];
            const startLine = code.substring(0, match.index).split('\n').length;
            const functionStartIndex = match.index + match[0].length;
            let openBraceIndex = code.indexOf('{', functionStartIndex);
            const functionBody = code.substring(openBraceIndex);

            let depth = 0;
            let endIndex = 0;
            for (let i = 0; i < functionBody.length; i++) {
                const char = functionBody[i];

                if (char === '{') {
                    depth++;
                } else if (char === '}') {
                    depth--;
                }

                if (depth === 0) {
                    endIndex = openBraceIndex + i + 1;
                    break;
                }
            }

            const endLine = code.substring(0, endIndex).split('\n').length;

            rc.push({
                type: 'FunctionDeclaration',
                name: functionName,
                startLine,
                endLine
            });
        }

        return rc;
    }

    /**
     * Parses and retrieves the integrations from the AST's children.
     * @returns {ICANIntegration[]} The parsed integrations.
     * @throws {Error} Throws an error if parsing the integrations fails.
     */
    private _getIntegrations(): ICANIntegration[] {
        if (!this.ast) return [];

        const integrationsAst = this.ast.children?.find(
            (item) => item.type === 'ArrayDeclaration' && item.name === 'integrations'
        );

        if (!integrationsAst || !integrationsAst.value) return [];
        let rawValue = integrationsAst.value;

        rawValue = rawValue
            .replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":')
            .replace(/'/g, '"')
            .replace(/,\s*([\]}])/g, '$1');

        try {
            const parsed = JSON.parse(rawValue);
            if (!Array.isArray(parsed)) {
                throw new Error('Parsed integrations is not an array');
            }

            for (const integration of parsed) {
                if (
                    typeof integration.description !== 'string' ||
                    typeof integration.functionName !== 'string' ||
                    typeof integration.page !== 'string' ||
                    typeof integration.enabled !== 'boolean' ||
                    typeof integration.params !== 'object'
                ) {
                    throw new Error('Invalid integration object structure');
                }
            }

            return parsed as ICANIntegration[];
        } catch (err) {
            throw new Error(`Failed to parse integrations: ${(err as Error).message}`);
        }
    }


    /**
     * Parses and retrieves the tests from the AST's children.
     * @returns {ICANTest[]} The parsed tests.
     * @throws {Error} Throws an error if parsing the tests fails.
     */
    private _getTests(): ICANTest[] {
        if (!this.ast) return [];

        const testsAst = this.ast.children?.find(
            (item) => item.type === 'ArrayDeclaration' && item.name === 'tests'
        );

        if (!testsAst || !testsAst.value) return [];
        let rawValue = testsAst.value;

        rawValue = rawValue
            .replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":')
            .replace(/'/g, '"')
            .replace(/,\s*([\]}])/g, '$1');

        try {
            const parsed = JSON.parse(rawValue);
            if (!Array.isArray(parsed)) {
                throw new Error('Parsed tests is not an array');
            }

            for (const test of parsed) {
                if (
                    typeof test.functionName !== 'string' ||
                    typeof test.params !== 'object'
                ) {
                    throw new Error('Invalid test object structure');
                }
            }
            return parsed as ICANTest[];
        } catch (err) {
            throw new Error(`Failed to parse tests: ${(err as Error).message}`);
        }
    }


    /**
     * Internal method to add a test to the AST and update the Monaco editor.
     * @param {ICANTest} test - The test object to add.
     * @param {Function} fcTest - The test function to add.
     * @returns {boolean} True if the test was successfully added.
     * @throws {Error} Throws an error if the test already exists or AST information is missing.
     */
    private _addTest(test: ICANTest, fcTest: Function | string) {

        this.ast = this.parse();
        const tests = this._getTests();
        const alreadyExist = tests.find((t) => t.functionName === test.functionName);
        if (alreadyExist) throw new Error(`Test "${test.functionName}" already exists.`);
        tests.push(test);
        const testNode = this.ast?.children?.find((item) => item.type === 'ArrayDeclaration' && item.name === 'tests');
        if (!this.modelTest) throw new Error('Invalid test model');
        if (!testNode) throw new Error('Your test file must be a declaration for test "export const tests: ICANTest[] = [];" ');
        if (!testNode.startLine || !testNode.endLine) throw new Error('Missing information on AST "startLine" or "endLine"');

        let newTest = JSON.stringify(tests, null, 2)
            .replace(/"(\w+)":/g, '$1:');

        newTest = `export const tests: ICANTest[] = ${newTest} \n`;

        this.monacoDriver.replaceLines(this.modelTest.model, testNode.startLine, testNode.endLine, newTest);
        this.monacoDriver.finishEdit(this.modelTest.model);

        this._addFunction(fcTest);
        this.ast = this.parse() // refresh ast
        this._formatEditor(this.modelTest.model);
        return true;
    }

    /**
     * Internal method to deletes a test from the AST and updates the Monaco editor.
     * @param {string} testName - The name of the test to delete.
     * @throws {Error} Throws an error if the test does not exist or deletion fails.
     */
    private _deleteTest2(functionName: string, index?: number) {
        this.ast = this.parse();
        const tests = this._getTests();
        const testToDelet = tests.find((t) => t.functionName === functionName);
        if (!this.modelTest) throw new Error('Invalid test model');
        if (!testToDelet) throw new Error(`Test"${functionName}" dont exists`);
        const testAST = this.ast?.children?.find((ast) => ast.type === 'ArrayDeclaration' && ast.name === 'tests');

        if (testAST) {
            const index = tests.findIndex(item => item.functionName === testToDelet.functionName);
            if (index !== -1) {
                tests.splice(index, 1);
            }
            let newTest = JSON.stringify(tests, null, 2)
                .replace(/"(\w+)":/g, '$1:');

            newTest = `export const tests: ICANTest[] = ${newTest} \n`;
            this.monacoDriver.replaceLines(this.modelTest.model, testAST.startLine, testAST.endLine, newTest);
        }

        this._deleteFunction(testToDelet.functionName);

        this.ast = this.parse();
        this._formatEditor(this.modelTest.model);
        return true;
    }

    /**
 * Internal method to delete a test from the AST and update the Monaco editor.
 * @param {string} functionName - The name of the test to delete.
 * @param {number} [index] - (Optional) The index of the parameter to remove.
 * @throws {Error} Throws an error if the test does not exist or deletion fails.
 */
    private _deleteTest(functionName: string, index?: number) {

        this.ast = this.parse();
        const tests = this._getTests();
        const testToDelete = tests.find((t) => t.functionName === functionName);
        if (!this.modelTest) throw new Error('Invalid test model');
        if (!testToDelete) throw new Error(`Test "${functionName}" does not exist`);

        const testAST = this.ast?.children?.find((ast) => ast.type === 'ArrayDeclaration' && ast.name === 'tests');

        if (testAST) {
            const testIndex = tests.findIndex(item => item.functionName === functionName);

            if (testIndex !== -1) {
                if (index === undefined) {

                    tests.splice(testIndex, 1);
                    this._deleteFunction(functionName);
                } else {

                    if (testToDelete.params?.length > index) {
                        testToDelete.params.splice(index, 1);

                        if (testToDelete.params.length === 0) {
                            tests.splice(testIndex, 1);
                            this._deleteFunction(functionName);
                        }
                    } else {
                        throw new Error(`Index ${index} is out of bounds for test "${functionName}"`);
                    }
                }
            }

            let newTest = JSON.stringify(tests, null, 2).replace(/"(\w+)":/g, '$1:');
            newTest = `export const tests: ICANTest[] = ${newTest} \n`;

            this.monacoDriver.replaceLines(this.modelTest.model, testAST.startLine, testAST.endLine, newTest);
        }

        this.ast = this.parse();
        this._formatEditor(this.modelTest.model);
        return true;
    }

    /**
    * Internal method to executes a test function dynamically imported from a test file.
    * 
    * This function locates the test in the AST, retrieves its parameters, and dynamically 
    * imports the corresponding test file. The specified function is then executed with 
    * the given parameters.
    * 
    * @param {string} functionName - The name of the test function to execute.
    * @param {number} [paramsIndex=0] - The index of the parameters set to use when executing the function.
    * @throws {Error} Throws an error if the test model is invalid, the function is not found, or the import fails.
    * @returns {Promise<string>} Resolves with the result of the executed function.
    */
    private async _runTest(functionName: string, paramsIndex: number = 0): Promise<string> {

        if (!this.modelTest) throw new Error('Invalid test model');
        this.ast = this.parse();
        const tests = this._getTests();
        const testFind = tests.find((t) => t.functionName === functionName);
        if (!testFind) throw new Error(`Test ${functionName} not found`);

        const fcName = testFind.functionName;
        const params = testFind.params[paramsIndex];
        const suffix = `.test.js?cacheBuster=${Date.now()}`
        const { folder, project, shortName } = this.modelTest.storFile;
        const fileName = folder ? `/_${project}_/l2/${folder}_${shortName}${suffix}` : `/_${project}_/l2/${shortName}${suffix}`
        let module;

        try {
            module = await import(fileName);
        } catch (err: any) {
            throw new Error(err.message);
        }


        if (!module[fcName]) throw new Error(`Function ${fcName} not found in ${fileName}`);
        const result = await module[fcName](params);
        return result;

    }

    /**
     * Internal method to retrieves test function information without executing it.
     * 
     * This function searches for the specified test function in the AST, extracts 
     * its name, parameters, and associated test file name, and returns this information.
     * 
     * @param {string} functionName - The name of the test function.
     * @param {number} paramsIndex - The index of the parameters set to retrieve.
     * @throws {Error} Throws an error if the test model is invalid.
     * @returns {ITestInfo | undefined} An object containing test metadata, or `undefined` if the test is not found.
     */
    private _getTestInfo(functionName: string, paramsIndex: number): ITestInfo | undefined {
        if (!this.modelTest || !window.preview.iframe || !window.preview.iframe.contentWindow) throw new Error('Invalid test model');
        this.ast = this.parse();
        const tests = this._getTests();
        const testFind = tests.find((t) => t.functionName === functionName);
        if (!testFind) return;

        const fcName = testFind.functionName;
        const params = testFind.params[paramsIndex];
        const fileName = `./_${this.modelTest.storFile.project}_${this.modelTest.storFile.shortName}.test.js?cacheBuster=${Date.now()}`;

        const info: ITestInfo = {
            fileName,
            functionName: fcName,
            params,
        };

        return info;
    }


    /**
     * Internal method to navigate to the specified test function within the Monaco Editor.
     * 
     * This function parses the AST to locate the test function declaration and moves 
     * the cursor to its position in the Monaco Editor.
     * 
     * @param {string} functionName - The name of the test function to navigate to.
     * @throws {Error} Throws an error if the test model is invalid or if the specified test does not exist.
     * @returns {boolean} Returns `true` if the test function was found and navigation was successful, otherwise `false`.
     */
    private _goToTest(functionName: string) {

        this.ast = this.parse();
        const tests = this._getTests();
        const testFind = tests.find((t) => t.functionName === functionName);
        if (!this.modelTest) throw new Error('Invalid test model');
        if (!testFind) throw new Error(`Test "${functionName}" dont exists`);
        const testAST = this.ast?.children?.find((ast) => ast.type === 'FunctionDeclaration' && ast.name === testFind.functionName);
        if (!testAST) return false;
        this.monacoDriver.goTo(this.modelTest.model, testAST.startLine, testAST.endLine);
        return true;
    }

    /**
     * Intenal method to delete a function on the AST and updates the Monaco editor.
     * @param {String} fcName - The function name to be deleted.
     * @returns {boolean} True if the function was successfully deleted.
     * @throws {Error} Throws an error if the test model is invalid.
     */
    private _deleteFunction(fcName: string) {

        if (!this.modelTest) throw new Error('Invalid test model');
        this.ast = this.parse();
        const fcAST = this.ast?.children?.find((ast) => ast.type === 'FunctionDeclaration' && ast.name === fcName);
        if (!fcAST) return false;
        const countLine = (fcAST.endLine - fcAST.startLine) + 1;
        this.monacoDriver.deleteLines(this.modelTest.model, fcAST.startLine, countLine);
        this.monacoDriver.finishEdit(this.modelTest.model);
        return true;
    }


    /**
     * Adds a new integration to the AST and updates the Monaco editor.
     * @param {ICANIntegrations} integration - The integration object to add.
     * @param {Function} fcIntegration - The integration function to add.
     * @throws {Error} Throws an error if the integration already exists or if AST information is missing.
     */
    private _addIntegration(integration: ICANIntegration, fcIntegration: Function | string) {
        this.ast = this.parse();
        const integrations = this._getIntegrations();
        const alreadyExist = integrations.find((t) => t.description === integration.description);
        if (alreadyExist) throw new Error(`Integration "${integration.description}" already exists.`);
        integrations.push(integration);
        const integrationNode = this.ast?.children?.find((item) => item.type === 'ArrayDeclaration' && item.name === 'integrations');
        if (!this.modelTest) throw new Error('Invalid test model');
        if (!integrationNode) throw new Error('Your test file must be a declaration for integrations "export const integrations: ICANIntegrations[] = [];" ');
        if (!integrationNode.startLine || !integrationNode.endLine) throw new Error('Missing information on AST "startLine" or "endLine"');

        let newIntegration = JSON.stringify(integrations, null, 2)
            .replace(/"(\w+)":/g, '$1:');

        newIntegration = `export const integrations: ICANIntegration[] = ${newIntegration} \n`;

        this.monacoDriver.replaceLines(this.modelTest.model, integrationNode.startLine, integrationNode.endLine, newIntegration);
        this.monacoDriver.finishEdit(this.modelTest.model);

        this._addFunction(fcIntegration);
        this.ast = this.parse() // refresh ast
        this._formatEditor(this.modelTest.model);
        return true;
    }

    /**
     * Deletes an integration from the AST and updates the Monaco editor.
     * @param {string} integrationName - The name of the integration to delete.
     * @throws {Error} Throws an error if the integration does not exist or deletion fails.
     */
    private _deleteIntegration(integrationName: string) {

    }

    /**
     * Adds a new function to the AST and updates the Monaco editor.
     * @param {Function} fc - The function to add.
     * @returns {boolean} True if the function was successfully added.
     * @throws {Error} Throws an error if AST information is missing or the test model is invalid.
     */
    private _addFunction(fc: Function | string) {

        if (!this.modelTest) throw new Error('Invalid test model');
        this.ast = this.parse();
        if (!this.ast) throw new Error('Invalid ast');
        const fcString = typeof fc === 'string' ? fc : fc.toString();
        const { startLine, endLine } = this.ast;
        if (!startLine || !endLine) throw new Error('Missing information on AST "startLine" or "endLine"');
        this.monacoDriver.insertLine(this.modelTest.model, endLine + 1, fcString);
        this.checkImports();
        this.monacoDriver.finishEdit(this.modelTest.model);
        return true;
    }

    private checkImports() {


        if (!this.modelTest) throw new Error('Invalid test model');
        this.ast = this.parse();
        if (!this.ast) throw new Error('Invalid ast');

        const import1 = `import { initState, setState, verifyState, watchState } from '/_100554_/l2/libManagementCan.js';`
        const import2 = `import { ICANTest, ICANIntegration, ICANSchema } from '/_100555_/l2/utils/tsTestAST.js';`

        const importItem1 = this.ast?.children?.find((item) => item.type === 'ImportDeclaration' && item.value === '/_100554_/l2/ibManagementCan');
        if (!importItem1) this._addImport(import1);
        else this._addImport(import1, importItem1);

        this.ast = this.parse();

        const importItem2 = this.ast?.children?.find((item) => item.type === 'ImportDeclaration' && item.value === '/_100555_/l2/utils/tsTestAST');
        if (!importItem2) this._addImport(import2);
        else this._addImport(import2, importItem2);
    }

    /**
     * Adds an import statement to the TypeScript code.
     * If an interval is provided, it replaces the existing import.
     * Otherwise, it inserts the import after the root startLine.
     * 
     * @param {string} value - The import statement to add.
     * @param {Object} [interval] - The optional start and end line to replace.
     */
    private _addImport(value: string, interval?: { startLine: number, endLine: number }) {
        if (!this.modelTest || !this.ast) throw new Error('Invalid test model or AST');

        const editOperations: monaco.editor.IIdentifiedSingleEditOperation[] = [];
        const model = this.modelTest.model;
        const rootStartLine = this.ast.startLine ?? 1;

        if (interval) {
            editOperations.push({
                range: new monaco.Range(interval.startLine, 1, interval.endLine, model.getLineMaxColumn(interval.endLine)),
                text: value,
                forceMoveMarkers: true
            });
        } else {
            editOperations.push({
                range: new monaco.Range(rootStartLine + 1, 1, rootStartLine + 1, 1),
                text: value + '\n',
                forceMoveMarkers: true
            });
        }

        model.pushEditOperations([], editOperations, () => null);
    }


    private _formatEditor(model: monaco.editor.ITextModel) {
        if (!this.editor) return;
        if (this.editor.getModel()?.id !== model.id) return;
        this.editor.trigger('anyString', 'editor.action.formatDocument', null);
    }
}

export interface ITestInfo {
    fileName: string,
    functionName: string,
    params: Record<string, any>,
}

export interface ICANTest {
    functionName: string,
    params: Record<string, any>[]
}

export interface ICANIntegration {
    enabled: boolean,
    description: string,
    page: string,
    functionName: string,
    schema: Record<string, ICANSchema>
}

export interface ICANSchema {
    type: string,
    optional?: boolean
    description?: string
}