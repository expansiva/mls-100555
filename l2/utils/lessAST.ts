/// <mls fileReference="_100555_/l2/utils/lessAST.ts" enhancement="_blank" />

import { MonacoDriver } from "/_100555_/l2/utils/lessMonaco.js";

interface ILessAST {
    root: {
        [token: string]: {
            value: string;
            line: number;
            column: number;
        };
    };
    [selector: string]: {
        _startLine?: number;
        _endLine?: number;
        [property: string]: {
            value: string;
            line: number;
            column: number;
        } | number | undefined;
    };
}

/**
 * @class LessAst
 * 
 * This class parses a LESS model, building an AST and converting LESS selectors
 * into a CSS-compatible format. Note that this implementation supports only a subset 
 * of LESS functionalities. Advanced features, such as variable interpolation within selectors, 
 * parameterized mixins, and color manipulation functions, are not supported.
 * 
 * ### Supported Features
 * - **Basic Selector Nesting**: Supports nesting selectors with `&`, converting them to a CSS-compatible format.
 * - **Simple Variables**: Allows the use of variables within properties (e.g., `@color-primary: #333;`).
 * - **Basic LESS Structure**: Parses basic selectors, properties, and tokens, ignoring advanced logic.
 * 
 * ### Unsupported Features
 * - **Variable Interpolation within Selectors**: Selectors like `@{variable}-name` are not expanded in the AST.
 * - **Parameterized Mixins**: Mixins with parameters are not evaluated or expanded.
 * - **Mathematical and Color Functions**: Functions like `darken`, `lighten`, or `add` are not processed.
 * - **Looping and Iteration**: Constructs such as `each` or `for` are ignored, as they are not supported in CSS.
 * - **Global Scope Management**: Selectors with `:global` will not retain global scoping behavior.
 * 
 * ### Usage Example
 * ```typescript
 * const lessAst = new LessAst("your-url");
 * lessAst.parse();
 * const cssSelector = lessAst.selectorLESS2CSS("less-a-s-t-100554 &:hover");
 * console.log(cssSelector); // Output: less-a-s-t-100554:hover
 * ```
 * 
 * ### Limitations
 * Since this class does not handle dynamic processing features of LESS, it is recommended 
 * only for static LESS-to-CSS conversions that do not require runtime evaluation.
 */
export class LessAst {

    // AST example
    //{
    //   "root": {
    //     "@color-primary": { value: "#ff0000", line: 0, column: 10 },
    //     "@bg-color": { value: "#ffffff", line: 1, column: 10 }
    //   },
    //   ".header": {
    //     "color": { value: "@color-primary", line: 2, column: 10 },
    //     "margin": { value: "10px", line: 3, column: 10 }
    //   },
    //   ".button-primary": {
    //     "background": { value: "@bg-color", line: 5, column: 15 }
    //   }
    // }
    public ast: ILessAST;
    url: string;
    monacoDriver: MonacoDriver;

    // Track the selector hierarchy
    stack: string[] = [];

    constructor(url: string, editor: monaco.editor.IStandaloneCodeEditor) {
        this.url = url;
        this.monacoDriver = new MonacoDriver(editor);
        this.ast = { root: {} };
        this.parse();
    }

    /**
     * parse a full LESS model (monaco editor)
     */
    parse = () => {
        const lines: string[] = this.monacoDriver.getLines(this.url);
        let lineNr = 0;
        for (const line of lines) {
            this.parseLine(++lineNr, line);
        }
    }

