/// <mls fileReference="_100555_/l2/pluginExplore/pluginExploreListAddL2.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit'; 
import { customElement, property, query, state } from 'lit/decorators.js';
import { convertFileNameToTag } from '/_102027_/l2/utils.js';
import { ServiceBase } from '/_102027_/l2/serviceBase.js';
import { CollabLitElement } from '/_102029_/l2/collabLitElement.js';
import { IDetails } from "/_100555_/l2/pluginNewFile/pluginNewFileBase.js";
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { getState, setState, initState } from '/_102029_/l2/collabState.js';
import { loadPluginProject, isNameValid } from '/_102027_/l2/libCommom.js';
import { getPath } from '/_102027_/l2/utils.js';

/// **collab_i18n_start**
const message_pt = {
    labelProject: "Projeto",
    labelShortName: "Nome",
    invalidName: "Nome invalido",
    labelType: "Modelo",
    btnAdd: "Adicionar",
    please: "Por favor selecione um projeto primeiro!",
    msgInitial: "Por favor, selecione um modelo",
    labelBack: "Voltar",
    placeholderName: "ex.: pasta/meuArquivo",
    noTemplates: "Nenhum modelo disponivel",
    loading: "Carregando modelos...",
}

const message_en = {
    labelProject: "Project",
    labelShortName: "Name",
    invalidName: "Invalid name",
    labelType: "Template",
    btnAdd: "Add",
    please: "Please select a project first!",
    msgInitial: "Please select a template",
    labelBack: "Back",
    placeholderName: "e.g. folder/myFile",
    noTemplates: "No templates available",
    loading: "Loading templates...",
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('plugin-explore--plugin-explore-list-add-l2-100555')
export class ServiceListFilesAdd100555 extends CollabLitElement {

    private baseProject = 100555;

    private msg: MessageType = messages['en'];

    @property() level: number = -1;
    @property() error: string = '';
    @property() position: string = '';
    @property() father?: ServiceBase | undefined;
    @property() plugins: IPlugins[] = [];
    @property({ type: Boolean, }) loading: boolean = true;
    @state() selectedWidget: string = '';
    @propertyDataSource() shortName: string | undefined;
    @query('#iptShortName') inputShortName: HTMLInputElement | undefined;

    async connectedCallback() {
        super.connectedCallback();
        initState('l2.addFile', { shortName: '', project: 0, folder: '' });
        setState('l2.addFile.shortName', '');
        setState('l2.addFile.folder', '');
        await this.init();
    }

    private async init() {
        const plugins = await this.getPlugins();
        this.plugins = await this.getPluginsInfo(plugins);
        this.loading = false;
    }

    firstUpdated(_changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(_changedProperties);
        const options = {
            shortName: '',
            project: '',
            htmlText: `<div>${this.msg.msgInitial}</div>`
        }
        mls.events.fire(2, 'PluginDetails', JSON.stringify(options), 0);
    }



    render() {

        const lang = this.father?.getMessageKey(messages);
        this.msg = lang ? messages[lang] : message_en;
        const project = mls.actualProject || 0;
        setState('l2.addFile.project', project);

        return html`
            ${this.renderHeader()}
            ${project !== undefined ? this.renderAdd(project)
                : html`${this.msg.please}`
            }
        `;
    }

    renderHeader() {
        const project = mls.actualProject || 0;
        return html`
            <div class="add-header">
                <button class="btn-back" title="${this.msg.labelBack}" @click="${() => this.clickCancel()}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
                    <span>${this.msg.labelBack}</span>
                </button>
                <span class="project-chip" title="${this.msg.labelProject}">${project}</span>
            </div>
        `
    }

    renderAdd(project: number) {

        return html`
            <div class="section-add">
                <div class="field">
                    <label for="iptShortName">${this.msg.labelShortName}</label>
                    <input
                        autocomplete="off"
                        spellcheck="false"
                        placeholder="${this.msg.placeholderName}"
                        class="${this.error ? 'invalid' : ''}"
                        value=${this.shortName || ''}
                        type="text"
                        id="iptShortName"
                        @input=${this.handleInputInput}/>
                    ${this.error ? html`<span class="field-error">${this.error}</span>` : ''}
                </div>
                <div class="field">
                    <label>${this.msg.labelType}</label>
                    ${this.renderTemplates()}
                </div>
            </div>
        `
    }


    renderTemplates() {

        if (this.loading) return html`<div class="template-empty">${this.msg.loading}</div>`;
        if (this.plugins.length === 0) return html`<div class="template-empty">${this.msg.noTemplates}</div>`;

        return html`
            <div class="template-list" role="radiogroup" aria-label="${this.msg.labelType}">
                ${this.plugins.map((template) => {
                    const selected = template.widget === this.selectedWidget;
                    return html`
                        <div
                            class="template-item ${selected ? 'selected' : ''}"
                            role="radio"
                            aria-checked="${selected}"
                            tabindex="0"
                            @click=${() => this.handleClickTemplate(template)}
                            @keydown=${(e: KeyboardEvent) => {
                                if (e.key !== 'Enter' && e.key !== ' ') return;
                                e.preventDefault();
                                this.handleClickTemplate(template);
                            }}>
                            <div class="template-item-head">
                                <span class="template-radio"></span>
                                <span class="template-item-title">${template.title}</span>
                            </div>
                            ${selected ? html`
                                <div class="template-item-body">
                                    ${template.description.split('\n').filter((p) => p.trim()).map((paragraph) => html`<p>${paragraph}</p>`)}
                                    ${template.tags.length ? html`
                                        <div class="template-item-tags">
                                            ${template.tags.map((tag) => html`<span class="tag">${tag}</span>`)}
                                        </div>` : ''}
                                </div>` : ''}
                        </div>
                    `
                })}
            </div>
        `

    }

    private goBack() {
        if (!this.father) return;
        (this.father as any).mode = 'list'
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
            this.error = this.msg.invalidName;
            return;
        }

        const info = getPath(`_${project}_${target.value}`);
        if (!info) throw new Error('[] Not found path:' + `_${project}_${target.value}`);
        setState('l2.addFile.folder', info.folder);
        setState('l2.addFile.shortName', info.shortName);
    }

    private handleClickTemplate(plugin: IPlugins) {
        if (this.selectedWidget === plugin.widget) return;
        this.selectedWidget = plugin.widget;
        const info = getPath(plugin.widget);
        if (!info) throw new Error('[] Not found path:' + plugin.widget);

        const { project, shortName, folder } = info;
        const tag = convertFileNameToTag({ project, shortName, folder });
        const options = {
            shortName,
            project,
            folder,
            htmlText: `<${tag} position=${this.position} project="{{ l2.addFile.project }}" shortName="{{ l2.addFile.shortName }}" folder="{{ l2.addFile.folder }}"></${tag}>`
        }
        mls.events.fire(2, 'PluginDetails', JSON.stringify(options), 0);
    }

    //--------------- IMPLEMENTS----------------

    private clickCancel(): void {
        if (!this.father) return;
        const options = {
            shortName: '',
            project: '',
            htmlText: `<div></div>`
        }
        mls.events.fire(2, 'PluginDetails', JSON.stringify(options), 0);
        (this.father as any).mode = 'list';
    }

    private getNewNameAndValid(prj: number, name: string): boolean {
        if (name === '' || !name || name === null) return false;

        if (/\s/.test(name)) return false;
        if (/^\d+$/.test(name)) return false;
        if (/^\d/.test(name)) return false;

        const split = name.split('/');
        return isNameValid(prj, split.pop() || name, split.length > 0 ? split.join('/') : '', +this.level, '.ts');
        /*const isValidName = this.isValidNewName({
            shortName: split.pop() || name,
            project: prj,
            level: +this.level,
            folder: split.length > 0 ? split.join('/') : '',
            extension: '.ts'
        });
        if (!isValidName || this.hasInvalidCharacter(name)) return false;
        return true;*/
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
    
    private async getPlugins(): Promise<mls.plugin.MenuAction[]> {
        let project = mls.actualProject;
        return await loadPluginProject(project || 0, 'l2NewFile');
    }

    private async getPluginsInfo(plugins: mls.plugin.MenuAction[]): Promise<IPlugins[]> {
        const rc: IPlugins[] = [];
        for await (const plugin of plugins) {
            const instance = await import(`/${plugin.widget}`);
            if (!instance.details ||
                typeof instance.details !== 'object' ||
                !['title', 'description', 'tags'].every(prop => prop in instance.details)
            ) continue;

            const details: IDetails = instance.details;
            const item: IPlugins = {
                ...details,
                widget: plugin.widget,
                category: plugin.category,
            }

            rc.push(item);

        }
        return rc;
    }

}

interface IPlugins extends IDetails {
    widget: string,
    category: string | null
}