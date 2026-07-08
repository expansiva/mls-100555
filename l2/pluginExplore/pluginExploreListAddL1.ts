/// <mls fileReference="_100555_/l2/pluginExplore/pluginExploreListAddL1.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ServiceBase } from '/_102027_/l2/serviceBase.js';
import { CollabLitElement } from '/_102029_/l2/collabLitElement.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { isNameValid } from '/_102027_/l2/libCommom.js';
import { createStorFile, IReqCreateStorFile } from '/_102027_/l2/libStor.js';
import { getPath } from '/_102027_/l2/utils.js';

/// **collab_i18n_start**
const message_pt = {
    labelProject: "Projeto",
    labelShortName: "Nome",
    invalidName: "Nome invalido",
    labelType: "Por favor, selecione um modelo abaixo",
    btnAdd: "Adicionar",
    please: "Por facor selecione um projeto primeiro!",
    msgInitial: "Por favor, selecione um modelo",

}

const message_en = {
    labelProject: "Project",
    labelShortName: "Shortname",
    invalidName: "Invalid shortName",
    labelType: "Please select a template below",
    btnAdd: "Add",
    please: "Please select a project first!",
    msgInitial: "Please select a template",

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
        const project = mls.actualProject || 0;

        return html`
            ${this.renderHeader()}
            ${project !== undefined ? this.renderAdd(project)
                : html`${this.msg.please}`
            }
        `;
    }

    renderHeader() {

        return html`
            <div class="headerNav left">
                <h1>Add</h1>
                <button class="btn-nav" title="add organism" @click="${() => this.clickCancel()}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                </button>            
            </div>
        `
    }

    renderAdd(project: number) {

        return html`
            <div class="section-add">
                <div class="row-form">
                    <div>
                        <label>${this.msg.labelProject}:</label>
                        <input type="text" disabled value="${project.toString()}"/>
                    </div>
                    <div>
                        <label>${this.msg.labelShortName}:</label>
                        <input autocomplete="off" value=${this.shortName} type="text" id="iptShortName" @input=${this.handleInputInput}/>
                        <span>${this.error}</span>
                    </div>
                    <div style="display: flex;justify-content: center;align-items: center;padding-top: 19px;">
                        <button class="btn-save" @click=${this.createFile}>Execute</button>
                    </div>
                </div>
            </div>

        `
    }

    private handleInputInput(e: KeyboardEvent) {
        const target = e.target as HTMLInputElement;
        if (!target) return;
        const project = mls.actualProject;
        if (project === undefined) throw new Error('No project selected');
        const name = this.inputShortName?.value || '';
        this.error = '';
        const isValidName = this.getNewNameAndValid(project as number, name);
        if (!isValidName) {
            this.error = this.msg.invalidName
            return;
        }
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


            const project = mls.actualProject;
            if (project === undefined) throw new Error('No project selected');
            const name = this.inputShortName?.value || '';
            this.error = '';
            const isValidName = this.getNewNameAndValid(project as number, name);
            if (!isValidName) {
                this.showError(this.msg.invalidName);
                return;
            }

            const info = getPath(`_${project}_${name}`);
            if (!info) throw new Error('[createFile] Not found path:' + `_${project}_${name}`);

            this.showLoad(true);

            const srcTs = ` /// <mls shortName="${info.shortName}" project="${info.project}" folder="${info.folder}" enhancement="_blank" groupName="${info.folder}" />`;

            const srcDefs = `/// <mls shortName="${info.shortName}" project="${info.project}" folder="${info.folder}" groupName="${info.folder}" enhancement="_blank" />

    // Do not change – automatically generated code.`;

            const param: IReqCreateStorFile = {
                shortName: info.shortName,
                project: mls.actualProject || 0,
                folder: info.folder,
                level: 1,
                source: srcTs.trim(),
                status: 'new',
                extension:'.ts'
            }

            const file = await createStorFile(param, true, true);
            if (file && !(file instanceof Error)) {
                this.setHistory(file);
                this.fireEvents('open', file, {})
            }


            this.showLoad(false);

        } catch (e: any) {

            this.showError('[createFile]' + e.message);
            this.showLoad(false);
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