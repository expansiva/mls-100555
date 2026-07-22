/// <mls fileReference="_100555_/l2/pluginEditL3/pluginEditStyleL3.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, query, property, state } from 'lit/decorators.js';
import { convertFileNameToTag } from '/_102027_/l2/utils.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
import { LessAST } from "/_100555_/l2/pluginEditL3/pluginEditStyleAST.js";
import { getPath } from '/_102027_/l2/utils.js';

import '/_102027_/l2/collabMonacoEditor.js';

/// **collab_i18n_start**
const message_pt = {
    noItens: 'Nenhum item foi encontrado!'
}

const message_en = {
    noItens: 'No items were found!',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**
@customElement('plugin-edit-l3--plugin-edit-style-l3-100555')
export class PluginEditStyleL3 extends PluginBaseModule {

    //--------PROPERTS-----------
    @query('collab-monaco-editor-102027') private editorEl: HTMLElement | undefined;
    @property({ type: String }) msize = '';
    @state() error = '';

    //--------VARIABLES-----------
    private static inEdit = false;
    private static inSetValue = false;
    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;
    private _ed2: monaco.editor.IStandaloneCodeEditor | undefined;
    private initalSelectors: string[] = [];

    private msg: MessageType = messages['en'];
    private model: monaco.editor.ITextModel | undefined;
    private modelDest: monaco.editor.ITextModel | undefined;
    public modelBase: mls.editor.IModels | undefined;

    public lessAst: LessAST | undefined;
    public lessAstDest: LessAST | undefined;

    private keysResolve: any = {};

    //-----------INIT------------

    get getKeyEditor() { return 'l3_left' };
    get confE() { return `l3_left`; }

    constructor() {
        super();
        this.setEvents();
    }


    //--------EVENTS-------------

    private setEvents(): void {
        mls.events.addEventListener([1, 2, 3, 4, 5, 6, 7], ['ToolBarSelected'], (ev) => this.onlevelChange(ev));
        mls.events.addListener(3, 'L3EditEvents' as any, this.onL3EditEvents.bind(this));
    }

    private onL3EditEvents(ev: mls.events.IEvent) {
        if (!ev.desc || ev.level !== 3) return;
        const info = JSON.parse(ev.desc);
        if (!info || !info.action || !info.position || info.position === 'left') return;
    }

    private onlevelChange(ev: mls.events.IEvent) {
        if (!ev.desc) return;
        const j = JSON.parse(ev.desc);
        if (j.level === 3) {
            this.forceUpdate();
        }
    }



    //-------COMPONENT----------

    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        this.init();
    }

    updated(changedProperties: any) {
        super.updated(changedProperties);
        if (changedProperties.has('msize')) {
            this.updatedMSizeEditor();
        }
    }

    render() {
        this.style.display = 'block';
        return html`
            ${this.error ? html`<h3 style="color:red">${this.error}</h3>` : ''}
            <collab-monaco-editor-102027 style="${this.error ? 'display:none' : 'display: ""'}" slot="left"></collab-monaco-editor-102027>
        `
    }


    //-------- IMPLEMENTATION --------------

    public async forceUpdate() {
        this.error = '';
        await this.updateComplete;
        this.init();
    }


    private async init() {
        if (!this._ed1) {
            await this.initMonaco_Editor();
        }
        this.openFile();
    }

    private async initMonaco_Editor(): Promise<void> {

        if (!this.editorEl) return;

        this._ed1 = monaco.editor.create(this.editorEl, { minimap: { enabled: false } });
        this._ed2 = monaco.editor.create(document.createElement('div'), { minimap: { enabled: false } });

        (this.editorEl as any)['mlsEditor'] = this._ed1;
        mls.editor.instances[this.confE] = this._ed1;
        mls.editor.InitEditor(this._ed1);

    }

    private async openFile() {

        const path = getPath(mls.actual[3].getFullName());
        if (!path) throw new Error('[openFile] Not found path:' + mls.actual[3].getFullName());

        const key = mls.stor.getKeyToFiles(path.project, 2, path.shortName, path.folder, '.ts');
        const file = mls.stor.files[key];

        if (!file) {
            this.error = 'Not found storfile';
            return;
        }

        const scope = (window as any).preview?.iframe?.contentDocument?.body;
        const iframeDoc = (window as any).preview?.iframe?.contentWindow;

        if (!scope || !iframeDoc) {
            this.error = 'Not found preview';
            return;
        }

        if (!this.model) this.model = await this.createModel(file, 'ori');
        if (!this.modelDest) this.modelDest = await this.createModel(file, 'dest');


        const modelBase = mls.editor.getModels(file.project, file.shortName, file.folder);

        if (!modelBase || !modelBase.style) {
            this.error = 'Not found base model';
            return;
        }

        if (!this._ed1 || !this.model || !this._ed2 || !this.modelDest) {
            this.error = 'Not found model';
            return;
        }

        this._ed1.setModel(this.model);
        this._ed2.setModel(this.modelDest)

        this.modelBase = modelBase;

        PluginEditStyleL3.inSetValue = true;
        await this.setContentDest();
        await this.setContent(scope, iframeDoc);
        this.updatedMSizeEditor();
        PluginEditStyleL3.inSetValue = false;

    }

    private async setContentDest() {


        if (!this.modelDest || !this.modelBase || !this.modelBase.style) return;

        this.modelDest.setValue(this.modelBase.style.model.getValue());
        await this._ed2?.getAction('editor.action.formatDocument')?.run();

    }

    private async setContent(scope: HTMLElement, iframeDoc: Window) {

        const active = scope.querySelector('*[clb_mode]') as HTMLElement;
        if (!active) {
            this.error = 'Not found element';
            return;
        }

        if (!this.lessAstDest) return;

        let cssText = '';
        const sel = this.getMatchingRulesForElement(active, iframeDoc);
        sel.forEach((selector) => {

            if (!this.lessAstDest) return;
            this.lessAstDest.select(selector.selector);
            cssText += `\n${this.lessAstDest.exportSelectorGroupStrict(selector.selector)}`;

        });

        if (!cssText) {

            const { project, path } = mls.actual[3];
            const info = getPath(`_${project}_${path}`);
            if (!info) throw new Error('[setContent] Not found path:' + `_${project}_${path}`);
            const nameTag = convertFileNameToTag(info);
            cssText += `
            ${nameTag}{
                #${active.id}{

                }
            }
    
            `
        }

        this.model?.setValue(cssText);
        await this._ed1?.getAction('editor.action.formatDocument')?.run();

    }

    private async createModel(storFile: mls.stor.IFileInfo, mode: 'ori' | 'dest'): Promise<monaco.editor.ITextModel | undefined> {

        try {
            const uri = monaco.Uri.parse(`file://server/_${storFile.project + mode}_l3_editor.less`);
            let model = monaco.editor.getModel(uri);
            if (!model) model = monaco.editor.createModel('', 'less', uri)

            model.onDidChangeContent((e: monaco.editor.IModelContentChangedEvent) => {
                this._onModelChange(e, mode);

            }
            );

            return model;
        } catch (e: any) {
            this.error = e.message;
        }
    }

    private _onModelChange(e: monaco.editor.IModelContentChangedEvent, mode: 'ori' | 'dest'): void {

        if (PluginEditStyleL3.inEdit) return;

        if (mode === 'ori' && this.model) {

            let isfirtTime = !this.lessAst;
            this.lessAst = new LessAST(this.model);

            if (isfirtTime) {

                this.initalSelectors = [...this.lessAst.blocks.keys()].filter((i) => i.indexOf(' ') >= 0);

            } else if (!PluginEditStyleL3.inSetValue) this.changeLessOrigin();

        } else if (mode === 'dest' && this.modelDest) {
            this.lessAstDest = new LessAST(this.modelDest);
        }

    }

    private timeOnChangeLessOrigin = 0;
    private changeLessOrigin() {
        clearTimeout(this.timeOnChangeLessOrigin);
        this.timeOnChangeLessOrigin = window.setTimeout(() => {
            this.changeLessOrigin2();
        }, 600);
    }

    private changeLessOrigin2() {

        if (!this.lessAst || !this.lessAstDest) return;

        PluginEditStyleL3.inEdit = true;
        const keys = [...this.lessAst.blocks.keys()].filter((i) => i.indexOf(' ') >= 0);
        keys.forEach((myKey) => {

            if (!this.lessAst || !this.lessAstDest) return;
            const keyCss = this.keysResolve[myKey] || myKey;
            if (!keyCss) return;

            if (this.lessAstDest.blocks.get(keyCss)) {
                this.lessAstDest.select(keyCss);
                this.lessAst.select(keyCss);
                this.mergeCssDeclarations();

            } else if (!this.lessAstDest.blocks.get(keyCss)) {
                this.lessAst.select(myKey);
                this.initalSelectors.push(keyCss);
                this.lessAstDest.addSelector(keyCss, this.lessAst.rules as Record<string, string>);
            }

        });

        const diff = this.initalSelectors.filter(item => !keys.includes(item));

        diff.forEach((myKey) => {

            if (!this.lessAst || !this.lessAstDest) return;
            const keyCss = this.keysResolve[myKey] || myKey;
            this.lessAstDest.removeSelector(keyCss);

        });

        const newLess = this.modelDest?.getValue() || '';
        if (this.modelBase && this.modelBase.style && this.modelDest) this.modelBase.style.model.setValue(newLess);

        PluginEditStyleL3.inEdit = false;
        setTimeout(() => {
            this.modelDest?.setValue(newLess);
            if (this.modelBase && this.modelBase.ts && this.modelBase.style) {
                //mls.events.fireFileAction('editorChanged', this.modelBase.style.storFile, 'left', 0);
                //mls.events.fire([3], ['styleChanged'] as any, JSON.stringify({ position: 'left', storFile: this.modelBase.style.storFile }));
            }
        }, 500)


    }

    private mergeCssDeclarations() {

        if (!this.lessAst || !this.lessAstDest || !this.lessAst.rules) return;

        for (const prop of Object.keys(this.lessAst.rules)) {
            const vl = this.lessAst.rules[prop];
            if (vl) this.lessAstDest.setRule(prop, vl);
        }

        if (this.lessAstDest.rules) {
            for (const prop of Object.keys(this.lessAstDest.rules)) {
                const vl = this.lessAst.rules[prop];
                if (!vl) this.lessAstDest.setRule(prop, '');
            }
        }
    }

    private getMatchingRulesForElement(element: HTMLElement, iframeDoc: Window): ISelector[] {
        if (!(iframeDoc as any).getMatchingRulesForElement) return [];
        return (iframeDoc as any).getMatchingRulesForElement(element);
    }

    private updatedMSizeEditor() {
        this.editorEl?.setAttribute('msize', this.msize);
    }

    private resolveSelector(selector: string): string {
        const parts = selector.trim().split(/\s+/);
        const result: string[] = [];

        for (const part of parts) {
            if (part.startsWith('&.')) {
                const className = part.slice(1);
                if (result.length > 0) {
                    result[result.length - 1] += className;
                } else {
                    result.push(className);
                }
            } else {
                result.push(part);
            }
        }

        return result.join(' ');
    }

}

interface ISelector {
    origin: string,
    selector: string,
    style: StyleSheet

}