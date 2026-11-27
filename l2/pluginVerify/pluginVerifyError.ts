/// <mls fileReference="_100555_/l2/pluginVerify/pluginVerifyError.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property, state } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';

/// **collab_i18n_start**
const message_pt = {
    fileVerification: 'Verificação de arquivos',
    checkFiles: 'Verificando arquivos',
    noErros: 'Nenhum erro encontrado',
    noErrosHint: 'Todos os arquivos TypeScript do projeto compilaram.',
    errorsFound: 'arquivos com erro',
    cancel: 'Cancelar',
    cancelled: 'Verificação cancelada',
    verifyAgain: 'Verificar novamente',
};

const message_en = {
    fileVerification: 'File verification',
    checkFiles: 'Checking files',
    noErros: 'No errors found',
    noErrosHint: 'Every TypeScript file in the project compiled.',
    errorsFound: 'files with errors',
    cancel: 'Cancel',
    cancelled: 'Verification cancelled',
    verifyAgain: 'Verify again',
};

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

const ICON_SHIELD = html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/></svg>`;
const ICON_OK = html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>`;
const ICON_ERR = html`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/></svg>`;
const ICON_REFRESH = html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></svg>`;

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
    @state() private cancelled: boolean = false;


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

        return html`
            <div class="ve">
                ${this.renderHeader()}
                ${this.error ? html`<div class="ve-error" role="alert">${this.error}</div>`
                : this.isLoad ? this.renderLoad()
                    : this.renderErros()}
            </div>
        `;
    }

    renderHeader() {
        const count = !this.isLoad && !this.error ? this.listErrors.length : 0;
        return html`
            <div class="ve-header">
                <span class="ve-header-icon">${ICON_SHIELD}</span>
                <span class="ve-title">${this.msg.fileVerification}</span>
                ${count ? html`<span class="ve-badge err">${count}</span>` : ''}
                ${this.isLoad ? '' : html`
                    <button class="ve-icon-btn" title="${this.msg.verifyAgain}" @click=${() => this.prepare()}>${ICON_REFRESH}</button>`}
            </div>
        `;
    }

    renderLoad() {
        const cur = +this.current || 0;
        const tot = +this.tot || 0;
        const pct = tot ? Math.min(100, Math.round(cur / tot * 100)) : 0;
        return html`
            <div class="ve-progress">
                <div class="ve-progress-row">
                    <span class="ve-spinner"></span>
                    <span class="ve-progress-text">${this.msg.checkFiles}</span>
                    <span class="ve-progress-count">${cur}/${tot}</span>
                    <button class="ve-btn-link" @click=${this.cancelVerify}>${this.msg.cancel}</button>
                </div>
                <div class="ve-bar"><span style="width:${pct}%"></span></div>
            </div>
            ${this.find.length ? this.renderList(this.find) : ''}
        `;
    }

    renderErros() {
        if (this.listErrors.length <= 0) {
            return html`
                <div class="ve-ok">
                    <span class="ve-ok-icon">${ICON_OK}</span>
                    <span>
                        <span class="ve-ok-title">${this.cancelled ? this.msg.cancelled : this.msg.noErros}</span>
                        ${this.cancelled ? '' : html`<span class="ve-ok-hint">${this.msg.noErrosHint}</span>`}
                    </span>
                </div>
            `;
        }
        return html`
            ${this.cancelled ? html`<div class="ve-note">${this.msg.cancelled}</div>` : ''}
            <div class="ve-summary">${this.listErrors.length} ${this.msg.errorsFound}</div>
            ${this.renderList(this.listErrors)}
        `;
    }

    renderList(list: string[]) {
        return html`
            <ul class="ve-list">
                ${repeat(list, (k) => k, (k) => this.renderItem(k))}
            </ul>
        `;
    }

    renderItem(i: string) {
        const { file, detail } = this.parseError(i);
        return html`
            <li class="ve-item">
                <span class="ve-item-icon">${ICON_ERR}</span>
                <span class="ve-item-text">
                    <span class="ve-item-file" title="${file}">${file}</span>
                    ${detail ? html`<span class="ve-item-detail">${detail}</span>` : ''}
                </span>
            </li>
        `;
    }

    //"--- Error compiling _102020_pasta/arquivo" (+ detalhes nas linhas seguintes, se houver).
    private parseError(str: string): { file: string, detail: string } {
        const clean = str.replace(/^--- Error compiling\s+/, '');
        const [first, ...rest] = clean.split('\n');
        return { file: first.trim(), detail: rest.join('\n').trim() };
    }

    //------IMPLEMENTS--------
    async prepare() {
        try {

            this.isLoad = true;
            this.continueVerify = true;
            this.cancelled = false;
            this.error = '';
            this.find = [];
            this.current = '0';
            this.tot = '0';

            const prj = mls.actualProject;
            if (!prj) throw new Error('Not found project');

            const url = '/_100554_/l2/collabInit.js';
            const mod  = await import(url);
            //const initCompileMonaco = await import(url);
            await mod.initCompileMonaco(prj);

            const ret = await mls.l2.typescript.compileAll(prj, this.progressCallback.bind(this));

            this.listErrors = ret;
            this.setFilesErros(this.listErrors);
            
            this.cancelled = !this.continueVerify;
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