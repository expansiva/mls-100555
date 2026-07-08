/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectConfig.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, css, svg, TemplateResult } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
import * as libProjectConfig from '/_102027_/l2/libProjectConfig.js';

/// **collab_i18n_start**
const message_pt = {
    clear: 'Limpar alterações',
}
const message_en = {
    clear: 'Clear changes',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}

/// **collab_i18n_end**

export const pluginData: mls.plugin.IPluginData = {
    title: "Config",
    getSvg(): TemplateResult {
        return svg`
     <svg height="22px" width="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M308.5 135.3c7.1-6.3 9.9-16.2 6.2-25c-2.3-5.3-4.8-10.5-7.6-15.5L304 89.4c-3-5-6.3-9.9-9.8-14.6c-5.7-7.6-15.7-10.1-24.7-7.1l-28.2 9.3c-10.7-8.8-23-16-36.2-20.9L199 27.1c-1.9-9.3-9.1-16.7-18.5-17.8C173.9 8.4 167.2 8 160.4 8l-.7 0c-6.8 0-13.5 .4-20.1 1.2c-9.4 1.1-16.6 8.6-18.5 17.8L115 56.1c-13.3 5-25.5 12.1-36.2 20.9L50.5 67.8c-9-3-19-.5-24.7 7.1c-3.5 4.7-6.8 9.6-9.9 14.6l-3 5.3c-2.8 5-5.3 10.2-7.6 15.6c-3.7 8.7-.9 18.6 6.2 25l22.2 19.8C32.6 161.9 32 168.9 32 176s.6 14.1 1.7 20.9L11.5 216.7c-7.1 6.3-9.9 16.2-6.2 25c2.3 5.3 4.8 10.5 7.6 15.6l3 5.2c3 5.1 6.3 9.9 9.9 14.6c5.7 7.6 15.7 10.1 24.7 7.1l28.2-9.3c10.7 8.8 23 16 36.2 20.9l6.1 29.1c1.9 9.3 9.1 16.7 18.5 17.8c6.7 .8 13.5 1.2 20.4 1.2s13.7-.4 20.4-1.2c9.4-1.1 16.6-8.6 18.5-17.8l6.1-29.1c13.3-5 25.5-12.1 36.2-20.9l28.2 9.3c9 3 19 .5 24.7-7.1c3.5-4.7 6.8-9.5 9.8-14.6l3.1-5.4c2.8-5 5.3-10.2 7.6-15.5c3.7-8.7 .9-18.6-6.2-25l-22.2-19.8c1.1-6.8 1.7-13.8 1.7-20.9s-.6-14.1-1.7-20.9l22.2-19.8zM112 176a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM504.7 500.5c6.3 7.1 16.2 9.9 25 6.2c5.3-2.3 10.5-4.8 15.5-7.6l5.4-3.1c5-3 9.9-6.3 14.6-9.8c7.6-5.7 10.1-15.7 7.1-24.7l-9.3-28.2c8.8-10.7 16-23 20.9-36.2l29.1-6.1c9.3-1.9 16.7-9.1 17.8-18.5c.8-6.7 1.2-13.5 1.2-20.4s-.4-13.7-1.2-20.4c-1.1-9.4-8.6-16.6-17.8-18.5L583.9 307c-5-13.3-12.1-25.5-20.9-36.2l9.3-28.2c3-9 .5-19-7.1-24.7c-4.7-3.5-9.6-6.8-14.6-9.9l-5.3-3c-5-2.8-10.2-5.3-15.6-7.6c-8.7-3.7-18.6-.9-25 6.2l-19.8 22.2c-6.8-1.1-13.8-1.7-20.9-1.7s-14.1 .6-20.9 1.7l-19.8-22.2c-6.3-7.1-16.2-9.9-25-6.2c-5.3 2.3-10.5 4.8-15.6 7.6l-5.2 3c-5.1 3-9.9 6.3-14.6 9.9c-7.6 5.7-10.1 15.7-7.1 24.7l9.3 28.2c-8.8 10.7-16 23-20.9 36.2L315.1 313c-9.3 1.9-16.7 9.1-17.8 18.5c-.8 6.7-1.2 13.5-1.2 20.4s.4 13.7 1.2 20.4c1.1 9.4 8.6 16.6 17.8 18.5l29.1 6.1c5 13.3 12.1 25.5 20.9 36.2l-9.3 28.2c-3 9-.5 19 7.1 24.7c4.7 3.5 9.5 6.8 14.6 9.8l5.4 3.1c5 2.8 10.2 5.3 15.5 7.6c8.7 3.7 18.6 .9 25-6.2l19.8-22.2c6.8 1.1 13.8 1.7 20.9 1.7s14.1-.6 20.9-1.7l19.8 22.2zM464 304a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
    `;
    }
};

@customElement('plugin-project--plugin-project-config-100555')
export class PluginProjectConfig extends PluginBaseModule {

