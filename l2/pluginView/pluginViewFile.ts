/// <mls fileReference="_100555_/l2/pluginView/pluginViewFile.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, svg, TemplateResult } from 'lit';
import { customElement, state, property, query } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
import { createModelAnyFile } from '/_102027_/l2/libModel.js';
import '/_102027_/l2/collabMonacoEditor.js';

/// **collab_i18n_start** 
const message_pt = {
    msg1: 'Este arquivo não é visual nem de áudio',
    msg2: 'Não é possível mostrar o conteúdo deste tipo de arquivo.',
    msg3: 'Nenhum arquivo selecionado.'
}

const message_en = {
    msg1: 'This file is neither visual nor audio.',
    msg2: 'It is not possible to display the contents of this type of file.',
    msg3: 'No file selected.'
};

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'pt': message_pt,
    'en': message_en
}
/// **collab_i18n_end**

@customElement('plugin-view--plugin-view-file-100555')
export class PluginViewFile extends PluginBaseModule {

    private msg = messages['en'];

    @property() nameFile: string = '';

    @state() current: number = 1;
    @state() file: mls.stor.IFileInfo | undefined;

    @state() contentText: string = '';
    @state() contentUrl: string = '';
    @state() extension: string = '';

    @property({ type: String }) msize = '';
    private editor: IHTMLEditorElement | undefined;
    @query('#elEditor') elEditor: IHTMLEditorElement | undefined;
    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;
    get confE() { return `l2_left`; }

    firstUpdated() {
        this.createEditor();
        this.init();
    }

    updated(changedProps: Map<string, any>) {
        if (changedProps.has('current') && this.current === 2) {
            this.updateEditorContent();
        }
        if (changedProps.has('msize')) {
            this.editor?.setAttribute('msize', this.msize);
            (window as any).elEditorDetailsView?.setAttribute('msize', this.msize);
        }
    }

    private async updateEditorContent() {
        this.createEditor();
        if (!this._ed1) return;

        this._ed1.updateOptions({ readOnly: false });

        if (this.file && ['.html', '.ts', '.defs.ts', '.test.ts', '.less'].includes(this.file.extension)) {
            const m = await this.file.getOrCreateModel();
            this._ed1.setModel(m.model);
        } else if (this.file) {
            const m = await createModelAnyFile(this.file);
            this._ed1.setModel(m.model);
            if (!(m as any).pluginViewEventsWired) {
                (m as any).pluginViewEventsWired = true;
                const file = this.file;
                let timeout: number = 0;
                m.model.onDidChangeContent(() => {
                    clearTimeout(timeout);
                    timeout = window.setTimeout(() => {
                        mls.events.fireFileAction('statusOrErrorChanged', file, 'left', 0);
                        mls.events.fireFileAction('editorEvents' as any, file, 'left');
                    }, 400);
                });
            }
        }

    }

    render(): TemplateResult {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
        <div class="agent-box">
            ${this.renderHeader()}

            <div class="viewer-container">
                ${this.renderViewMode()}
                ${this.renderInfoMode()}
            </div>
        </div> 
        `;
    }

    renderHeader(): TemplateResult {
        return html` 
            <header>
                <span class="svg-container">${pluginData.getSvg()}</span>
                <span>${this.file ? mls.stor.convertFileToFileReference(this.file) : ''}</span>

                
            </header>

            <div class="mode-tabs">
                <button class=${this.current === 1 ? 'active' : ''} @click=${() => this.current = 1} >
                    <svg viewBox="0 0 24 24">
                        <path fill="currentColor"
                        d="M12 5c-7 0-10 7-10 7s3 7 10 7s10-7 10-7s-3-7-10-7Zm0 11a4 4 0 1 1 0-8a4 4 0 0 1 0 8Z"/>
                    </svg>
                </button>

                <button class=${this.current === 2 ? 'active' : ''} @click=${() => this.current = 2} >
                    <svg viewBox="0 0 24 24">
                        <path fill="currentColor"
                        d="M11 9h2V7h-2m1 13c-5.5 0-10-4.5-10-10S6.5 0 12 0s10 4.5 10 10s-4.5 10-10 10Zm-1-6h2v-6h-2v6Z"/>
                    </svg>
                </button>
            </div>

            
        `;
    }

    renderViewMode(): TemplateResult {

        if (!this.file) {
            return html`<p>${this.msg.msg3}</p>`;
        }

        if (this.isImage()) {
            return html`
                <img src="${this.contentUrl}" style="max-width:100%; display:${this.current === 1 ? 'block' : 'none'}" />
            `;
        }

        if (this.isAudio()) {
            return html`
                <audio controls src="${this.contentUrl}" style=" display:${this.current === 1 ? 'block' : 'none'}"></audio>
            `;
        }

        if (this.isVideo()) {
            return html`
            <video
                controls
                src="${this.contentUrl}"
                style="max-width:100%; max-height:600px; display:${this.current === 1 ? 'block' : 'none'}"
            ></video>
        `;
        }

        if (this.extension === '.html') {
            return html`
                <iframe
                    srcdoc="${this.contentText}"
                    style="width:100%;height:600px;border:none; display:${this.current === 1 ? 'block' : 'none'}"
                ></iframe>
            `;
        }

        return html`
            <p style=" display:${this.current === 1 ? 'block' : 'none'}">${this.msg.msg1}</p>
        `;
    }

    renderInfoMode(): TemplateResult {

        return html`<div id="elEditor" style="width:100%; flex:1; min-height:0; align-self:stretch; display:${this.current === 2 ? 'flex' : 'none'}; flex-direction:column;"></div>`


    }

    // -------------------------
    // INIT
    // -------------------------

    private createModel() {
        const uri = monaco.Uri.parse(`file://server/detailsViewModel.ts`);
        let src = '';
        let model1 = monaco.editor.getModel(uri);
        if (!model1) model1 = monaco.editor.createModel(src, 'html', uri);
        return model1;
    }

