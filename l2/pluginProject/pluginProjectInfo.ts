/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectInfo.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, css, svg, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, query, property, state } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';

import { renameProjectInHistory } from '/_102027_/l2/libHistoriesRecents.js';

import { collab_trash, collab_lock, collab_lock_open, collab_arrow_up_long, collab_arrow_down_long, collab_pencil } from '/_100555_/l2/utils/collabIcons.js';

/// **collab_i18n_start**
const message_pt = {
    detailsResume: 'Resumo',
    designSystems: 'Design systems',
    lastModified: 'Última modificação',
    fork: 'Galhos',
    deps: 'Dependências',
    files: 'Arquivos',
    detailsInfo: 'Info',
    name: 'Nome',
    projectDriver: 'Driver',
    projectOrg: 'Organização',
    projectOwner: 'Proprietário',
    projectCreatedAt: 'Criado em',
    projectURL: 'URL do Projeto',
    projectDescription: 'Descrição',
    save: 'Salvar',
    cancel: 'Cancelar',
    edit: 'Editar',
    successSavingDeps: 'Dependências atualizadas',
    successSavingInfo: 'Informações atualizadas',
    errorDepNull: "Informe o ID da dependência.",
    errorDepSame: "Não é permitido adicionar o próprio projeto como dependência.",
    errorDepAlreadyAdded: "Esta dependência já foi adicionada.",
    errorDepInvalid: "Este projeto não existe.",
    btnAddDep: "Adicionar",
    btnOpenDep: "Adicionar nova dependência",
    placeholderDep: "ID da dependência",
    noDeps: "Nenhuma dependência configurada."
}

