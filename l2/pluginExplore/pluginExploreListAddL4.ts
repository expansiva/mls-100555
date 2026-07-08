/// <mls fileReference="_100555_/l2/pluginExplore/pluginExploreListAddL4.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, state, property, query } from 'lit/decorators.js';
import { createAllFiles, IReqCreateAllFiles } from '/_102027_/l2/libStor.js';
import { getTemplateImport } from '/_100554_/l2/pluginNewFileBase.js';
import { convertFileNameToTag } from '/_102027_/l2/utils.js';
import { getInstanceByFile, isNameValid } from '/_102027_/l2/libCommom.js';
//import { executeAgentByFile } from '/_100554_/l2/aiAgentHelper.js'
import { collabImport } from '/_102027_/l2/collabImport.js'
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
import { ServiceBase } from '/_102027_/l2/serviceBase.js';


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

@customElement('plugin-explore--plugin-explore-list-add-l4-100555')
export class PluginExploreListAddL4 extends PluginBaseModule {


    //--------VARIABLES--------------

    @state() modules: string[] = [];
    @property() father: HTMLElement | undefined;
    @property() service: ServiceBase | undefined;
    @property({ type: Boolean }) autoPrepare: boolean = false;


    @query('#iptModule') iptModule: HTMLSelectElement | undefined;
    @query('#iptPage') iptPage: HTMLInputElement | undefined;
    @query('#iptPrompt') iptPrompt: HTMLInputElement | undefined;


    //------COMPONENTS--------------

    firstUpdated() {
        if (!this.autoPrepare) return;
        this.prepare();

    }

    render() {
        let btn = html`
            <button class="btn-nav" title="add organism" @click="${() => this.goBack()}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
            </button>
        `;

        return html`
            ${this.renderHeader('Add', btn, 'left')}
        
            <div class="form-container">

                <div class="form-group">
                    <label for="project">Project</label>
                    <input type="text" disabled .value="${mls.actualProject}"/>
                </div>

                <div class="form-group">
                    <label for="module">Module</label>
                    <select id="iptModule">
                        ${this.modules.map((m) => html`<option value="${m}">${m}</option>`)
            }
                            
                    </select>
                </div>

                <div class="form-group">
                <label for="organism">Page</label>
                <input type="text" autocomplete="off" id="iptPage" placeholder="pageXxx">
                </div>

                <div class="form-group">
                <label for="prompt">Prompt</label>
                <textarea id="iptPrompt" placeholder="Write your prompt..."></textarea>
                </div>

                <button class="btn-save" @click=${this.createFile}>Execute</button>
            </div>
        `
    }

    renderHeader(txt: string, btn: TemplateResult<1>, pos: string) {

        return html`
            <div class="headerNav ${pos}">
                <h1>${txt}</h1>
                ${btn}               
            </div>
        `
    }


    //------IMPLEMENTS-------------

    private async prepare() {
        this.init();
    }

    private async init() {
        const key = mls.stor.getKeyToFiles(mls.actualProject as number, 2, 'project', '', '.ts');
        const file = mls.stor.files[key];
        if (!file) return;

        //const m: any | undefined = await getInstanceByFile(file);
        const m: any | undefined = await collabImport({ project: file.project, folder: file.folder, shortName: file.shortName, extension: file.extension as any });

        if (!m || !m.projectConfig || !m.projectConfig.modules) return;

        const md: string[] = [];
        m.projectConfig.modules.forEach((i: any) => md.push(i.name));

        this.modules = md;
        setTimeout(() => {
            const sel = this.querySelector('#iptModule') as HTMLSelectElement;
            if (sel && mls.actualModule) sel.value = mls.actualModule;
        }, 100);

    }

    private goBack() {
        if (!this.father) return;
        (this.father as any).mode = 'list'
    }

    private verifyModuleConfig() {
        if (!this.iptModule || !this.iptModule.value) {
            throw new Error('Not found module');
        }

        const key = mls.stor.getKeyToFiles(mls.actualProject || 0, 2, 'module', this.iptModule.value, '.ts');

        if (!mls.stor.files[key]) throw new Error('Not found file module');
    }

