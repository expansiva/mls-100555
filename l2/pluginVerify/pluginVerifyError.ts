/// <mls fileReference="_100555_/l2/pluginVerify/pluginVerifyError.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';

/// **collab_i18n_start**
const message_pt = {
    fileVerification: 'Verificação de arquivos',
    checkFiles: 'Verificando arquivos',
    noErros: "Nenhum erro encontrado",
    cancel: 'Cancelar verificação'
};

const message_en = {
    fileVerification: 'File verification',
    checkFiles: 'Checking files',
    noErros: 'No errors found',
    cancel: 'Cancel verification',
};

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('plugin-verify--plugin-verify-error-100555')
export class PluginVerifyError extends PluginBaseModule {

    private msg = messages['en'];
    private continueVerify = true;

    @property() find: string[] = [];
    @property() current: string = '0';
    @property() tot: string = '0';
    @property() error: string = '';
    @property() autoPrepare: boolean = false;
    @property() isLoad: boolean = false;
    @property() listErrors: string[] = [];


    //-----COMPONENT---------
    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        if (!this.autoPrepare)
            return;
        this.prepare();
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        if (this.error !== '') {
            return html
                `${this.renderHeader()}
                <h4 style="color:red">${this.error}</h4>
            `;
        }

        if (this.isLoad) {
            return html`
                ${this.renderHeader()}
                ${this.renderLoad()}
            ` ;
        }

        return this.renderErros();

    }


    renderLoad() {
        return html`
        <div class="contentloader">
            <div class="textLoader">
                ${this.msg.checkFiles}
                <span>${this.current}/${this.tot}</span>
            </div>
            <button @click=${this.cancelVerify}>${this.msg.cancel}</button>
            <ul>
                ${repeat(this.find, ((key: string) => key) as any, ((k: any, index: any) => this.renderItem(k)) as any)}
            </ul>
        </div>
        `
    }

    renderHeader() {
        return html`
            <h3>${this.msg.fileVerification}</h3>
        `;
    }

    renderErros() {

        if (this.listErrors.length <= 0) this.listErrors.push(this.msg.noErros)
        return html`
            ${this.renderHeader()}
            <ul>

                ${repeat(this.listErrors, ((key: string) => key) as any, ((k: any, index: any) => this.renderItem(k)) as any)}
            
            </ul>
        `
    }

    renderItem(i: string) {
        return html`
            <li>
                ${i}
            </li>
        `
    }


    //------IMPLEMENTS--------
    async prepare() {
        try {

            this.isLoad = true;
            this.continueVerify = true;

            const prj = mls.actualProject;
            if (!prj) throw new Error('Not found project');

            const url = '/_100554_/l2/collabInit.js';
            const initCompileMonaco = await import(url);
            await initCompileMonaco(prj);

            const ret = await mls.l2.typescript.compileAll(prj, this.progressCallback.bind(this));

            this.listErrors = ret;
            this.setFilesErros(this.listErrors);
            
            if (!this.continueVerify) this.fireEvent(true);
            else this.fireEvent(this.listErrors.length === 0);

            this.isLoad = false;

        } catch (e: any) {
            this.isLoad = false;
            this.error = e.message;
        }

    }

    private setFilesErros(array: string[]) {

        const ret: mls.stor.IFileInfo[] = [];
        const itens = array.map(str => str.replace(/^--- Error compiling\s+/, ''));

        itens.forEach((f) => {

            let pr = f.substring(1).split("_")[0];
            let prID: number = Number(pr);
            if (isNaN(prID)) prID = 0; // error
            let path = f.substring(pr.length + 2);
            const key = mls.stor.getKeyToFiles(prID, 2, path, '', '.ts');
            if (mls.stor.files[key]) {
                mls.stor.files[key].hasError = true;
                ret.push(mls.stor.files[key]);
            }

        })

        return ret;

    }

    private cancelVerify() {
        this.continueVerify = false;
    };

    private progressCallback(current: number, total: number, results: string[]) {
        this.current = current.toString();
        this.tot = total.toString();
        this.find = results;
        return this.continueVerify;
    }

    private fireEvent(free: boolean) {
        mls.events.fire(
            mls.actualLevel as any,
            'ProjectCompilationComplete',
            JSON.stringify({ tsFree: free }),
            0
        );
    }
}