    /**
     * Parses a single line and updates the AST accordingly.
     */
    private parseLine = (lineNr: number, line: string): void => {

        line = line.replace(/(?<!:)\/\/.*|\/\*[\s\S]*?\*\//g, ''); // remove coments from a line

        // Match for a token definition, e.g., @color-primary: #ff0000;
        const tokenMatch = line.match(/^(@\S+)\s*:\s*(.+?)\s*;$/);
        if (tokenMatch) {
            const token = tokenMatch[1].trim();
            const value = tokenMatch[2].trim();
            this.ast.root[token] = {
                value,
                line: lineNr,
                column: line.indexOf(value)
            };
            return;
        }

        // Match for a selector start, e.g., .cl1 { or &hover {
        const selectorStartMatch = line.match(/^(.+?)\s*{\s*$/);
        if (selectorStartMatch) {
            const selector = selectorStartMatch[1].trim();

            // Build the full selector path by joining the stack with the current selector
            const fullSelector = this.stack.length > 0 ? `${this.stack.join(" ")} ${selector}` : selector;
            this.stack.push(selector);

            // Initialize the selector in the AST if not present
            if (!this.ast[fullSelector]) {
                this.ast[fullSelector] = {};
            }

            // Store the starting line of the selector block
            this.ast[fullSelector]._startLine = lineNr;

            return;
        }

        // Match for a property within an open selector block, e.g., color: red;
        if (this.stack.length > 0) {
            const propertyMatch = line.trim().match(/^\s*(.+?)\s*:\s*(.+?)\s*;$/);
            if (propertyMatch) {
                const property = propertyMatch[1].trim();
                const value = propertyMatch[2].trim();
                const currentSelector = this.stack.join(" ");

                if (!this.ast[currentSelector]) {
                    this.ast[currentSelector] = {};
                }

                // Store the starting line of the selector block
                this.ast[currentSelector][property] = {
                    value,
                    line: lineNr,
                    column: this.findColumn(line, value) || line.lastIndexOf(value)
                };
                return;
            }
        }

        // Match for the end of a selector block, e.g., }
        const selectorEndMatch = line.match(/^\s*}\s*$/);
        if (selectorEndMatch) {
            const currentSelector = this.stack.join(" ");
            if (this.ast[currentSelector]) {
                // Store the ending line of the selector block
                this.ast[currentSelector]._endLine = lineNr;
            }
            this.stack.pop(); // Move out of the current selector level
        }
    }

    /**
     * Finds the column index where the given `value` starts in the provided `line`.
     *
     * This method calculates the precise position of the `value` in the string `line` 
     * after the first occurrence of a colon (`:`), considering any leading spaces. 
     * If the `value` is not found or the colon is absent, it returns undefined.
     *
     * @param {string} line - The line of text to be searched.
     * @param {string} value - The target string to locate within the `line`.
     * @returns {number} - The zero-based index of the starting position of `value` in `line`, 
     *                     or undefined if the colon or value is not found.
     *
     * @example
     * // Example 1:
     * const line = "        text-shadow: 3em -8em 3em;";
     * const value = "3em -8em 3em";
     * findColumn(line, value); // Returns: 23
     *
     * // Example 2:
     * const line = "        flex-wrap: wrap;";
     * const value = "wrap";
     * findColumn(line, value); // Returns: 21
     *
     * // Example 3:
     * const line = "invalid line without colon";
     * const value = "anything";
     * findColumn(line, value); // Returns: undefined
     */

    private findColumn(line: string, value: string): number | undefined {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return;
        const afterColon = line.slice(colonIndex + 1);
        const valueStartIndex = afterColon.indexOf(value);
        if (valueStartIndex === -1) return;
        return colonIndex + 1 + valueStartIndex;
    }

    /**
     * Lists all themes available in the AST.
     * Each theme is identified by its selector. If the selector has a `.`, the part after the dot is the theme name.
     * If no dot is present, the theme is named "default".
     * 
     * @returns An object where each key is a theme name (e.g., "default", "theme2") and each value is the corresponding selector.
     */
    public listThemes(): { [themeName: string]: string } {
        const themes: { [themeName: string]: string } = {};

        for (const selector in this.ast) {
            // Skip the "root" and any selectors with spaces (non-root)
            if (selector === "root" || selector.includes(" ")) continue;

            // Determine theme name based on the presence of a dot in the selector
            const themeName = selector.includes(".") ? selector.split(".")[1] : "default";
            themes[themeName] = selector;
        }

        return themes;
    }

    /**
     * Adds a new theme to the specified component variation.
     * 
     * @param variation The name of the new theme variation (e.g., "theme3").
     * @returns `true` if the theme was added successfully, `false` otherwise.
     */
    public addTheme(variation: string): boolean {
        // List existing themes and determine the last line of the last theme
        const themes = this.listThemes();
        const themeKeys = Object.keys(themes);

        if (themeKeys.length < 1) return false;

        // Find the last theme's _endLine to insert the new theme after it
        let lastLine = 0;
        themeKeys.forEach(theme => {
            const themeSelector = themes[theme];
            const themeData = this.ast[themeSelector];
            if (themeData && themeData._endLine !== undefined) {
                lastLine = Math.max(lastLine, themeData._endLine);
            }
        });

        // Determine the selector for the new theme
        const componentName = themes[themeKeys[0]].split(".")[0];
        const newThemeSelector = `${componentName}.${variation}`;

        // Insert new theme if it doesn't already exist in the AST
        if (this.ast[newThemeSelector]) {
            console.warn(`Theme '${variation}' already exists for ${componentName}.`);
            return false;
        }

        // Insert the new theme in the AST
        this.ast[newThemeSelector] = {
            _startLine: lastLine + 1,
            _endLine: lastLine + 2
        };

        // Add the theme to the Monaco editor after the last theme line
        this.monacoDriver.insertLine(this.url, lastLine + 1, ``);
        this.monacoDriver.insertLine(this.url, lastLine + 2, `${newThemeSelector} {`);
        this.monacoDriver.insertLine(this.url, lastLine + 3, `\t// theme description`);
        this.monacoDriver.insertLine(this.url, lastLine + 4, `\tdisplay: inherit;`);
        this.monacoDriver.insertLine(this.url, lastLine + 5, `}`);
        this.monacoDriver.finishEdit(this.url);
        this.updateASTAfterInsertLine(lastLine, 5);
        return true;
    }

    /**
     * Deletes a theme from the specified component variation.
     * 
     * @param variation The name of the theme variation to delete (e.g., "theme2").
     * If `null`, deletes the "default" theme (the main component selector).
     * @returns `true` if the theme was deleted successfully, `false` otherwise.
     */
    public deleteTheme(variation: string | null): boolean {
        const { startLine, endLine, themeSelector } = this.getThemeRangeLines(variation);
        if (startLine === undefined || endLine === undefined) return false;

        const linesToDelete = endLine - startLine + 1;
        this.monacoDriver.deleteLines(this.url, startLine, linesToDelete);
        delete this.ast[themeSelector];
        this.updateASTAfterInsertLine(startLine, -linesToDelete);
        return true;
    }

    /**
     * Retrieves the description comments for a specified theme.
     * 
     * @param variation The name of the theme variation (e.g., "theme2").
     *                  If `null`, retrieves the "default" theme.
     * @returns An array of comment lines that describe the theme, or an empty array if no comments are found.
     */
    public getThemeDescription(variation: string | null): string[] {
        const { startLine, endLine } = this.getThemeRangeLines(variation);
        if (startLine === undefined || endLine === undefined) return [];

        // Retrieve lines from the Monaco model for the theme's range
        const lines = this.monacoDriver.getLines(this.url);
        const themeLines = lines.slice(startLine, endLine);

        // Extract the comments at the beginning of the theme block
        const description: string[] = [];
        for (const line of themeLines) {
            const trimmedLine = line.trim();
            if (!trimmedLine.startsWith("//")) break;
            description.push(trimmedLine.replace(/^\/\//, '').trim());
        }
        return description;
    }

    private getThemeRangeLines(variation: string | null): { startLine: number | undefined, endLine: number | undefined, themeSelector: string } {
        // Determine the selector for the theme
        const themes = this.listThemes();
        const themeName = variation ?? "default";
        const themeSelector = themes[themeName];

        // If the theme does not exist, return an empty array
        if (!themeSelector || !this.ast[themeSelector]) {
            console.warn(`Theme ${themeName} does not exist.`);
            return { startLine: undefined, endLine: undefined, themeSelector: "" };
        }

        // Get the start and end lines for the theme in the AST
        const themeData = this.ast[themeSelector];
        return {
            startLine: themeData._startLine,
            endLine: themeData._endLine,
            themeSelector
        };
    }

    /**
     * Converts a full CSS selector back to the LESS format using "&" where appropriate.
     * - If the selector parts match a parent selector, it replaces the match with "&".
     * 
     * @param selector The CSS selector to convert to LESS format.
     * @returns The converted LESS format selector with "&" where possible.
     */
    public selectorCSS2LESS = (selector: string): string => {
        const parts = selector.split(" ");
        const result: string[] = [];

        for (const part of parts) {
            // If it matches the parent selector pattern, replace it with "&"
            if (result.length > 0 && part.startsWith(result[result.length - 1])) {
                result.push("&" + part.substring(result[result.length - 1].length));
            } else {
                result.push(part);
            }
        }

        return result.join(" ");
    };

    // Converts a LESS selector with "&" to the full CSS format
    public selectorLESS2CSS = (selector: string): string => {
        // Use the stack to track the selector hierarchy
        return selector.replace(/&/g, this.stack.join(" "));
    };

    /**
     * Converts a kebab-case property name to camelCase, e.g., background-color to backgroundColor.
     * This ensures property names align with JavaScript/TypeScript conventions.
     */
    public toCamelCaseProperty(property: string): string {
        return property.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
    }

    /**
     * Converts a camelCase property name to kebab-case, e.g., backgroundColor to background-color.
     * This ensures property names align with CSS/LESS conventions.
     */
    public toKebabCaseProperty(property: string): string {
        return property.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    public getProperty(selector: string, property: string): string | undefined {
        property = this.toKebabCaseProperty(property);
        const prop = this.ast[selector]?.[property];

        // If the property is a number (_startLine or _endLine), convert to string
        if (typeof prop === 'number') return prop.toString();

        // If the property is an object (CSS property), return its value
        return typeof prop === 'object' && prop !== null ? prop.value : undefined;
    }

    private updateASTAfterInsertLine(lineNrInserted: number, linesInserted: number): void {
        for (const selector in this.ast) {
            const selectorData = this.ast[selector];
            if (selectorData._startLine !== undefined && selectorData._startLine > lineNrInserted) {
                selectorData._startLine += linesInserted;
            }
            if (selectorData._endLine !== undefined && selectorData._endLine > lineNrInserted) {
                selectorData._endLine += linesInserted;
            }
            for (const property in selectorData) {
                const propData = selectorData[property];
                if (propData && typeof propData === 'object' && propData.line > lineNrInserted) {
                    propData.line += linesInserted;
                }
            }
        }
    }

    public saveProperty(selector: string, property: string, newValue: string | undefined): boolean {

        property = this.toKebabCaseProperty(property);
        const prop = this.ast[selector]?.[property]; // Reuse `prop` throughout the function

        if (!prop) {
            // insert
            if (!newValue) return false;
            let lineNr: number;
            if (!this.ast[selector]) {
                lineNr = this.insertSelector(selector) + 1; // store lineNr for insert bellow
            } else {
                lineNr = this.findLastLineInSelector(selector);
            }
            const parts = selector.split(" ");
            const indentation = "\t".repeat(parts.length);
            this.ast[selector][property] = {
                value: newValue,
                line: lineNr,
                column: `${property}: `.length + indentation.length,
            };
            this.updateASTAfterInsertLine(lineNr, 1);
            return this.monacoDriver.insertLine(this.url, lineNr, `${indentation}${property}: ${newValue};`)
        }
        if (typeof prop !== 'object') return false;
        newValue = newValue?.split(";")[0] || ""; // remove ';'
        if (!newValue) {
            if (!this.ast[selector][property]) return false; // no change
            // delete
            const lineNr = prop.line; // save for delete
            delete this.ast[selector][property];
            this.updateASTAfterInsertLine(prop.line, -1);
            return this.monacoDriver.deleteLine(this.url, lineNr);
        }
        // update
        if (prop.value === newValue) return false; // no change
        prop.value = newValue;
        if (!newValue.endsWith(';')) newValue = newValue + ';';
        return this.monacoDriver.updateLine(this.url, prop.line, prop.column + 1, newValue);
    }

    /**
     * Returns the last line number within a selector block. aka "}"
     */
    public findLastLineInSelector(selectorLESS: string): number {
        if (!this.ast[selectorLESS]) return 1;
        return this.ast[selectorLESS]._endLine || 1;
    }

    public findInfoByLine(selectorLESS: string, lineNumber: number): { key: string, value: string; } | undefined {
        if (!this.ast[selectorLESS]) return undefined;
        const keyProps = Object.keys(this.ast[selectorLESS]);
        const key = keyProps.find((prop) => ((this.ast[selectorLESS][prop] as { value: string; line: number; column: number; })?.line === lineNumber));
        if (!key) return undefined;
        return {
            key,
            value: (this.ast[selectorLESS][key] as { value: string; line: number; column: number; }).value
        }
    }

    /**
     * Finds the most specific LESS selector path for a given line number in the source.
     * - This method searches the AST to determine the most specific selector block containing the specified line.
     * - It returns the full path of the most deeply nested selector in LESS format (e.g., `.cl1 .cl2 &:hover`).
     * 
     * ### Usage
     * This method is useful for identifying the exact selector block a line belongs to, especially
     * in scenarios where nested selectors exist in the LESS structure.
     * 
     * @param lineNr The line number to check for a corresponding selector.
     * @returns The most specific LESS selector path as a string if found; otherwise, `undefined`.
     */
    public findSelectorByLine(lineNr: number): string | undefined {
        let mostSpecificSelector: string | undefined = undefined;
        let maxDepth = -1;

        // Iterate over selectors in the AST
        for (const selector in this.ast) {
            const selectorData = this.ast[selector];

            // Check if this selector block includes the line number using _startLine and _endLine
            if (
                selectorData._startLine &&
                selectorData._startLine <= lineNr &&
                selectorData._endLine &&
                selectorData._endLine >= lineNr
            ) {
                // Calculate depth by counting spaces (each level separated by space)
                const depth = selector.split(" ").length;

                // Update the most specific selector if this one is deeper in the hierarchy
                if (depth > maxDepth) {
                    maxDepth = depth;
                    mostSpecificSelector = selector;
                }
            }
        }

        // Return the most deeply nested matching selector
        return mostSpecificSelector;
    }

    /**
     * Finds the start line of the first selector after the root in a JSON representation of a stylesheet.
     * 
     * @param json - A JSON object representing a stylesheet, where keys are selectors and values contain metadata.
     * @param tagName - The tag name to exclude from the search.
     * @returns The start line of the first selector after the root, or `null` if no such selector exists.
     */
    public findFirstSelectorAfterRoot(ast: Record<string, any>): number | null {
        const rootEndLine = ast.root?._endLine ?? 0; // End line of the root selector
        let closestSelector: string | null = null;

        for (const [key, value] of Object.entries(ast)) {
            if (key === 'root') continue;
            if (value._startLine > rootEndLine) {
                if (!closestSelector || value._startLine < ast[closestSelector]._startLine) {
                    closestSelector = key;
                }
            }
        }

        return closestSelector ? ast[closestSelector]._startLine : null;
    }


    /**
     * Inserts a new selector into the AST and the Monaco model if it does not exist.
     * - Example: If the AST only contains ".cl1" and `newSelectorLESS` is ".cl1 .cl2 &:hover",
     *   the function will:
     *   1. Check if ".cl1 .cl2" exists in the AST.
     *   2. If not, insert ".cl2" as a nested block within ".cl1".
     *   3. Then insert "&:hover" as a nested selector inside ".cl1 .cl2".
     * 
     * This function supports nested selectors by iteratively checking each level
     * and inserting any missing selectors in sequence.
     * 
     * @param newSelectorLESS The LESS selector to add to the AST and source code.
     * @result start line of the block
     */
    public insertSelector(newSelectorLESS: string): number {
        let startLine: number = 0;
        const parts = newSelectorLESS.split(" ");
        let currentSelector = "";

        // Iterate over each part in the selector to ensure each level exists
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            currentSelector = currentSelector ? `${currentSelector} ${part}` : part;

            // If the selector part does not exist, insert it
            if (!this.ast[currentSelector]) {
                let insertPoint = this.findLastLineInSelector(currentSelector.split(" ").slice(0, -1).join(" ") || "root");
                insertPoint = insertPoint > 0 ? insertPoint : startLine + 1;

                // Insert the selector in the source code and AST
                const indentation = "\t".repeat(i);
                this.monacoDriver.insertLine(this.url, insertPoint, `${indentation}${part} {`);
                this.monacoDriver.insertLine(this.url, insertPoint + 1, `${indentation}}`);
                startLine = insertPoint;
                this.updateASTAfterInsertLine(startLine, 2);

                // Initialize the new selector in the AST
                this.ast[currentSelector] = {
                    _startLine: startLine,
                    _endLine: startLine + 1
                };
            } else {
                startLine = this.findLastLineInSelector(currentSelector);
            }
        }
        return startLine;
    }

}