    private createEditor(): void {
        if (!this.elEditor || this._ed1) return;
        if ((window as any).editorTaskView && (window as any).elEditorDetailsView) {
            this.editor = (window as any).elEditorDetailsView;
            this._ed1 = (window as any).editorTaskView;
            this._ed1?.setModel(this.createModel());

        } else {

            const model = this.createModel();
            (window as any).elEditorDetailsView = document.createElement('collab-monaco-editor-102027');
            (window as any).elEditorDetailsView.style.cssText = 'display:block; width:100%; flex:1; min-height:0;'
            this.editor = (window as any).elEditorDetailsView as IHTMLEditorElement;
            (window as any).editorTaskView = monaco.editor.create(this.editor, this.conf as monaco.editor.IEditorOptions);
            this._ed1 = (window as any).editorTaskView as monaco.editor.IStandaloneCodeEditor;
            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                noImplicitAny: true
            })


            this.editor.mlsEditor = this._ed1;
            this._ed1.setModel(model);
        }

        this.elEditor.appendChild(this.editor as any);
    }

    private async init() {

        this.file = mls.stor.files[this.nameFile];
        if (!this.file) return;

        this.extension = this.file.extension;

        const data = await this.file.getContent();

        if (typeof data === 'string') {
            this.contentText = data;
            this.current = 2;
        }
        else {
            this.contentUrl = await mls.stor.cache.getURL(this.file.project, this.file.folder, this.file.shortName, this.file.extension, this.file.versionRef) || '';
            this.current = 1;
        }

    }

    private isImage() {
        return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif'].includes(this.extension);
    }

    private isAudio() {
        return ['.mp3', '.wav', '.ogg'].includes(this.extension);
    }

    private isVideo() {
        return ['.mp4', '.webm', '.ogg', '.mov'].includes(this.extension);
    }

    private isReadableText() {
        return [
            '.html',
            '.js',
            '.css',
            '.txt',
            '.md',
            '.json',
            '.xml',
            '.d.ts'
        ].includes(this.extension);
    }

    private conf = {
        "contextmenu": true,
        "autoIndent": "full",
        "wordWrap": "on",
        "wrappingIndent": "indent",
        "tabCompletion": "on",
        "renderControlCharacters": false,
        "showUnused": true,
        "glyphMargin": true,
        "minimap": {
            "enabled": false
        },
        "useTabStops": true,
        "scrollBeyondLastColumn": 2,
        "scrollBeyondLastLine": false,
        "formatOnType": true,
        "fixedOverflowWidgets": true,
        "codeLens": true,
        "showFoldingControls": "mouseover",
        "suggestSelection": "first",
        "stickyScroll": {
            "enabled": false,
            "maxLineCount": 3
        },
        "stickyTabStops": true,
        "fontSize": 14,
        "automaticLayout": true,
    }

}

export const pluginData: mls.plugin.IPluginData = {
    title: "View File",
    getSvg(): TemplateResult {
        return svg`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M192 64C156.7 64 128 92.7 128 128L128 384L512 384L512 234.5C512 217.5 505.3 201.2 493.3 189.2L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240zM128 416L128 480L192 480L192 416L128 416zM192 576L192 512L128 512C128 547.3 156.7 576 192 576zM224 576L304 576L304 512L224 512L224 576zM336 576L416 576L416 512L336 512L336 576zM448 576C483.3 576 512 547.3 512 512L448 512L448 576zM512 416L448 416L448 480L512 480L512 416z"/></svg>
    `;
    }
}

interface IHTMLEditorElement extends HTMLElement {
    mlsEditor: monaco.editor.IStandaloneCodeEditor
}