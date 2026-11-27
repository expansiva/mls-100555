/// <mls fileReference="_100555_/l2/pluginExplore/pluginExploreListAddL1.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ServiceBase } from '/_102027_/l2/serviceBase.js';
import { CollabLitElement } from '/_102029_/l2/collabLitElement.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { isNameValid } from '/_102027_/l2/libCommom.js';
import { createStorFile, IReqCreateStorFile } from '/_102027_/l2/libStor.js';
import { getPath } from '/_102027_/l2/utils.js';

/// **collab_i18n_start**
const message_pt = {
    labelProject: "Projeto",
    labelShortName: "Nome do arquivo",
    invalidName: "Nome invalido ou ja existente",
    btnAdd: "Criar arquivo",
    please: "Por favor selecione um projeto primeiro!",
    labelBack: "Voltar",
    placeholderName: "ex.: pasta/meuArquivo",
    willCreate: "Será criado",
    creating: "Criando...",
    hint: "Arquivo TypeScript em branco no L1. Use / para criar dentro de uma pasta.",
}

const message_en = {
    labelProject: "Project",
    labelShortName: "File name",
    invalidName: "Invalid or existing name",
    btnAdd: "Create file",
    please: "Please select a project first!",
    labelBack: "Back",
    placeholderName: "e.g. folder/myFile",
    willCreate: "Will be created",
    creating: "Creating...",
    hint: "Blank TypeScript file in L1. Use / to create it inside a folder.",
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('plugin-explore--plugin-explore-list-add-l1-100555')
export class ServiceListFilesAdd100555 extends CollabLitElement {

    private baseProject = 100555;

    private msg: MessageType = messages['en'];
    @property() service: ServiceBase | undefined;
    @property() father: HTMLElement | undefined;
    @property() level: number = mls.actualLevel;
    @property() error: string = '';
    @property() position: string = '';
    @property({ type: Boolean, }) loading: boolean = true;
    @state() private nameValue: string = '';
    @state() private creating: boolean = false;
    @propertyDataSource() shortName: string | undefined;
    @query('#iptShortName') inputShortName: HTMLInputElement | undefined;

    async connectedCallback() {
        super.connectedCallback();
        await this.init();
    }

    private async init() {
        this.loading = false;
    }

    render() {

        const lang = this.service?.getMessageKey(messages);
        this.msg = lang ? messages[lang] : message_en;
        const project = mls.actualProject;

        return html`
            ${this.renderHeader(project || 0)}
            ${project ? this.renderAdd(project) : html`<div class="add-empty">${this.msg.please}</div>`}
        `;
    }

    renderHeader(project: number) {
        return html`
            <div class="add-header">
                <button class="btn-back" title="${this.msg.labelBack}" @click="${() => this.clickCancel()}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
                    <span>${this.msg.labelBack}</span>
                </button>
                ${project ? html`<span class="project-chip" title="${this.msg.labelProject}">${project}</span>` : ''}
            </div>
        `
    }

    renderAdd(project: number) {
        const name = this.nameValue.trim();
        const canCreate = !!name && !this.error && !this.creating;
        const filePath = name ? this.getFileReference(project, name) : '';

        return html`
            <div class="section-add">
                <div class="field">
                    <label for="iptShortName">${this.msg.labelShortName}</label>
                    <input
                        autocomplete="off"
                        spellcheck="false"
                        placeholder="${this.msg.placeholderName}"
                        class="${this.error ? 'invalid' : ''}"
                        .value=${this.nameValue}
                        type="text"
                        id="iptShortName"
                        @input=${this.handleInputInput}
                        @keydown=${(e: KeyboardEvent) => { if (e.key === 'Enter' && canCreate) this.createFile(); }}/>
                    ${this.error
                        ? html`<span class="field-error">${this.error}</span>`
                        : html`<span class="field-hint">${this.msg.hint}</span>`}
                </div>

                ${filePath && !this.error ? html`
                    <div class="preview-path">
                        <span class="preview-label">${this.msg.willCreate}</span>
                        <code>${filePath}</code>
                    </div>` : ''}

                <button class="btn-create" ?disabled=${!canCreate} @click=${this.createFile}>
                    ${this.creating ? html`<span class="spinner"></span>${this.msg.creating}` : this.msg.btnAdd}
                </button>
            </div>
        `
    }

    private handleInputInput(e: KeyboardEvent) {
        const target = e.target as HTMLInputElement;
        if (!target) return;
        this.nameValue = target.value;
        const project = mls.actualProject;
        const name = target.value.trim();
        this.error = '';
        if (!project || !name) return;
        if (!this.getNewNameAndValid(project as number, name)) this.error = this.msg.invalidName;
    }

    /** "_<project>_/l1/<folder>/<shortName>.ts" — mesmo formato dos L1 existentes */
    private getFileReference(project: number, name: string): string {
        const split = name.split('/').filter((p) => p);
        const shortName = split.pop() || '';
        const folder = split.join('/');
        return `_${project}_/l1/${folder ? folder + '/' : ''}${shortName}.ts`;
    }

    //--------------- IMPLEMENTS----------------

    private clickCancel(): void {
        if (!this.father) return;
        (this.father as any).mode = 'list';
    }

    private getNewNameAndValid(prj: number, name: string): boolean {
        if (name === '' || !name || name === null) return false;

        if (/\s/.test(name)) return false;
        if (/^\d+$/.test(name)) return false;
        if (/^\d/.test(name)) return false;

        const split = name.split('/');
        return isNameValid(prj, split.pop() || name, split.length > 0 ? split.join('/') : '', +this.level, '.ts');
    }

    private showLoad(active: boolean) {

        setTimeout(() => {
            if (!this.service) return;
            this.service.loading = active
        }, 500);
    }

    private async createFile() {

        try {


            if (this.creating) return;
            const project = mls.actualProject;
            if (!project) throw new Error('No project selected');
            const name = this.nameValue.trim();
            this.error = '';
            const isValidName = this.getNewNameAndValid(project as number, name);
            if (!isValidName) {
                this.error = this.msg.invalidName;
                return;
            }

            const info = getPath(`_${project}_${name}`);
            if (!info) throw new Error('[createFile] Not found path:' + `_${project}_${name}`);

            this.showLoad(true);
            this.creating = true;

            const srcTs = `/// <mls fileReference="_${info.project}_/l1/${info.folder ? info.folder + '/' : ''}${info.shortName}.ts" enhancement="_blank"/>\n\nexport {};\n`;

            const param: IReqCreateStorFile = {
                shortName: info.shortName,
                project: mls.actualProject || 0,
                folder: info.folder,
                level: 1,
                source: srcTs,
                status: 'new',
                extension:'.ts'
            }

            const file = await createStorFile(param, true, true);
            if (file && !(file instanceof Error)) {
                this.setHistory(file);
                this.fireEvents('open', file, {})
            }


            this.showLoad(false);
            this.creating = false;

        } catch (e: any) {

            this.showError('[createFile]' + e.message);
            this.showLoad(false);
            this.creating = false;
        }

    }

    private setHistory(file: mls.stor.IFileInfo): void {

        const info = localStorage.getItem('mlsInfoHistoryL' + mls.actualLevel);
        const res: any[] = info ? JSON.parse(info) : [];
        let idx = -1;
        res.forEach((i: any, index) => {
            if (i.project !== file.project || i.shortName !== file.shortName || i.folder !== file.folder) return;
            idx = index;
        });

        if (idx >= 0) {
            res.splice(idx, 1);
        }

        res.unshift({ project: file.project, shortName: file.shortName, extension: file.extension, folder: file.folder });

        if (res.length > 10) {
            for (let i = res.length - 1; i >= 0; i--) {
                if (res.length <= 10) break;
                res.splice(i, 1);
            }
        }

        localStorage.setItem('mlsInfoHistoryL' + mls.actualLevel, JSON.stringify(res));

    }

    private showError(msg: string) {
        if (!this.service) return;
        this.service.setError(msg);
    }

    private async fireEvents(action: string, file: mls.stor.IFileInfo, info: any, timeout: number = 0): Promise<void> {

        try {

            const params = {} as mls.events.IFileAction;

            (params.action as any) = action;
            params.level = file.level;
            params.project = file.project;
            params.shortName = file.shortName;
            params.extension = file.extension;
            params.folder = file.folder;
            params.position = this.position as ('right' | 'left');

            if (info && info.shortName) {
                params.newshortName = info.shortName;
                params.newProject = info.project;
                params.newfolder = file.folder;
            }

            if (['open'].includes(action)) {

                const lv = mls.actualLevel;
                let name = `_${file.project}_${file.shortName}`;
                if (file.folder) name = `_${file.project}_${file.folder}/${file.shortName}`;
                mls.actual[lv as any].setFullName(name);
                mls.actual[lv as any][this.position as ('right' | 'left')] = file

            }

            mls.events.fire([mls.actualLevel], ['FileAction'], JSON.stringify(params), timeout);


        } catch (err: any) {

            this.showError('false');
            this.showError(err.message || '[fireEvents]: erro open');
        }


    }

}