    private async createFile() {

        try {

            this.showLoad(true);

            if (!this.iptModule || !this.iptPage || !this.iptPage.value || !this.iptPrompt || !this.iptPrompt.value || !this.iptModule.value) {
                throw new Error('Enter the name of the page, module and prompt');
            }

            this.verifyModuleConfig();

            const project = mls.actualProject || 0;
            const folder = this.iptModule.value || '';
            const name = this.iptPage.value;

            if (!this.getNewNameAndValid(project, name, folder)) {
                throw new Error('Invalid Name');
            }

            const tag = convertFileNameToTag({ folder, project, shortName: name });

            const srcTs = ` /// <mls shortName="${name}" project="${project}" folder="${folder}" enhancement="_100554_enhancementLit" groupName="${folder}" />

import { customElement } from 'lit/decorators.js';
import { CollabPageElement } from '${getTemplateImport(100554, 'collabPageElement', '')}';
import { globalState, initState, setState } from '${getTemplateImport(100554, 'collabState', '')}';

@customElement('${tag}')
export class ${name} extends CollabPageElement {

    initPage() {

    }

}`;

            const srcDefs = `/// <mls shortName="${name}" project="${project}" folder="${folder}" groupName="${folder}" enhancement="_blank" />

// Do not change – automatically generated code.

export const defs: mls.l4.BaseDefs = {
    "meta": {
        "projectId": ${project},
        "folder": "${folder}",
        "shortName": "${name}",
        "type": "page",
        "devFidelity": "scaffold",
        "group": "${folder}",
        "tags": [
        "lit",
        "page"
        ]
    },
    "references": {
        "widgets": [],
        "plugins": [],
        "statesRO": [],
        "statesRW": [],
        "statesWO": [],
        "imports": []
    },
    "planning": {
        "generalDescription": "",
        "goal": "",
        "userStories": [],
        "userRequestsEnhancements": [],
        "constraints": []
    }
}
`;

            const param: IReqCreateAllFiles = {
                shortName: this.iptPage.value,
                project: mls.actualProject || 0,
                folder: this.iptModule.value,
                enhancement: '_blank',
                level: 2,
                defsSource: srcDefs.trim(),
                tsSource: srcTs.trim(),
            }

            const files = await createAllFiles(param, true, true);
            if (files.ts && !(files.ts instanceof Error)) {
                this.setHistory(files.ts);
                const prompt = JSON.stringify({
                    project: project.toString(),
                    shortName: name,
                    folder,
                    userPrompt: this.iptPrompt.value

                })
                //await executeAgentByFile('agentCreateNewPrototypePage', prompt, files.ts, true);
            }

            this.showLoad(false);
            this.goBack();

        } catch (e: any) {

            this.showError('[createFile]' + e.message);
            this.showLoad(false);
        }

    }

    private async fireImprove(file: mls.stor.IFileInfo, prompt: string) {


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

    private getNewNameAndValid(prj: number, name: string, folder: string): boolean {
        if (name === '' || !name || name === null) return false;
        return isNameValid(prj, name, folder, 2, '.ts');
    }

    private hasInvalidCharacter(name: string) {
        const invalidCharacters = /[_\{}\[\]\*$@#=\-+!|?,<>=.;^~º°""''``áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/;
        if (invalidCharacters.test(name) || name.indexOf("\\") >= 0) return true;
        return false
    }

    private isValidNewName(obj: { shortName: string, project: number, level: number, extension: string, folder: string }): boolean {

        if (obj.shortName === '') return false;
        if (obj.shortName.length === 0 || obj.shortName.length > 255) return false;
        const invalidCharacters = /[_\/{}\[\]\*$@#=\-+!|?,<>=.;^~º°""''``áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/;
        if (invalidCharacters.test(obj.shortName)) return false;

        const key = mls.stor.getKeyToFiles(obj.project, obj.level, obj.shortName, obj.folder, obj.extension);
        let find = false;
        const keys = Object.keys(mls.stor.files);
        for (const k of keys) {
            if (key.toLocaleLowerCase() === k.toLocaleLowerCase()) find = true;
        }
        return !mls.stor.files[key] && !find;

    }

    private showLoad(active: boolean) {
        setTimeout(() => {
            if (!this.service) return;
            this.service.loading = active
        }, 500);
    }

    private showError(msg: string) {
        if (!this.service) return;
        this.service.setError(msg);
    }

}