    public static modelCount: number;
    private msg: MessageType = messages['en'];

    @property({ type: Boolean }) autoPrepare: boolean = false;
    @property({ type: String }) msize = '';

    @query('.editor-container') c2: HTMLElement | undefined;
    @query('.plugin-body') body: HTMLDivElement | undefined;

    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;

    private model: monaco.editor.ITextModel | undefined;

    private lastProject: number | undefined;

    private template: string = `window.project_config`

    async prepare() {
        this.createEditor();
        await this.loadProjectConfigs();
    }

    firstUpdated() {
        if (!this.body || !this.autoPrepare) return;
        this.prepare();
    }

    createRenderRoot() {
        return this;
    }

    render(): TemplateResult {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        this.style.display = 'block';
        this.style.width = '100%';
        const h = this.msize ? this.msize.split(',')[1] + 'px' : '100%'
        this.style.height = h;
        if (this.scope !== "dashboard") return html``;
        return html`
            <div class="plugin-container">
                ${this.renderHeader()}
                ${this.renderBody()}
            </div>
        `;
    }

    renderHeader(): TemplateResult {
        return html`
            <header>
                <div>
                    <div>${pluginData.getSvg()}</div>
                    <h2>${pluginData.title}</h2>
                </div>
                <div>
                    <button @click=${this._clearChanges}>${this.msg.clear}</button>
                </div>
            </header>
            
        `;
    }

    renderBody(): TemplateResult {
        return html`<div class="plugin-body">
            <div class="editor-container"></div>
        </div>`;
    }

    async setEvents() {
        mls.events.addEventListener([5], ['ProjectSelected'], (ev) => {
            if (!ev.desc) return;
            const desc: IProjectSelectEvent = JSON.parse(ev.desc);
            this.refreshIfNeeded(desc.value);
        });
    }


    private _clearChanges() {
        this.loadProjectConfigs(true);
        if (this.lastProject) {
            libProjectConfig.clearLocalChanges(this.lastProject);
            this.refreshIfNeeded(this.lastProject);
        }
    }

    private refreshIfNeeded(project: number | undefined) {
        if (this.lastProject !== project) {
            this.loadProjectConfigs();
        }
    }

    private createEditor(): void {
        if (!this.c2 || this._ed1) return;
        const opt = {
            automaticLayout: true,
        };
        this._ed1 = monaco.editor.create(this.c2, opt);
        (this.c2 as any)['mlsEditor'] = this._ed1;
    }

    private async loadProjectConfigs(ignoreLocal: boolean = false) {

        const project = mls.actualProject;
        if (!project) return;
        this.lastProject = project;
        let config = await libProjectConfig.getConfigProject(project, ignoreLocal);

        if (!config) config = await libProjectConfig.createConfigFile(project);
        this.setInitialConfig(JSON.stringify(config, null, 2), project);
    }

    private setInitialConfig(value: string, project: number) {
        const newValue = this.template + ' = ' + value;
        this.model = this.createOrGetModel('typescript', newValue, project);
        if (!this.model || !this._ed1) return;
        this._ed1.setModel(this.model);
    }

    private createOrGetModel(editorType: string, src: string, project: number) {
        const uri = this.getUri(`${this.constructor.name}_${project}}`);
        let model1 = monaco.editor.getModel(uri);
        if (!model1) {
            model1 = monaco.editor.createModel(src, editorType, uri);
            this.setEventsModel(model1);
        } else {
            model1.setValue(src);
        }
        return model1;
    }

    private timeoutChangesEditorStyle: number = 0;

    private setEventsModel(model: monaco.editor.ITextModel) {
        model.onDidChangeContent((event) => {
            if (this.timeoutChangesEditorStyle) window.clearTimeout(this.timeoutChangesEditorStyle);
            this.timeoutChangesEditorStyle = window.setTimeout(() => {
                this.onEditorChange();
            }, 1000);
        });
    }

    private async onEditorChange() {

        if (!this.model) return;
        const val = this.model.getValue();
        const errors = monaco.editor.getModelMarkers(({ resource: this.model.uri }));
        if (errors && errors.length > 0) return;
        const that = this;
        (async function scope() {
            eval(val); // eslint-disable-line no-eval
            if ((window as any).project_config && typeof (window as any).project_config === 'object' && that.lastProject) {
                libProjectConfig.updateConfigProject(that.lastProject, (window as any).project_config);
            }
        }).call(this);

    }

    private getUri(shortFN: string): monaco.Uri {
        PluginProjectConfig.modelCount = PluginProjectConfig.modelCount + 1 || 1;
        return monaco.Uri.parse(`file://server/${shortFN}_${PluginProjectConfig.modelCount}.ts`);
    }


}


interface IProjectSelectEvent {
    emitter: 'right' | 'left',
    value: number
}
