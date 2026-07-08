/// <mls fileReference="_100555_/l2/utils/lessCSS.ts" enhancement="_blank" />

import { LessAst } from "/_100555_/l2/utils/lessAST.js";
import { setState, getState, initState } from '/_102029_/l2/collabState.js';

/**
 * A unique symbol used as a key for properties that should be ignored during JSON serialization.
 * 
 * Properties defined with this symbol as a key will not appear in the output of `JSON.stringify`,
 * ensuring that the property is excluded from serialization while avoiding key collisions.
 * 
 * @const {symbol} ignoredProperty - A unique symbol for marking non-serializable properties.
 */
const _editor = Symbol("ignoredProperty");

export class LessCSS {
    lessAST: LessAst;
    selector: string;
    position: "left" | "right" = "left";
    [_editor]: monaco.editor.IStandaloneCodeEditor | undefined;
    _url: string = '';

    public styles: CSSStyleDeclaration;

    constructor(url: string, editor: monaco.editor.IStandaloneCodeEditor, position: "left" | "right" = "left") {

        this.lessAST = new LessAst(url, editor);
        this[_editor] = editor;
        this.selector = '';
        this.position = position;
        this._url = url;
        this.initStateIfNeeded();

        // Initialize CSSStyleDeclaration to provide autocomplete for CSS properties
        const cssDeclaration = document.createElement("div").style;

        // Create a proxy to intercept get/set on `styles`
        this.styles = new Proxy(cssDeclaration, {
            get: (target, property: string) => {
                // Retrieve the property value from LessCSS's `getProperty` function
                return this.getProperty(property) ?? target[property as any];
            },
            set: (target, property: string, value: string) => {
                // Use `setProperty` to update both AST and Monaco
                this.setProperty(property, value);
                target[property as any] = value;
                return true;

            }
        });
    }

    public setEditor(editor: monaco.editor.IStandaloneCodeEditor) {
    }

    /**
     * Sets the current selector for which properties will be applied.
     */
    public setSelector(selector: string): void {
        this.selector = selector;
    }

    /**
     * Retrieves a specific CSS property value for the current selector from the AST.
     * @param property The CSS property to retrieve
     */
    public getProperty(property: string): string | undefined {
        return this.lessAST.getProperty(this.selector, property);
    }

    /**
     * Sets or updates a CSS property in the AST and source model.
     * @param property The CSS property to set
     * @param value The new value for the property
     */
    public setProperty(property: string, value: string): void {

        // Update the AST and LESS source model
        this.lessAST.saveProperty(this.selector, property, value);

        // Optional: Fire an event to update the UI if necessary
        // this.fireChangeEvent();

        this.updateState();

    }

    public refresh() {
        if (this[_editor]) {
            this.lessAST = new LessAst(this._url, this[_editor]);
        }
        this.setSelector(this.selector);
    }

    public setStateByLine(lineNumber: number, lineContent: string, emitter: 'editor' | 'helper' | 'preview'): void {

        this.refresh();

        const state = getState(`less.${this.position}`);
        if (!state) return;

        const selector = this.lessAST.findSelectorByLine(lineNumber);

        if (!selector) {
            this.clearState();
            setState(`less.${this.position}.lineContent`, lineContent);
            return;
        }

        this.setSelector(selector);
        const info = this.lessAST.findInfoByLine(selector, lineNumber);
        const obj: any = {
            selector: selector,
            lineContent: lineContent,
            emitter: emitter,
            lineNumber: lineNumber,
            lessCSS: this,
        }

        if (info && info.key) obj.key = info.key;
        if (info && info.value !== undefined) obj.value = info.value;
        setState(`less.${this.position}`, obj);

    }

    private clearState() {

        const state = getState(`less.${this.position} `);
        if (!state) return;
        setState(`less.${this.position}.lessCSS`, undefined);
        setState(`less.${this.position}.key`, undefined);
        setState(`less.${this.position}.value`, undefined);
        setState(`less.${this.position}.selector`, undefined);

    }

    private updateState() {
        const state = getState(`less.${this.position} `);
        if (!state) return;
        setState(`less.${this.position}.lessCSS`, this);
        setState(`less.${this.position}.lessCSS.styles`, this.styles);
    }

    private initStateIfNeeded() {

        const stateLess = getState(`less`);
        if (!stateLess) {
            initState('less', {
                left: {},
                right: {}
            });
        }
        
        setState(`less.${this.position}`, {
            lessCSS: this,
            emitter: 'editor',
            key: undefined,
            value: undefined,
            lineNumber: undefined,
            selector: undefined,
            uri: this._url,
        });

    }

}

export interface ICSSState {
    uri: string,
    selector: string | undefined,
    lineNumber: number | undefined,
    lineContent: string | undefined,

    key: string | undefined,
    value: string | undefined,
    lessCSS: LessCSS | undefined,
    emitter: 'editor' | 'helper' | 'preview'
}