const message_en = {
    designSystems: 'Design systems',
    lastModified: 'Last Modified',
    detailsResume: 'Resume',
    fork: 'Forks',
    deps: 'Dependencies',
    files: 'Files',
    detailsInfo: 'Info',
    name: 'Name',
    projectDriver: 'Project Driver',
    projectOrg: 'Organization',
    projectOwner: 'Owner',
    projectCreatedAt: 'CreatedAt',
    projectURL: 'Project URL',
    projectDescription: 'Description',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    successSavingDeps: 'Dependencies updated',
    successSavingInfo: 'Information updated',
    errorDepNull: "Please enter the dependency ID.",
    errorDepSame: "You cannot add the project itself as a dependency.",
    errorDepAlreadyAdded: "This dependency has already been added.",
    errorDepInvalid: "This project does not exist.",
    btnAddDep: "Add",
    btnOpenDep: "Add new dependency",
    placeholderDep: "Dependency ID",
    noDeps: "No dependencies configured."

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const pluginData: mls.plugin.IPluginData = {
    title: "Project Settings",
    getSvg(): TemplateResult {
        return svg`
     <svg height="22px" width="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
    `;
    }
};

@customElement('plugin-project--plugin-project-info-100555')
export class PluginProjectInfo extends PluginBaseModule {

    private msg: MessageType = messages['en'];

    @property({ type: Boolean }) autoPrepare: boolean = false;
    @property() project: number | undefined;
    @property() projectName: string | undefined;
    @property() projectDriver: "local" | "mls" | "GitHub" | "GitLab" = "GitHub";
    @property() projectOrg: string | undefined;
    @property() projectOwner: string | undefined;
    @property() projectCreatedAt: string | undefined;
    @property() projectURL: string | undefined;
    @property() projectDescription: string | undefined;
    @property() forks: mls.stor.others.IFork[] | undefined;
    @property() branches: mls.stor.others.IBranch[] | undefined;
    @state() deps: IDependenciesInfo[] = [];
    @property() isSavingDeps: boolean = false;
    @property() labelOk: string = '';
    @property() labelError: string = '';
    @property() labelErrorDeps: string = '';
    @property() isAddingDep = false;
    @property() newDepId: number | null = null;

    @state() isEditingDeps: boolean = false;
    @state() originalDeps: IDependenciesInfo[] = [];

    @state() isEditingInfo: boolean = false;
    @state() isSavingInfo: boolean = false;
    @state() labelOkInfo: string = '';
    @state() labelErrorInfo: string = '';
    @state() editName: string = '';
    @state() editProjectURL: string = '';
    @state() editProjectDriver: string = '';
    @state() editProjectDescription: string = '';


    @query('.plugin-body') body: HTMLDivElement | undefined;
    private projectDetails: mls.cbe.IPrj_settings | undefined;
    private projectSettings: mls.cbe.IProjectInfo & { description: string } | undefined;

    async prepare() {
        await this.init();
    }

    //------COMPONENT------

    firstUpdated() {
        if (!this.body || !this.autoPrepare) return;
        this.prepare();
    }

    render(): TemplateResult {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        this.style.display = 'block';

        if (this.scope !== "dashboard") return html``;
        return html`
            <div class="plugin-container">
                ${this.renderBody()}
            </div>
        `;
    }

    renderBody(): TemplateResult {
        return html`<div class="plugin-body">
            ${this.renderInfo()}
            ${this.renderDependencies()}

        </div>`;
    }

    renderInfo(): TemplateResult {
        return html`
            <div class="details-card">
                ${!this.isEditingInfo ? html`
                    <span class="edit-icon" @click=${this.startEditingInfo} title="${this.msg.edit}">
                        ${collab_pencil}
                    </span>
                ` : ''}
                <details open>
                    <summary>${this.msg.detailsInfo}</summary>
                    <div>
                        ${this.isEditingInfo ? this.renderInfoEditMode() : this.renderInfoViewMode()}
                    </div>
                </details>
            </div>
        `
    }

    renderInfoViewMode(): TemplateResult {
        return html`
            <ul class="listInfo">
                <li>
                    <b>${this.msg.name}:</b> 
                    ${this.projectName}
                </li>
                <li>
                    <b>${this.msg.projectOrg}:</b> 
                    ${this.projectOrg}
                </li>
                <li>
                    <b>${this.msg.projectOwner}:</b> 
                    ${this.projectOwner}
                </li>
                <li>
                    <b>${this.msg.projectCreatedAt}:</b> 
                    ${this.projectCreatedAt}
                </li>
                <li style="display:flex">
                    <b>${this.msg.projectDriver}:</b> 
                    ${this.projectDriver}
                </li>
                <li>
                    <b>${this.msg.projectURL}:</b>
                    ${this.projectURL}
                </li>
                <li>
                    <b>${this.msg.projectDescription}:</b>
                    ${this.projectDescription || '-'}
                </li>
            </ul>
        `;
    }

    renderInfoEditMode(): TemplateResult {
        return html`
            <div class="info-edit-form">
                <div class="form-group">
                    <label>${this.msg.name}</label>
                    <input 
                        type="text" 
                        .value=${this.editName}
                        @input=${(e: any) => this.editName = e.target.value}
                        placeholder="Nome do projeto"
                    />
                </div>

                <div class="form-group">
                    <label>${this.msg.projectURL}</label>
                    <input 
                        type="text" 
                        .value=${this.editProjectURL}
                        @input=${(e: any) => this.editProjectURL = e.target.value}
                        placeholder="https://exemplo.com"
                    />
                </div>

                <div class="form-group">
                    <label>${this.msg.projectDriver}</label>
                    <select 
                        .value=${this.editProjectDriver}
                        @change=${(e: any) => this.editProjectDriver = e.target.value}
                    >
                        <option value="local">local</option>
                        <option value="mls">mls</option>
                        <option value="GitHub">GitHub</option>
                        <option value="GitLab">GitLab</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>${this.msg.projectDescription}</label>
                    <textarea 
                        rows="4"
                        .value=${this.editProjectDescription}
                        @input=${(e: any) => this.editProjectDescription = e.target.value}
                        placeholder="Descrição do projeto..."
                    ></textarea>
                </div>

                <hr class="form-divider" />

                <div class="form-group disabled-field">
                    <label>${this.msg.projectOrg}</label>
                    <input type="text" .value=${this.projectOrg || ''} disabled />
                </div>

                <div class="form-group disabled-field">
                    <label>${this.msg.projectOwner}</label>
                    <input type="text" .value=${this.projectOwner || ''} disabled />
                </div>

                <div class="form-group disabled-field">
                    <label>${this.msg.projectCreatedAt}</label>
                    <input type="text" .value=${this.projectCreatedAt || ''} disabled />
                </div>

                <div class="info-edit-actions">
                    <button class="btn-secondary" @click=${this.cancelEditingInfo}>
                        ${this.msg.cancel}
                    </button>
                    <button 
                        ?disabled=${this.isSavingInfo}
                        @click=${this.handleSaveInfo}
                    >
                        ${this.isSavingInfo ? html`<span class="loader"></span>` : this.msg.save}
                    </button>
                </div>

                ${this.labelOkInfo ? html`<small class="saving-ok">${this.labelOkInfo}</small>` : ''}
                ${this.labelErrorInfo ? html`<small class="saving-error">${this.labelErrorInfo}</small>` : ''}
            </div>
        `;
    }

    renderDependencies(): TemplateResult {
        return html`
            <div class="details-card">
                ${!this.isEditingDeps ? html`
                    <span class="edit-icon" @click=${this.startEditingDeps} title="${this.msg.edit}">
                        ${collab_pencil}
                    </span>
                ` : ''}
                <details open>
                    <summary>${this.msg.deps}</summary>
                    <div>
                        ${this.isEditingDeps ? this.renderDepsEditMode() : this.renderDepsViewMode()}
                    </div>
                </details>
            </div>
        `;
    }

    renderDepsViewMode(): TemplateResult {
        if (this.deps.length === 0) {
            return html`<p class="no-deps">${this.msg.noDeps}</p>`;
        }

        return html`
            <ul class="deps-details-list view-mode">
                ${this.deps.map((dep) => html`
                    <li>
                        <span>${dep.name} (${dep.id})</span>
                        <div class="deps-details-tags">
                            <span>
                                <i>${dep.auth === 'public' ? collab_lock_open : collab_lock}</i>
                                <span>${dep.auth}</span>
                            </span>
                        </div>
                    </li>
                `)}
            </ul>
        `;
    }

    renderDepsEditMode(): TemplateResult {
        return html`
            <ul class="deps-details-list">
                ${this.deps.map((dep, index) => html`
                    <li>
                        <span>${dep.name} (${dep.id})</span>
                        <div class="deps-details-tags">
                            <span>
                                <i>${dep.auth === 'public' ? collab_lock_open : collab_lock}</i>
                                <span>${dep.auth}</span>
                            </span>
                        </div>
                        <div class="deps-details-actions">
                            <span @click=${() => this.moveDepUp(index)}>${collab_arrow_up_long}</span>
                            <span @click=${() => this.moveDepDown(index)}>${collab_arrow_down_long}</span>
                            <span @click=${() => {
                this.deps.splice(index, 1);
                this.requestUpdate();
            }}>
                                ${collab_trash}
                            </span>
                        </div>
                    </li>
                `)}
        
                <li class="li-add" @click=${this.toggleAddDep}>
                    <span>${this.msg.btnOpenDep}</span>
                </li>
            </ul>

            <div class="add-dep-wrapper ${this.isAddingDep ? 'open' : ''}">
                <div class="add-dep-content">
                    <input
                        type="number"
                        placeholder=${this.msg.placeholderDep}
                        .value=${this.newDepId ?? ''}
                        @input=${(e: any) => this.newDepId = Number(e.target.value)}
                    />
                    <button @click=${this.addDependency}>
                        ${this.msg.btnAddDep}
                    </button>
                </div>
                ${this.labelErrorDeps ? html`<small class="saving-error">${this.labelErrorDeps}</small>` : ''}      
            </div>

            <div class="info-edit-actions">
                <button class="btn-secondary" @click=${this.cancelEditingDeps}>
                    ${this.msg.cancel}
                </button>
                <button
                    ?disabled=${this.isSavingDeps}
                    @click=${this.handleSaveDeps}
                >
                    ${this.isSavingDeps ? html`<span class="loader"></span>` : this.msg.save}
                </button>
            </div>

            ${this.labelOk ? html`<small class="saving-ok">${this.labelOk}</small>` : ''}
            ${this.labelError ? html`<small class="saving-error">${this.labelError}</small>` : ''}      
        `;
    }


    //-------IMPLEMENTS-----------

    private startEditingDeps() {
        this.originalDeps = JSON.parse(JSON.stringify(this.deps));
        this.isEditingDeps = true;
        this.isAddingDep = false;
        this.labelOk = '';
        this.labelError = '';
        this.labelErrorDeps = '';
    }

    private cancelEditingDeps() {
        this.deps = JSON.parse(JSON.stringify(this.originalDeps));
        this.isEditingDeps = false;
        this.isAddingDep = false;
        this.labelOk = '';
        this.labelError = '';
        this.labelErrorDeps = '';
    }

    private startEditingInfo() {
        this.editName = this.projectName || '';
        this.editProjectURL = this.projectURL || '';
        this.editProjectDriver = this.projectDriver || '';
        this.editProjectDescription = this.projectDescription || '';
        this.isEditingInfo = true;
        this.labelOkInfo = '';
        this.labelErrorInfo = '';
    }

    private cancelEditingInfo() {
        this.isEditingInfo = false;
        this.labelOkInfo = '';
        this.labelErrorInfo = '';
    }

    private async handleSaveInfo() {
        this.labelErrorInfo = '';
        this.labelOkInfo = '';
        this.isSavingInfo = true;

        try {
            await this.saveInfo();
            this.isSavingInfo = false;
            this.labelOkInfo = this.msg.successSavingInfo;

            this.projectName = this.editName;
            this.projectURL = this.editProjectURL;
            this.projectDriver = this.editProjectDriver as "local" | "mls" | "GitHub" | "GitLab";
            this.projectDescription = this.editProjectDescription;

            setTimeout(() => {
                this.isEditingInfo = false;
                this.labelOkInfo = '';
            }, 1500);

        } catch (error: any) {
            console.error('Error on update info:', error);
            this.labelErrorInfo = error.message;
            this.isSavingInfo = false;
        }
    }

    private async saveInfo() {
        if (!this.project) throw new Error(`Project not found`);
        if (!this.projectDetails) throw new Error(`Project details ${this.project} not found`);

        this.projectDetails.name = this.editName;

        if (this.projectSettings) {
            this.projectSettings.projectURL = this.editProjectURL;
            this.projectSettings.projectDriver = this.editProjectDriver as "local" | "mls" | "GitHub" | "GitLab";
            this.projectSettings.description = this.editProjectDescription;
            this.projectDetails.value = JSON.stringify(this.projectSettings);
        }

        await mls.api.cbeSavePrjSettings(this.project);
        renameProjectInHistory(this.project, this.projectDetails.name);

    }

    private moveDepUp(index: number) {
        if (index === 0) return;
        const deps = [...this.deps];
        [deps[index - 1], deps[index]] = [deps[index], deps[index - 1]];
        this.deps = deps;
    }

    private moveDepDown(index: number) {
        if (index === this.deps.length - 1) return;
        const deps = [...this.deps];
        [deps[index], deps[index + 1]] = [deps[index + 1], deps[index]];
        this.deps = deps;
    }

    toggleAddDep() {
        this.isAddingDep = !this.isAddingDep;
        if (this.isAddingDep) {
            this.newDepId = null;
            this.labelErrorDeps = '';
        }
    }

    private addDependency() {
        if (this.newDepId === null) {
            this.labelErrorDeps = this.msg.errorDepNull;
            return;
        }

        if (this.newDepId === this.project) {
            this.labelErrorDeps = this.msg.errorDepSame;
            return;
        }

        const exists = this.deps.some(dep => dep.id === this.newDepId);
        if (exists) {
            this.labelErrorDeps = this.msg.errorDepAlreadyAdded;
            return;
        }

        const depDetails = mls.l5.getProjectDetails(this.newDepId);

        if (!depDetails) {
            this.labelErrorDeps = this.msg.errorDepInvalid;
            return;
        }

        this.deps = [
            ...this.deps,
            {
                id: this.newDepId,
                name: depDetails.name,
                auth: depDetails.userAuth
            }
        ];

        this.newDepId = null;
        this.isAddingDep = false;
        this.labelErrorDeps = '';
    }

    private async handleSaveDeps() {
        this.labelError = '';
        this.labelOk = '';
        this.isSavingDeps = true;
        try {
            await this.saveDeps();
            this.isSavingDeps = false;
            this.labelOk = `${this.msg.successSavingDeps}`;

            setTimeout(() => {
                this.isEditingDeps = false;
                this.isAddingDep = false;
                this.labelOk = '';
            }, 1500);

        } catch (error: any) {
            console.error('Error on update perfil:', error);
            this.labelError = error.message;
            this.isSavingDeps = false;
        }

    }

    private async saveDeps() {
        if (!this.project) throw new Error(`Project not found`);
        if (!this.projectDetails) throw new Error(`Project details ${this.project} not found`);
        this.projectDetails.prj_dependencies = this.deps.map((item) => item.id);
        await this.updateFilesDeps(this.projectDetails.prj_dependencies);
        mls.api.cbeSavePrjSettings(this.project);
    }

    private async updateFilesDeps(deps: number[]) {
        try {
            if (!mls.actualProject) return;
            const sett = mls.l5.getProjectSettings(mls.actualProject || 0);

            const stPck = this.getStor({ project: mls.actualProject, level: 0, folder: '', shortName: 'package', extension: '.json' });
            const stPckLib = this.getStor({ project: mls.actualProject, level: 0, folder: '', shortName: 'packagelib', extension: '.json' });
            const stTs = this.getStor({ project: mls.actualProject, level: 0, folder: '', shortName: 'tsconfig', extension: '.json' });
            const stTsLib = this.getStor({ project: mls.actualProject, level: 0, folder: '', shortName: 'tsconfiglib', extension: '.json' });
            const stConfig = this.getStor({ project: mls.actualProject, level: 0, folder: '', shortName: 'config', extension: '.json' });

            if (stPck) await this.updateFilePck(stPck, deps, sett);
            if (stPckLib) await this.updateFilePck(stPckLib, deps, sett);
            if (stTs) await this.updateFileTsConfig(stTs, deps);
            if (stTsLib) await this.updateFileTsConfig(stTsLib, deps);
            if (stConfig) await this.updateFileConfig(stConfig, deps, sett);


        } catch (e: any) {
            console.info(e.message)
        }

    }

    private getStor(info: mls.stor.IFileInfoBase): mls.stor.IFileInfo | undefined {
        const key = mls.stor.getKeyToFile(info);
        return mls.stor.files[key];
    }

    private async updateFilePck(st: mls.stor.IFileInfo, deps: number[], sett: mls.cbe.IProjectInfo | undefined) {

        try {

            if (!sett?.projectURL) return;

            const content = await st.getContent() as string;
            const pkg = JSON.parse(content);

            pkg.dependencies ??= {};

            const dependencies = pkg.dependencies as Record<string, string>;
            const devDependencies = pkg.devDependencies as Record<string, string>;

            const repoBase = sett.projectURL
                .replace(/\/(main|master)\//, "/")
                .replace(/\/?mls-\d+\/?$/, "/");

            const desired = new Set(deps.map(d => `mls-${d}`));

            let changed = false;

            // Remove dependências MLS que não deveriam existir
            for (const obj of [dependencies]) {
                if (!obj) continue;
                for (const key of Object.keys(obj)) {
                    if (key.startsWith("mls-") && !desired.has(key)) {
                        delete obj[key];
                        changed = true;
                    }
                }
            }

            // Adiciona as dependências que faltam
            for (const key of desired) {

                const exists = key in dependencies

                if (!exists) {
                    dependencies[key] = `git+${repoBase}${key}.git`;
                    changed = true;
                }
            }

            if (changed) {
                const fileInfo: mls.stor.IFileInfoValue = {
                    content: JSON.stringify(pkg, null, 2),
                    contentType: 'string'
                };

                await mls.stor.localStor.setContent(st, fileInfo);
                st.status = 'changed';
                st.inLocalStorage = true;
            }

        } catch (e: any) {
            console.info(`Erro [updateFilePck] file: _${st.project}_/${st.folder ? st.folder + '/' : ''}${st.shortName}${st.extension} | ${e.message || 'Error'}`);
        }



    }

    private async updateFileTsConfig(st: mls.stor.IFileInfo, deps: number[]) {
        try {

            const content = await st.getContent() as string;
            const cfg = JSON.parse(content);

            cfg.compilerOptions ??= {};
            cfg.compilerOptions.paths ??= {};

            const paths = cfg.compilerOptions.paths as Record<string, string[]>;

            const desired = new Set(deps.map(d => `/_${d}_/*`));
            const currentProjectPath = `/_${mls.actualProject}_/*`;

            let changed = false;

            // Remove apenas os paths das dependências MLS
            for (const key of Object.keys(paths)) {
                if (!/^\/_\d+_\/\*$/.test(key))
                    continue;

                // Nunca remove o path do projeto atual
                if (key === currentProjectPath)
                    continue;

                if (!desired.has(key)) {
                    delete paths[key];
                    changed = true;
                }
            }

            // Adiciona os paths que estão faltando
            for (const dep of deps) {
                const key = `/_${dep}_/*`;

                if (!(key in paths)) {
                    paths[key] = [`./project/mls-${dep}/*`];
                    changed = true;
                }
            }

            if (changed) {
                const fileInfo: mls.stor.IFileInfoValue = {
                    content: JSON.stringify(cfg, null, 2),
                    contentType: 'string'
                };

                await mls.stor.localStor.setContent(st, fileInfo);
                st.status = 'changed';
                st.inLocalStorage = true;
            }

        } catch (e: any) {
            console.info(`Erro [updateFileTsConfig] file: _${st.project}_/${st.folder ? st.folder + '/' : ''}${st.shortName}${st.extension} | ${e.message || 'Error'}`);
        }

    }

    private async updateFileConfig(
        st: mls.stor.IFileInfo,
        deps: number[],
        sett: mls.cbe.IProjectInfo | undefined
    ) {
        try {

            if (!sett?.projectURL) return;

            const content = await st.getContent() as string;
            const cfg = JSON.parse(content);

            cfg.workspaceDependencies ??= {};

            const workspaceDependencies = cfg.workspaceDependencies as Record<
                string,
                { repo: string; commit: string }
            >;

            const repoBase = sett.projectURL
                .replace(/\/(main|master)\//, "/")
                .replace(/\/?mls-\d+\/?$/, "/");

            const desired = new Set(deps.map(String));

            let changed = false;

            // Remove dependências que não deveriam existir
            for (const key of Object.keys(workspaceDependencies)) {
                if (!desired.has(key)) {
                    delete workspaceDependencies[key];
                    changed = true;
                }
            }

            // Adiciona as que estão faltando
            for (const dep of deps) {
                const key = dep.toString();

                if (!(key in workspaceDependencies)) {
                    workspaceDependencies[key] = {
                        repo: `${repoBase}mls-${dep}.git`,
                        commit: ""
                    };
                    changed = true;
                }
            }

            if (changed) {
                const fileInfo: mls.stor.IFileInfoValue = {
                    content: JSON.stringify(cfg, null, 2),
                    contentType: 'string'
                };

                await mls.stor.localStor.setContent(st, fileInfo);
                st.status = 'changed';
                st.inLocalStorage = true;
            }

        } catch (e: any) {
            console.info(`Erro [updateFileConfig] file: _${st.project}_/${st.folder ? st.folder + '/' : ''}${st.shortName}${st.extension} | ${e.message || 'Error'}`);
        }

    }

    private async init() {

        try {

            const project = this.project ? +this.project : mls.actualProject;
            if (!project) return;
            this.setInfos(project);
            this.deps = this.getDependencies();

        } catch (err: any) {
            console.info(err);
        }

    }

    private getDependencies(): IDependenciesInfo[] {

        const project = this.project ? +this.project : mls.actualProject;
        let deps: number[] = [];
        if (project) deps = mls.l5.getProjectDependencies(project, false);
        const allDependencies: IDependenciesInfo[] = [];

        deps.forEach((id: number) => {
            const depPrjDetails = mls.l5.getProjectDetails(id);
            const objDep: IDependenciesInfo = {} as IDependenciesInfo;

            if (depPrjDetails) {
                objDep.name = depPrjDetails.name;
                objDep.id = depPrjDetails.id;
                objDep.auth = depPrjDetails.userAuth;
            } else {
                objDep.name = `Unknown - Project don't exists or deleted`
                objDep.id = id;
                objDep.auth = '';
                objDep.unknown = true;
            }

            allDependencies.push(objDep);

        });

        return allDependencies;

    }

    private setInfos(project: number) {

        this.project = project;
        this.projectSettings = mls.l5.getProjectSettings(project) as any;
        this.projectDetails = mls.l5.getProjectDetails(project);

        if (!this.projectDetails || !this.projectSettings) return;
        this.projectName = this.projectDetails.name;
        this.projectDriver = this.projectSettings.projectDriver;
        this.projectCreatedAt = new Date(this.projectDetails.created_at).toLocaleString();
        this.projectOwner = this.projectDetails.owner;
        this.projectDriver = this.projectSettings.projectDriver;
        this.projectURL = this.projectSettings.projectURL;
        this.projectDescription = this.projectSettings.description || '';
        if (mls.l5.actualOrg) {
            this.projectOrg = Object.keys(mls.stor.orgs)[mls.l5.actualOrg]
        }
    }



}

interface IDependenciesInfo {
    id: number,
    name: string,
    auth: string,
    unknown?: boolean,
}
