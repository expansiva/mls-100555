/// <mls fileReference="_100555_/l2/pluginExplore/pluginExploreList2.ts" enhancement="_102027_/l2/enhancementLit" /> 

import { html, css, svg, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property, queryAll, state } from 'lit/decorators.js';
import { selectLevel, forceServiceInstance, getBaseTemplate, getInstanceByFile, OpenedFileL2, saveOpenedFile } from '/_102027_/l2/libCommom.js';
import { cloneAllFiles, deleteAllFiles, renameAllFiles, undoAllFiles, undoFile, IReqCreateStorFile, createStorFile } from '/_102027_/l2/libStor.js';
import { createAllModels, createModel, readProjectTypescriptAndCompile, readProjectTypescriptAndCompileL1 } from '/_102027_/l2/libModel.js';
import { addInHistory, getHistory } from '/_102027_/l2/libHistoriesRecents.js';
import { ServiceBase } from '/_102027_/l2/serviceBase.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';

import { isNameValid } from '/_102027_/l2/libCommom.js';
import '/_100555_/l2/pluginExplore/mlsFileTree2.js';

/// **collab_i18n_start**
const message_pt = {
    updateListVerify: "atualizar lista/verificar",
    update: "atualizar",
    addNewFile: "adicionar novo arquivo",
    filter: "Filtrar",
    localProject: "Todos",
    projectFolder: "Pasta",
    totalFiles: "arquivos totais",
    filesWithErrors: "arquivos com erros",
    filesInLocalStorage: "arquivos no armazenamento local",
    filesChangedOnTheServer: "arquivos alterados no servidor",
    history: "Histórico",
    undo: "desfazer",
    clone: "clonar",
    rename: "renomear",
    delete: "excluir",
    security: 'segurança',
    components: 'Filtrar por Componente',
    others: 'Filtrar por Outros arquivos',
    orderName: 'Ordenar por nome',
    orderFolder: 'Ordenar por pasta',
    allFiles: 'Todos os arquivos',
    root: 'Raiz',
    upFolder: 'Voltar para a pasta anterior',
    filesInFolder: 'arquivos nesta pasta',
    deleteFolder: 'excluir todos os arquivos desta pasta',
    pinTask: 'fixar tarefa',
    pinTaskDesc: 'Escreva aqui sua task',
    pinColor: 'Clique para mudar a cor',
    save: 'Salvar',
    remove: 'Remover',
    cancel: 'Cancelar',
    close: 'Fechar',
    viewModules: 'Módulos',
    viewFolders: 'Pastas',
    viewAZ: 'A–Z',
    typeComp: 'Componentes',
    typeOther: 'Outros arquivos',
    typeAll: 'Todos (árvore)',
    search: 'Buscar arquivos...',
    recent: 'Recentes',
    rootModule: '(raiz)',
    noFiles: 'Nenhum arquivo encontrado',
    withErrors: 'com erro',
    local: 'locais',
    outdated: 'desatualizados',
    moreActions: 'Mais ações',
}

const message_en = {
    updateListVerify: 'update list/ verify',
    update: 'update',
    addNewFile: 'add new file',
    filter: 'Filter',
    projectFolder: "Folder",
    localProject: 'All',
    totalFiles: 'total files',
    filesWithErrors: 'files with errors',
    filesInLocalStorage: 'file in local storage',
    filesChangedOnTheServer: 'files changed on the server',
    history: 'History',
    undo: 'undo',
    clone: 'clone',
    rename: 'rename',
    delete: "delete",
    security: 'security',
    components: 'Filter by Component',
    others: 'Filter by Other Files',
    orderName: 'Sort by name',
    orderFolder: 'Sort by folder',
    allFiles: 'All files',
    root: 'Root',
    upFolder: 'Back to parent folder',
    filesInFolder: 'files in this folder',
    deleteFolder: 'delete all files in this folder',
    pinTask: 'pin task',
    pinTaskDesc: 'Write your task here',
    pinColor: 'Click to change the color',
    save: 'Save',
    remove: 'Remove',
    cancel: 'Cancel',
    close: 'Close',
    viewModules: 'Modules',
    viewFolders: 'Folders',
    viewAZ: 'A–Z',
    typeComp: 'Components',
    typeOther: 'Other files',
    typeAll: 'All (tree)',
    search: 'Search files...',
    recent: 'Recent',
    rootModule: '(root)',
    noFiles: 'No files found',
    withErrors: 'with errors',
    local: 'local',
    outdated: 'outdated',
    moreActions: 'More actions',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const pluginData: mls.plugin.IPluginData = {
    title: "List 2",
    getSvg(): TemplateResult {
        return svg`
     <svg height="22px" width="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
    `;
    }
};

@customElement('plugin-explore--plugin-explore-list2-100555')
export class PluginExploreList2 extends PluginBaseModule {

    public async createModels(stor: mls.stor.IFileInfo) {
        await createAllModels(stor, true, false, false);
    }

    private resizeObserver: ResizeObserver | undefined;

    private myDep: number[] = [];

    private msg: MessageType = messages['en'];

    public service: ServiceBase | undefined;

    private filterByLevel: Record<string, { prj: number, group: number }> = {};

    @property({ type: Boolean }) autoPrepare: boolean = false;

    @property() mode: TModeExploreList = 'list';

    @property() refresh: string = '';

    @property() position: string = 'left';

    @property() levelFiles: number = 2;

    @property() project: number = -1;

    @property() projectLabel: string = '1';

    @state() filterProject: number = -1; // -1: noFilter; 0: all project

    @property() modeView: number = 2; // 0: alphabetical; 1: folder; 2: modules

    @state() private quickFilter: TQuickFilter = '';

    @state() private projectModules: Record<number, string[]> = {}; // project -> moduleName[] (l5/project.json)

    @state() private openModules: Set<string> = new Set();

    @state() private modulesTouched: boolean = false;

    @state() private historyOpen: boolean = true;

    @state() private menuKey: string = ''; // li whose action menu is open

    @property() hiddenFiles: boolean = false;

    @property() errorAux: string = '';

    @property({ type: Array }) files: mls.stor.IFileInfo[] = [];

    @property({ type: Array }) history: mls.stor.IFileInfo[] = [];

    @state() modeFilter: string | undefined;

    @state() private currentFolder: string[] = []; // folder navigation path (modeView 1)

    @state() private pinTasks: IPinTask[] = [];

    @state() private pinEditKey: string = ''; // li whose pin form is open

    @state() private pinViewKey: string = ''; // li whose pin task is visible

    @state() private pinViewDirty: boolean = false; // desc changed in the open pin task

    @state() private pinNewColor: string = '#e53935'; // color chosen in the add pin form

    @queryAll('li') lis: HTMLElement[] | undefined;



    constructor() {
        super();
        this.setEvents();
    }

    private info = {
        tot: 0,
        version: 0,
        storage: 0,
        error: 0,
    }

    async prepare() {
        this.init();
    }

    private async showAdd() {
        this.inFilter = false;
        switch (mls.actualLevel) {
            case (1):
                await import('/_100555_/l2/pluginExplore/pluginExploreListAddL1.js');
                this.mode = 'addL1';
                break;
            case (2):
                await import('/_100555_/l2/pluginExplore/pluginExploreListAddL2.js');
                this.mode = 'addL2';
                break;
            case (3):
                await import('/_100555_/l2/pluginExplore/pluginExploreListAddL3.js');
                this.mode = 'addL3';
                break;
            case (4):
                await import('/_100555_/l2/pluginExplore/pluginExploreListAddL4.js');
                this.mode = 'addL4';
                break;
        }
    }

    private filesInLocal: mls.stor.IFileInfo[] = [];

    //--------EVENTS----------

    private setEvents() {

        mls.events.addEventListener([2, 5], ['ProjectSelected'], (ev) => {
            if (this.project === mls.actualProject) return;
            this.init();
        });

        mls.events.addListener(5, 'FileAction', (ev) => {

            if ((ev.type !== 'FileAction')) return;
            // if (this.visible === undefined || this.visible === null || (this.visible && this.visible === 'false')) return;
            const fileAction = JSON.parse(ev.desc as any) as mls.events.IFileAction;
            if (!['projectListChanged'].includes(fileAction.action)) return;
            this.init();

        });

        mls.events.addListener(2, 'FileAction', this.onMLSEvents.bind(this));

        mls.events.addListener(2, 'styleChanged' as any, (ev) => {
            this.changeList();
        });

        mls.events.addEventListener([1, 2, 3, 4, 5, 6, 7], ['ToolBarSelected'], (ev) => this.onlevelChange(ev));


    }

    private onlevelChange(ev: mls.events.IEvent) {
        this.changeList();
        this.showLoading(false);
    }

    private onMLSEvents: mls.events.Listener = async (ev: mls.events.IEvent): Promise<void> => {

        if (![1, 2, 3, 4, 5].includes(ev.level) || (ev.type !== 'FileAction')) return;
        const fileAction = JSON.parse(ev.desc as any) as mls.events.IFileAction;

        if (
            !['statusOrErrorChanged', 'projectListChanged', 'new'].includes(fileAction.action) ||
            fileAction.project === 0
        ) return;

        setTimeout(() => {
            this.init();

        }, 1000);


    }

    //---------COMPONENT-------------

    connectedCallback() {
        super.connectedCallback();
        this.initObserverResize();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.resizeObserver) this.resizeObserver.disconnect();
    }

    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        if (!this.autoPrepare) return;

        this.prepare();
        forceServiceInstance(2, '_100554_serviceSource');

    }

    async updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        const propMode = changedProperties.get('mode');
        if (propMode && this.mode === 'list') {
            this.init();
        }
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        switch (this.mode) {
            case ('list'):
                return this.renderModeList();
            case ('addL1'):
                return this.renderAddL1();
            case ('addL2'):
                return this.renderAddL2();
            case ('addL3'):
                return this.renderAddL3();
            case ('addL4'):
                return this.renderAddL4();
        }

    }

    renderModeList() {

        const files = this.getVisibleFiles();
        const searching = !!this.searchTerm || !!this.quickFilter;

        let body;
        if (this.modeFilter === 'all' && this.filterProject > 0) body = this.renderList(files);
        else if (this.modeView === 2) body = this.renderModules(files);
        else if (this.modeView === 1) body = this.renderFolder(files);
        else body = this.renderList(files);

        return html`
            <div class="contentServiceList ex2">
                ${this.renderHeader()}
                <div class="ex2-scroll scroll-custom">
                    ${searching ? '' : this.renderHistory()}
                    ${files.length === 0 && !(this.modeFilter === 'all' && this.filterProject > 0)
                        ? html`<div class="ex2-empty">${this.msg.noFiles}</div>`
                        : html`<ul class="ex2-list">${body}</ul>`}
                </div>
            </div>
        `
    }

    renderHeader() {

        const views: { v: number, label: string }[] = [
            { v: 2, label: this.msg.viewModules },
            { v: 1, label: this.msg.viewFolders },
            { v: 0, label: this.msg.viewAZ },
        ];
        const treeMode = this.modeFilter === 'all' && this.filterProject > 0;

        const chip = (key: TQuickFilter, count: number, label: string, cls: string) => count <= 0 ? '' : html`
            <button class="ex2-chip ${cls} ${this.quickFilter === key ? 'active' : ''}" title="${label}" @click=${() => this.setQuickFilter(key)}>
                <span class="ex2-dot"></span>${count} ${label}
            </button>`;

        return html`
        <div class="ex2-header">
            <div class="ex2-row">
                <div class="ex2-search">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
                    <input type="search" placeholder="${this.msg.search}" .value=${this.searchTerm} @input="${this.filterLiChange}">
                </div>
                <button class="ex2-add" title="${this.msg.addNewFile}" @click="${this.showAdd}">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                </button>
            </div>
            <div class="ex2-row ex2-filters">
                <div class="ex2-seg" role="tablist" ?hidden=${treeMode}>
                    ${views.map((v) => html`<button role="tab" aria-selected="${this.modeView === v.v}" class="${this.modeView === v.v ? 'active' : ''}" @click=${() => this.setView(v.v)}>${v.label}</button>`)}
                </div>
                <div class="ex2-selects">
                    <select title="${this.msg.projectFolder}" @change=${this.changeSelectProject} .value="${String(this.filterProject)}">
                        ${this.myDep.map((p) => html`<option value="${p}" ?selected=${this.filterProject === p}>${p}</option>`)}
                        <option value="0" ?selected=${this.filterProject === 0}>${this.msg.localProject}</option>
                    </select>
                    <select title="${this.msg.filter}" @change=${this.changeHiddenFiles} .value="${this.modeFilter || 'comp'}">
                        <option value="comp" ?selected=${!this.modeFilter || this.modeFilter === 'comp'}>${this.msg.typeComp}</option>
                        <option value="other" ?selected=${this.modeFilter === 'other'}>${this.msg.typeOther}</option>
                        <option value="all" ?selected=${this.modeFilter === 'all'}>${this.msg.typeAll}</option>
                    </select>
                </div>
            </div>
            <div class="ex2-row ex2-stats">
                <span class="ex2-total">${this.info.tot} ${this.msg.totalFiles}</span>
                ${chip('error', this.info.error, this.msg.withErrors, 'err')}
                ${chip('local', this.info.storage, this.msg.local, 'loc')}
                ${chip('outdated', this.info.version, this.msg.outdated, 'out')}
            </div>
        </div>
        `
    }

    renderHistory() {

        if (this.modeFilter === 'all' && this.filterProject > 0) return html``;
        if (this.history.length <= 0) return html``;

        return html`
            <div class="ex2-section">
                <button class="ex2-section-head" @click=${() => { this.historyOpen = !this.historyOpen; }}>
                    ${this.chevronSvg(this.historyOpen)}
                    <span>${+this.filterProject === 0 ? `${this.msg.recent} (${this.msg.localProject})` : this.msg.recent}</span>
                    <span class="ex2-count">${this.history.length}</span>
                </button>
                ${this.historyOpen ? html`
                    <ul class="ex2-list">
                        ${repeat(
                            this.history,
                            ((item: mls.stor.IFileInfo) => 'h_' + item.project + '_' + item.shortName + '_' + item.folder) as any,
                            ((file: mls.stor.IFileInfo, index: any) => this.renderLiItem(file, index, true)) as any
                        )}
                    </ul>` : ''}
            </div>
        `;
    }

    renderList(files: mls.stor.IFileInfo[]) {

        if (this.modeFilter === 'all' && this.filterProject > 0) {
            return html`<plugin-explore--mls-file-tree2-100555 project="${this.filterProject}" position="${this.position}" filter="${this.searchTerm}"></plugin-explore--mls-file-tree2-100555>`
        }

        let letterInit = '';
        return html`
            ${repeat(
                files,
                ((item: mls.stor.IFileInfo) => item.project + '_' + item.shortName + '_' + item.folder) as any,
                ((file: mls.stor.IFileInfo, index: any) => {
                    const letter = file.shortName.charAt(0).toUpperCase();
                    if (letterInit !== letter) {
                        letterInit = letter;
                        return html`<li class="ex2-letter folder">${letter}</li>${this.renderLiItem(file, index, false)}`;
                    }
                    return this.renderLiItem(file, index, false);
                }) as any
            )}
        `;
    }

    renderModules(files: mls.stor.IFileInfo[]) {

        const groups: Record<string, mls.stor.IFileInfo[]> = {};
        files.forEach((f) => {
            const k = this.getModuleKey(f);
            (groups[k] = groups[k] || []).push(f);
        });

        const keys = Object.keys(groups).sort((a, b) => this.compareModuleKeys(a, b));
        const forceOpen = !!this.searchTerm || !!this.quickFilter || keys.length === 1;

        return html`
            ${repeat(keys, ((k: string) => 'm_' + k) as any, ((k: string) => {
                const list = groups[k].sort((a, b) => a.shortName.localeCompare(b.shortName));
                const open = forceOpen || this.openModules.has(k) || (!this.modulesTouched && this.isActualModuleKey(k));
                const { label, project, isModule, seg } = this.describeModuleKey(k);
                const errors = list.filter((f) => this.getFileState(f).error).length;
                return html`
                    <li class="ex2-module folder ${open ? 'open' : ''}">
                        <div class="ex2-module-head" @click=${() => this.toggleModule(k, open)}>
                            ${this.chevronSvg(open)}
                            <span class="ex2-module-icon ${isModule ? 'is-module' : ''}">${isModule ? this.moduleSvg() : this.folderSvg()}</span>
                            <span class="ex2-module-name">${label}</span>
                            ${project ? html`<span class="ex2-prj">${project}</span>` : ''}
                            ${errors ? html`<span class="ex2-badge err" title="${this.msg.withErrors}">${errors}</span>` : ''}
                            <span class="ex2-count">${list.length}</span>
                            ${seg ? html`<span class="ex2-module-del folderDel" title="${this.msg.deleteFolder}" @click=${(e: MouseEvent) => { e.stopPropagation(); e.preventDefault(); this.delAllByFolders(list, seg); }}>${this.trashSvg()}</span>` : ''}
                        </div>
                        ${open ? html`
                            <ul class="ex2-list ex2-module-files">
                                ${repeat(
                                    list,
                                    ((item: mls.stor.IFileInfo) => item.project + '_' + item.shortName + '_' + item.folder) as any,
                                    ((file: mls.stor.IFileInfo, index: any) => this.renderLiItem(file, index, false)) as any
                                )}
                            </ul>` : ''}
                    </li>
                `;
            }) as any)}
        `;
    }

    renderFolder(files: mls.stor.IFileInfo[]) {

        if (files.length <= 0) return html``;

        const entries = files.map((file) => ({ file, path: this.getFolderPath(file) }));

        let cur = this.currentFolder;
        while (cur.length > 0 && !entries.some((e) => this.isInFolder(e.path, cur))) cur = cur.slice(0, -1);

        const subFolders: Record<string, mls.stor.IFileInfo[]> = {};
        const filesHere: mls.stor.IFileInfo[] = [];

        entries.forEach(({ file, path }) => {
            if (!this.isInFolder(path, cur)) return;
            if (path.length === cur.length) {
                filesHere.push(file);
                return;
            }
            const name = path[cur.length];
            (subFolders[name] = subFolders[name] || []).push(file);
        });

        const folderNames = Object.keys(subFolders).sort((a, b) => a.localeCompare(b));
        filesHere.sort((a, b) => a.shortName.localeCompare(b.shortName));

        return html`
            <li class="ex2-crumbs folder">
                <span class="ex2-crumb" @click=${() => this.openFolder([])}>${this.msg.root}</span>
                ${cur.map((seg, i) => html`<span class="ex2-crumb-sep">/</span><span class="ex2-crumb" @click=${() => this.openFolder(cur.slice(0, i + 1))}>${seg}</span>`)}
            </li>
            ${cur.length <= 0 ? '' : html`
                <li class="ex2-folder folder" title="${this.msg.upFolder}" @click=${() => this.openFolder(cur.slice(0, -1))}>
                    <span class="ex2-icon">${this.folderSvg()}</span>
                    <span class="ex2-name">..</span>
                </li>
            `}
            ${repeat(folderNames, ((item: string) => 'f_' + item) as any, ((name: string) => html`
                <li class="ex2-folder folder" @click=${() => this.openFolder([...cur, name])}>
                    <span class="ex2-icon">${this.folderSvg()}</span>
                    <span class="ex2-name">${name}</span>
                    <span class="ex2-count" title="${this.msg.filesInFolder}">${subFolders[name].length}</span>
                    <span class="ex2-module-del folderDel" title="${this.msg.deleteFolder}" @click=${(e: MouseEvent) => { e.stopPropagation(); e.preventDefault(); this.delAllByFolders(subFolders[name], [...cur, name].join('/')); }}>${this.trashSvg()}</span>
                </li>
            `) as any)}
            ${repeat(
                filesHere,
                ((item: mls.stor.IFileInfo) => item.project + '_' + item.shortName + '_' + item.folder) as any,
                ((file: mls.stor.IFileInfo, index: any) => this.renderLiItem(file, index, false)) as any
            )}
        `;
    }

    //------------ VIEW HELPERS -----------------

    private chevronSvg(open: boolean) {
        return html`<svg class="ex2-chev ${open ? 'open' : ''}" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>`;
    }

    private moduleSvg() {
        return html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/></svg>`;
    }

    private folderSvg() {
        return html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`;
    }

    private trashSvg() {
        return html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>`;
    }

    private fileSvg(file: mls.stor.IFileInfo) {
        const n = file.shortName.toLowerCase();
        if (file.extension !== '.ts') return html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>`;
        if (n.startsWith('page')) return html`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/></svg>`;
        if (n.startsWith('service')) return html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/></svg>`;
        if (n.startsWith('plugin')) return html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 4h4v3a2 2 0 1 0 4 0V4h2v6h-3a2 2 0 1 0 0 4h3v6H4V4h6z"/></svg>`;
        return html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/></svg>`;
    }

    private setView(v: number) {
        if (this.modeView === v) return;
        this.modeView = v;
        this.closeAllMenus();
        this.filterByLevel[mls.actualLevel] = { prj: this.filterProject, group: this.modeView };
    }

    private setQuickFilter(key: TQuickFilter) {
        this.quickFilter = this.quickFilter === key ? '' : key;
    }

    private toggleModule(key: string, open: boolean) {
        if (!this.modulesTouched) {
            this.modulesTouched = true;
            if (open && !this.openModules.has(key)) this.openModules.add(key); // keeps the implicit "actual module" state
        }
        const s = new Set(this.openModules);
        if (open) s.delete(key); else s.add(key);
        this.openModules = s;
    }

    private getModuleKey(file: mls.stor.IFileInfo): string {
        const seg = file.folder ? (file.folder.split('/').filter((s) => s)[0] || '') : '';
        return this.filterProject === 0 ? `${file.project}|${seg}` : seg;
    }

    private describeModuleKey(key: string): { label: string, project: string, isModule: boolean, seg: string, prj: number } {
        let project = '';
        let seg = key;
        if (key.indexOf('|') >= 0) [project, seg] = key.split('|');
        const prj = project ? +project : (this.filterProject > 0 ? this.filterProject : this.project);
        const isModule = !!seg && this.getModulesOf(prj).includes(seg);
        return { label: seg || this.msg.rootModule, project, isModule, seg, prj };
    }

    private isActualModuleKey(key: string): boolean {
        const { seg } = this.describeModuleKey(key);
        return !!mls.actualModule && seg === mls.actualModule;
    }

    private compareModuleKeys(a: string, b: string): number {
        const da = this.describeModuleKey(a);
        const db = this.describeModuleKey(b);
        if (da.project !== db.project) return da.project.localeCompare(db.project);
        const rank = (d: { seg: string, isModule: boolean }) => !d.seg ? 2 : d.isModule ? 0 : 1;
        const ra = rank(da), rb = rank(db);
        if (ra !== rb) return ra - rb;
        if (ra === 0) {
            const list = this.getModulesOf(da.prj);
            return list.indexOf(da.seg) - list.indexOf(db.seg);
        }
        return da.seg.localeCompare(db.seg);
    }

    private getFileState(file: mls.stor.IFileInfo) {
        const key = (ext: string) => mls.stor.getKeyToFiles(file.project, file.level, file.shortName, file.folder, ext);
        const htmlFile = mls.stor.files[key('.html')];
        const styleFile = mls.stor.files[key('.less')];
        const testFile = mls.stor.files[key('.test.ts')];
        const defsFile = mls.stor.files[key('.defs.ts')];
        const local = this.getTitleInLocalStorage(file, htmlFile, styleFile, testFile, defsFile);
        const error = !!(file.hasError || htmlFile?.hasError || styleFile?.hasError || testFile?.hasError || defsFile?.hasError);
        return { local, error, outdated: !!file.isLocalVersionOutdated };
    }

    private getVisibleFiles(): mls.stor.IFileInfo[] {
        const term = this.searchTerm.toLocaleLowerCase();
        return this.files.filter((file) => {
            if (term) {
                const name = `${file.folder ? file.folder + '/' : ''}${file.shortName}${file.extension}`.toLocaleLowerCase();
                if (name.indexOf(term) < 0) return false;
            }
            if (!this.quickFilter) return true;
            const st = this.getFileState(file);
            if (this.quickFilter === 'error') return st.error;
            if (this.quickFilter === 'local') return !!st.local;
            return st.outdated;
        });
    }

    private getFolderPath(file: mls.stor.IFileInfo): string[] {
        const segs = file.folder ? file.folder.split('/').filter((s) => s) : [];
        return this.filterProject === 0 ? [file.project.toString(), ...segs] : segs;
    }

    private isInFolder(path: string[], folder: string[]): boolean {
        return folder.every((seg, i) => path[i] === seg);
    }

    private async openFolder(path: string[]) {
        this.currentFolder = path;
        this.closeAllMenus();
    }

    private async loadModules() {
        const result: Record<number, string[]> = {};
        for (const prj of this.myDep) {
            result[prj] = await this.readModulesFromProjectJson(prj);
        }
        this.projectModules = result;
    }

    /** módulos do projeto: l5/project.json -> modules[].moduleName */
    private async readModulesFromProjectJson(project: number): Promise<string[]> {
        try {
            const key = mls.stor.getKeyToFiles(project, 5, 'project', '', '.json');
            const sf = mls.stor.files[key];
            if (!sf) return [];
            const content = await sf.getContent();
            if (typeof content !== 'string' || !content.trim()) return [];
            const json = JSON.parse(content);
            const modules = Array.isArray(json?.modules) ? json.modules : [];
            return modules.map((m: any) => m && typeof m.moduleName === 'string' ? m.moduleName : '').filter((n: string) => !!n);
        } catch (e) {
            return [];
        }
    }

    private getModulesOf(project: number): string[] {
        return this.projectModules[project] || [];
    }

    getTitleInLocalStorage(ts: mls.stor.IFileInfo, html: mls.stor.IFileInfo, less: mls.stor.IFileInfo, test: mls.stor.IFileInfo, defs: mls.stor.IFileInfo) {

        const tsLocal = ts && ts.inLocalStorage && this.verifyDifBaseTemplate(ts);
        const htmlLocal = html && html.inLocalStorage && this.verifyDifBaseTemplate(html);
        const styleLocal = less && less.inLocalStorage && this.verifyDifBaseTemplate(less);
        const testLocal = test && test.inLocalStorage && this.verifyDifBaseTemplate(test);
        const defsLocal = defs && defs.inLocalStorage && this.verifyDifBaseTemplate(defs);

        let rc = '';
        if (tsLocal) rc = rc + '.ts ';
        if (htmlLocal) rc = rc + '.html ';
        if (styleLocal) rc = rc + '.less ';
        if (testLocal) rc = rc + '.test.ts ';
        if (defsLocal) rc = rc + '.defs.ts ';

        return rc;
    }

    renderLiItem(file: mls.stor.IFileInfo, index: number, inHistory: boolean) {

        const name = this.getAllName(file, inHistory);
        const nameFilter = `${file.folder ? file.folder + '/' : ''}${file.shortName}${file.extension}`.toLocaleLowerCase();
        const st = this.getFileState(file);

        const actualL2 = (mls.actual[2] as any)[this.position]?.shortName;
        const actualL2Folder = (mls.actual[2] as any)[this.position]?.folder;
        const validProject = this.filterProject === 0 && mls.actualProject !== file.project && file.project !== 0 ? false : true;

        const selected = file.shortName === actualL2 && file.folder === actualL2Folder;

        // secondary line: the part of the path the current view does not already show
        let sub = '';
        if (!inHistory && this.modeView === 2 && file.folder) sub = file.folder.split('/').filter((s) => s).slice(1).join('/');
        if (!inHistory && this.modeView === 0 && file.folder && this.filterProject !== 0) sub = '';

        const pin = this.pinTasks.find((p) => this.isSamePin(p, file));
        const keyPin = (inHistory ? 'h_' : '') + file.project + '_' + file.folder + '_' + file.shortName;
        const menuOpen = this.menuKey === keyPin;

        return html`
            <li @click="${this.clickOptOpen}" class="ex2-file ${selected ? 'selected' : ''} ${menuOpen ? 'menu-open' : ''}" .myFile=${file} .nameFilter="${nameFilter}" ?disabled=${!validProject}>
                <div class="elContent">
                    <div class="ex2-file-row">
                        <span class="ex2-icon">${this.fileSvg(file)}</span>
                        <span class="ex2-file-text">
                            <span class="spanFileName ${file.status === 'deleted' ? 'fileDeleted' : ''}">${name}</span>
                            ${sub ? html`<span class="ex2-sub">${sub}</span>` : ''}
                        </span>
                        <span class="ex2-flags">
                            ${st.error ? html`<span class="ex2-flag err" title="bug"></span>` : ''}
                            ${st.local ? html`<span class="ex2-flag loc" title="${st.local} in localstorage"></span>` : ''}
                            ${st.outdated ? html`<span class="ex2-flag out" title="need conciliation"></span>` : ''}
                        </span>
                        ${pin ? html`<span class="ex2-pin" title="${pin.desc.length > 50 ? pin.desc.slice(0, 50) + '...' : pin.desc}" @click=${(e: MouseEvent) => this.clickPinIcon(e, keyPin)}>${this.pinSvg(pin.color)}</span>` : ''}
                        <button class="ex2-more" title="${this.msg.moreActions}" @click=${(e: MouseEvent) => this.toggleMenu(e, keyPin)}>
                            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
                        </button>
                    </div>
                    ${menuOpen ? html`
                        <div class="ex2-menu groupHiddenList activegpbtnslider" @click=${(e: MouseEvent) => e.stopPropagation()}>
                            <button title="${this.msg.undo}" @click="${this.clickOptUndo}"><span class="fa fa-undo"></span>${this.msg.undo}</button>
                            ${this.hiddenFiles ? '' : html`<button title="${this.msg.clone}" @click="${this.clickOptClone}"><span class="fa fa-clone"></span>${this.msg.clone}</button>`}
                            ${this.hiddenFiles ? '' : html`<button title="${this.msg.rename}" @click="${this.clickOptRename}"><span class="fa fa-file-pen"></span>${this.msg.rename}</button>`}
                            ${this.hiddenFiles ? '' : html`<button title="${this.msg.security}" @click="${this.clickOptOpenSecurity}"><span class="fa-solid fa-shield-halved"></span>${this.msg.security}</button>`}
                            <button title="${this.msg.pinTask}" @click=${(e: MouseEvent) => this.clickOptPinTask(e, keyPin, pin)}><span class="fa fa-thumbtack"></span>${this.msg.pinTask}</button>
                            <button class="danger" title="${this.msg.delete}" @click="${this.clickOptDel}"><span class="fa fa-trash"></span>${this.msg.delete}</button>
                        </div>` : ''}
                    ${pin && this.pinViewKey === keyPin ? this.renderPinView(file, pin) : ''}
                    ${!pin && this.pinEditKey === keyPin ? this.renderPinForm(file) : ''}
                </div>
            </li>
        `;

    }

    private toggleMenu(e: MouseEvent, keyPin: string) {
        e.stopPropagation();
        this.menuKey = this.menuKey === keyPin ? '' : keyPin;
    }


    private renderPinForm(file: mls.stor.IFileInfo) {
        const textColor = this.getContrastColor(this.pinNewColor);
        return html`
            <div class="pinTaskForm" style="margin:.25rem 0; border:1px solid ${this.pinNewColor}; border-radius:4px; overflow:hidden" @click=${(e: MouseEvent) => e.stopPropagation()}>
                <div class="pinTaskHeader" style="display:flex; align-items:center; gap:.5rem; padding:.25rem .5rem; background:${this.pinNewColor}; color:${textColor}">
                    <div title="${this.msg.pinColor}" style="flex:1; position:relative; display:flex; align-items:center; gap:.5rem; cursor:pointer">
                        <span class="fa fa-palette"></span>
                        <span>PinTask</span>
                        <input type="color" .value=${this.pinNewColor} style="position:absolute; inset:0; width:100%; height:100%; opacity:0; cursor:pointer; border:0; padding:0" @input=${(e: InputEvent) => { this.pinNewColor = (e.target as HTMLInputElement).value; }}>
                    </div>
                    <span class="fa fa-xmark" title="${this.msg.cancel}" style="cursor:pointer" @click=${() => { this.pinEditKey = ''; }}></span>
                </div>
                <div style="display:flex; flex-direction:column; gap:.25rem; padding:.5rem">
                    <textarea class="pinTaskDesc" rows="3" placeholder="${this.msg.pinTaskDesc}" style="resize:vertical; width:100%; box-sizing:border-box"></textarea>
                    <button style="align-self:flex-end" @click=${(e: MouseEvent) => this.clickPinSave(e, file)}>${this.msg.save}</button>
                </div>
            </div>
        `;
    }

    private renderPinView(file: mls.stor.IFileInfo, pin: IPinTask) {
        const textColor = this.getContrastColor(pin.color);
        return html`
            <div class="pinTaskView" style="margin:.25rem 0; border:1px solid ${pin.color}; border-radius:4px; overflow:hidden" @click=${(e: MouseEvent) => e.stopPropagation()}>
                <div class="pinTaskHeader" style="display:flex; align-items:center; gap:.5rem; padding:.25rem .5rem; background:${pin.color}; color:${textColor}">
                    <span style="flex:1">PinTask</span>
                    <span class="fa fa-trash" title="${this.msg.remove}" style="cursor:pointer" @click=${() => this.clickPinRemove(file)}></span>
                    <span class="fa fa-xmark" title="${this.msg.close}" style="cursor:pointer" @click=${() => { this.pinViewKey = ''; this.pinViewDirty = false; }}></span>
                </div>
                <div style="display:flex; flex-direction:column; gap:.25rem; padding:.5rem">
                    <textarea class="pinTaskViewDesc" rows="3" style="resize:vertical; width:100%; box-sizing:border-box" .value=${pin.desc} @input=${(e: InputEvent) => { this.pinViewDirty = (e.target as HTMLTextAreaElement).value.trim() !== pin.desc; }}></textarea>
                    ${this.pinViewDirty ? html`<button style="align-self:flex-end" @click=${(e: MouseEvent) => this.clickPinViewSave(e, file, pin)}>${this.msg.save}</button>` : ''}
                </div>
            </div>
        `;
    }

    private getContrastColor(hex: string): string {
        const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
        if (!m) return '#000';
        const [r, g, b] = [m[1], m[2], m[3]].map((c) => parseInt(c, 16));
        return (r * 299 + g * 587 + b * 114) / 1000 > 140 ? '#000' : '#fff';
    }

    private pinSvg(color: string) {
        return html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="height:14px; fill:${color}"><path d="M32 32C32 14.3 46.3 0 64 0L320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-29.5 0 11.4 148.2c36.7 19.9 65.7 53.2 79.5 94.7l1 3c3.3 9.8 1.6 20.5-4.4 28.8s-15.7 13.3-26 13.3L32 352c-10.3 0-19.9-4.9-26-13.3s-7.7-19.1-4.4-28.8l1-3c13.8-41.5 42.8-74.8 79.5-94.7L93.5 64 64 64C46.3 64 32 49.7 32 32zM160 384l64 0 0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-96z"/></svg>`;
    }

    renderAddL1() {
        return html`<plugin-explore--plugin-explore-list-add-l1-100555 autoprepare='ss' position="${this.position}" .father="${this}" .service="${this.service}" level="1"></plugin-explore--plugin-explore-list-add-l1-100555>`
    }

    renderAddL2() {
        return html`<plugin-explore--plugin-explore-list-add-l2-100555 level="${this.levelFiles}" position="${this.position}" .father="${this}"></plugin-explore--plugin-explore-list-add-l2-100555>`
    }

    renderAddL3() {
        return html`<plugin-explore--plugin-explore-list-add-l3-100555 autoprepare='ss' position="${this.position}" .father="${this}" .service="${this.service}"></plugin-explore--plugin-explore-list-add-l3-100555>`
    }

    renderAddL4() {
        return html`<plugin-explore--plugin-explore-list-add-l4-100555 autoprepare='ss' position="${this.position}" .father="${this}" .service="${this.service}"></plugin-explore--plugin-explore-list-add-l4-100555>`
    }
    //------------ ACTIONS -----------------

    private getAllName(file: mls.stor.IFileInfo, isHistory = false): string {
        let name = '';

        const folder = file.folder ? file.folder : '';
        if (this.modeView === 0 && this.filterProject === 0) {
            name = '_' + file.project + '_' + folder + '/' + file.shortName
        } else if (this.modeView === 0 && this.filterProject === mls.actualProject) {
            name = folder ? folder + '/' + file.shortName : file.shortName;
        } else if (this.filterProject !== mls.actualProject) {
            name = file.project + '_' + (folder ? folder + '/' + file.shortName : file.shortName);
        } else {
            name = file.shortName;
        }

        // folders/modules: the name is only the file; the path goes muted on the side (sub)
        if ((this.modeView === 1 || this.modeView === 2) && !isHistory) name = file.shortName;

        if (isHistory && folder) name = folder + '/' + file.shortName;
        if (isHistory && this.filterProject === 0) name = file.project + '_' + folder + '/' + file.shortName;

        if (this.modeFilter === 'other') name = name + file.extension;
        return name;
    }

    private showLoading(show: boolean) {
        if (this.service) this.service.loading = show;
    }

    private showError(error: string) {
        if (this.service) this.service.setError(error);
    }

    private closeAllMenus() {
        this.menuKey = '';
    }

    private async clickOptUndo(e: MouseEvent) {

        try {
            e.stopPropagation();
            const mfile = this.getMyFileInElement(e.target as HTMLElement);
            if (!mfile) return;
            if (['project', 'designSystem'].includes(mfile.shortName) && mfile.folder === '' && mfile.status === 'new') {
                throw new Error(`This action cannot be performed on this file at this time.`);
            }

            if (!window.confirm(`${this.msg.undo}: ${mfile.shortName}?`)) return;

            if (this.hiddenFiles) {
                await undoFile(mfile);
            } else await undoAllFiles(mfile);

            this.closeAllMenus();
            this.changeList();
        } catch (err: any) {
            this.showError(err.message);
        }

    }

    private async clickOptDel(e: MouseEvent) {

        try {
            e.stopPropagation();
            const mfile = this.getMyFileInElement(e.target as HTMLElement);
            if (!mfile) throw new Error('[clickOptDel] Not found file');
            if (['project', 'designSystem'].includes(mfile.shortName) && mfile.folder === '') {
                throw new Error(`The file ${mfile.shortName} cannot be deleted.`);
            }

            if (this.hiddenFiles) {
                mfile.status = 'deleted';
            } else await deleteAllFiles(mfile);

            this.closeAllMenus();
            this.changeList();
        } catch (err: any) {
            this.showError(err.message);
        }


    }

    private async clickOptOpen(e: MouseEvent) {

        e.stopPropagation();
        const target = e.target as HTMLElement;
        const li = target.closest('li');

        if (li && li.querySelector('*[contenteditable]')) return;

        this.lis?.forEach((l) => l.classList.remove('selected'));
        if (li) li.classList.add('selected');

        const mfile = this.getMyFileInElement(e.target as HTMLElement);
        if (!mfile) return;

        if (this.hiddenFiles) {
            this.fireEventsDetails(mfile);
            return;
        }

        addInHistory(mfile);
        this.fireEvents('open', mfile, {});

    }

    private async clickOptOpenSecurity(e: MouseEvent) {

        e.stopPropagation();
        const target = e.target as HTMLElement;
        const li = target.closest('li');
        this.lis?.forEach((l) => l.classList.remove('selected'));
        if (li) li.classList.add('selected');

        const mfile = this.getMyFileInElement(e.target as HTMLElement);
        if (!mfile) return;
        addInHistory(mfile);
        if (mls.actualLevel != 1) selectLevel(2);
        (window as any).securityMode = true;
        this.fireEvents('open', mfile, {});
        this.closeAllMenus();

    }

    private clickOptPinTask(e: MouseEvent, keyPin: string, pin: IPinTask | undefined) {
        e.stopPropagation();
        this.closeAllMenus();
        if (pin) {
            this.pinViewKey = keyPin;
            this.pinViewDirty = false;
            return;
        }
        this.pinNewColor = '#e53935';
        this.pinEditKey = this.pinEditKey === keyPin ? '' : keyPin;
    }

    private clickPinIcon(e: MouseEvent, keyPin: string) {
        e.stopPropagation();
        this.pinViewKey = this.pinViewKey === keyPin ? '' : keyPin;
        this.pinViewDirty = false;
    }

    private clickPinViewSave(e: MouseEvent, file: mls.stor.IFileInfo, pin: IPinTask) {
        const view = (e.target as HTMLElement).closest('.pinTaskView');
        if (!view) return;
        const desc = (view.querySelector('.pinTaskViewDesc') as HTMLTextAreaElement).value.trim();
        const pins = this.getPinTasks().filter((p) => !this.isSamePin(p, file));
        pins.push({ ...pin, desc });
        this.savePinTasks(pins);
        this.pinViewDirty = false;
    }

    private clickPinSave(e: MouseEvent, file: mls.stor.IFileInfo) {
        const form = (e.target as HTMLElement).closest('.pinTaskForm');
        if (!form) return;
        const desc = (form.querySelector('.pinTaskDesc') as HTMLTextAreaElement).value.trim();
        const pins = this.getPinTasks().filter((p) => !this.isSamePin(p, file));
        pins.push({ project: file.project, file: file.shortName, folder: file.folder || '', desc, color: this.pinNewColor });
        this.savePinTasks(pins);
        this.pinEditKey = '';
    }

    private clickPinRemove(file: mls.stor.IFileInfo) {
        this.savePinTasks(this.getPinTasks().filter((p) => !this.isSamePin(p, file)));
        this.pinEditKey = '';
        this.pinViewKey = '';
        this.pinViewDirty = false;
    }

    private isSamePin(pin: IPinTask, file: mls.stor.IFileInfo): boolean {
        return pin.project === file.project && pin.file === file.shortName && pin.folder === (file.folder || '');
    }

    private clickOptRename(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;

        const li = el.closest('li');
        if (!li) {
            this.showError('[clickOptRename] Not found element');
            return;
        }

        const spanFileName = li.querySelector('.spanFileName') as HTMLElement;

        const mfile = this.getMyFileInElement(e.target as HTMLElement);
        if (!mfile || !spanFileName) {
            this.showError('[clickOptRename] Not found element rename');
            return;
        }

        if (['project', 'designSystem'].includes(mfile.shortName) && mfile.folder === '') {
            this.showError(`This file cannot be renamed.`);
            return;
        }

        spanFileName.setAttribute('contentEditable', 'true');

        const oldValue = spanFileName.innerText;

        if (this.modeView !== 0) spanFileName.innerText = mfile.folder ? mfile.folder + '/' + mfile.shortName : mfile.shortName;

        li.onclick = () => { };

        spanFileName.onkeydown = (event: KeyboardEvent) => {

            if (event.key === "Enter") {

                event.preventDefault();

                let name = spanFileName.innerText.trim();
                let folder = '';

                if (name.indexOf('/') >= 0) {
                    const split1 = name.split('/');
                    name = split1.pop() || '';
                    folder = split1.join('/');
                }

                if (name === mfile.shortName && folder === mfile.folder) {
                    spanFileName.removeAttribute('contentEditable');
                    this.changeList();
                    return;
                }

                const param = { project: mfile.project.toString(), name, folder, mode: 'rename' };
                if (!this.isValidNewName(mfile, param)) {
                    this.showError('[rename] invalid name');
                    return;
                };
                this.renameFile(mfile, param);
            }
        }

        spanFileName.onblur = () => {

            spanFileName.innerText = oldValue;
            spanFileName.removeAttribute('contentEditable');
            this.changeList();
        }

        spanFileName.focus();

        this.closeAllMenus();

    }

    private clickOptClone(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        if (!el) return;
        const myfile = this.getMyFileInElement(el);
        if (!myfile) {
            this.showError('[clickOptClone] Not found file!');
            return;
        }

        this.cloneFile(myfile);
        this.closeAllMenus();
    }

    private async cloneFile(storFile: mls.stor.IFileInfo) {

        try {
            this.showLoading(true);

            let idx = 2;
            let isvalidName = false;
            let name = ''
            while (!isvalidName) {

                name = storFile.shortName + idx;
                const ret = this.isValidNewName(storFile, { project: storFile.project.toString(), name: name, folder: storFile.folder, mode: 'clone' });
                if (!ret) {
                    idx++;
                } else {
                    isvalidName = true;
                }
            }

            const file = await cloneAllFiles(storFile, storFile.project, name)
            if (!file.ts || file.ts instanceof Error) return;

            addInHistory(file.ts);
            if (mls.actualLevel != 1) selectLevel(2);
            this.changeList(100);

        } catch (e: any) {

            this.showError(e.message);
            setTimeout(() => this.showLoading(false), 500);

        }


    }

    private async renameFile(storFile: mls.stor.IFileInfo, info: { project: string, name: string, folder: string }) {

        try {
            this.showLoading(true);
            const file = await renameAllFiles(storFile, +info.project, info.name, info.folder)
            if (!file.ts || file.ts instanceof Error) return;
            addInHistory(file.ts);
            if (mls.actualLevel != 1) selectLevel(2);
            this.changeList(100);

        } catch (e: any) {

            this.showError(e.message);
            setTimeout(() => this.showLoading(false), 500);

        }


    }

    private fireEventsDetails(stor: mls.stor.IFileInfo) {
        const key = mls.stor.getKeyToFile(stor);

        const options = {
            shortName: undefined,
            project: undefined,
            htmlText: '<plugin-view--plugin-view-file-100555 nameFile="' + key + '"></plugin-view--plugin-view-file-100555>'
        }

        mls.events.fire(
            mls.actualLevel as any,
            'PluginDetails' as any,
            JSON.stringify(options),
            0
        );
    }

    private async fireEvents(action: string, file: mls.stor.IFileInfo, info: any, timeout: number = 0): Promise<void> {

        try {

            this.showLoading(true);
            const params = {} as mls.events.IFileAction;

            //const files = await createAllModels(file, true);
            const storFiles = await mls.stor.getFiles({ project: file.project, shortName: file.shortName, folder: file.folder, loadContent: false });
    
            if ([1, 2, 3, 4].includes(mls.actualLevel)) await this.createModel(file, '.ts');
            if ([2, 3, 4].includes(mls.actualLevel) && storFiles.less) await this.createModel(file, '.less');
            if ([2, 3, 4].includes(mls.actualLevel) && storFiles.html) await this.createModel(file, '.html');

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

            if (action === 'open') {
                this.saveLocalStorageLastOpen(file, this.position as any);
            }

            mls.events.fire([mls.actualLevel], ['FileAction'], JSON.stringify(params), timeout);

            if (['open'].includes(action) && mls.actualLevel === 2) {
                return;
            }
            this.showLoading(false);
            this.changeList(100);

        } catch (err: any) {

            this.showError('false');
            this.showError(err.message || '[fireEvents]: erro open');
            this.showLoading(false);
        }


    }

    private async createModel(base: mls.stor.IFileInfo, ext: string) {

        if (ext === '.ts') {
            return await createModel(base, true, false);
        }

        const { project, shortName, folder, level } = base;
        const key = mls.stor.getKeyToFiles(project, base.level, shortName, folder, ext);
        let stor = mls.stor.files[key];

        if (!stor) {

            const param: IReqCreateStorFile = {
                project,
                shortName,
                folder,
                level,
                extension: '.ts',
                source: '',
                status: 'new'
            }

            if (ext === '.less') {
                const templateLess = await getBaseTemplate({ folder, shortName, project, extension: '.less' }, 'enhancementStyle');
                return createStorFile({ ...param, extension: '.less', source: templateLess }, true, true, false)
            }

            if (ext === '.html') {
                const templateHTML = await getBaseTemplate({ folder, shortName, project, extension: '.html' });
                return createStorFile({ ...param, extension: '.html', source: templateHTML }, true, true, false)
            }


        } else {
            await createModel(stor, true, false);
        }


    }

    private fireEventThisProject = 0;
    private fireEventLoadProject(): void {
        if (this.fireEventThisProject === mls.actualProject) return;
        this.fireEventThisProject = mls.actualProject as number;
        readProjectTypescriptAndCompile(mls.actualProject as number, '', false);    
        //readProjectTypescriptAndCompileL1(mls.actualProject as number, '', true);
    }

    private changeListTimeout: number = 0;
    public changeList(time: number = 500): void {
        this.showLoading(false);
        clearTimeout(this.changeListTimeout);
        this.changeListTimeout = window.setTimeout(async () => {
            await this.init();

        }, time);

    }

    //------------ IMPLEMENTS -----------------

    private extensionLevel = {
        1: '.ts',
        2: '.ts',
        3: '.ts',
        4: '.ts'
    }

    private levelByLevel = {
        1: 1,
        2: 2,
        3: 2,
        4: 2
    }


    private async init() {

        this.info.tot = 0;
        this.info.version = 0;
        this.info.storage = 0;
        this.info.error = 0;
        this.setLastFilter();
        const prjs = mls.l5.getProjectDetails(this.project)?.prj_dependencies || []
        this.myDep = [this.project, ...prjs];
        this.projectLabel = this.project.toString();
        this.pinTasks = this.getPinTasks();
        this.loadModules();
        this.fireEventLoadProject();
        await this.getFiles();



    }

    private setLastFilter() {

        this.project = this.project === -1 ? mls.actualProject || 0 : this.project;
        if (this.filterByLevel[mls.actualLevel]) {

            this.filterProject = this.filterByLevel[mls.actualLevel].prj;
            this.modeView = this.filterByLevel[mls.actualLevel].group;

        } else {

            this.filterProject = this.filterProject === -1 ? mls.actualProject || 0 : this.filterProject;
        }

        this.loadLastPreference();

    }

    private getMyFileInElement(el: HTMLElement): mls.stor.IFileInfo | undefined {

        el = el.closest('li') as HTMLElement;
        if (!el || !(el as any)['myFile']) return;
        const mfile = (el as any)['myFile'] as mls.stor.IFileInfo
        return mfile;

    }

    private async changeSelectProject(e: any) {

        this.info.tot = 0;
        this.info.version = 0;
        this.info.storage = 0;
        this.info.error = 0;
        this.filterProject = +e.target.value;
        this.currentFolder = [];
        this.openModules = new Set();
        this.modulesTouched = false;
        this.filterByLevel[mls.actualLevel] = { prj: this.filterProject, group: this.modeView };
        await this.getFiles();

    }

    private async changeHiddenFiles(e: any) {

        this.info.tot = 0;
        this.info.version = 0;
        this.info.storage = 0;
        this.info.error = 0;
        this.hiddenFiles = ['other', 'all'].includes(e.target.value);
        this.modeFilter = e.target.value;
        if (this.modeFilter === 'all' && this.modeView !== 0) this.modeView = 0;
        this.filterByLevel[mls.actualLevel] = { prj: this.filterProject, group: this.modeView };
        this.setLastPreference();
        await this.getFiles();

    }

    private inFilter = false;
    private timeFilterChange = 0;
    private searchTerm: string = '';

    private filterLiChange(e: InputEvent) {

        e.stopPropagation();
        const el = e.target as HTMLInputElement;
        if (!el) return;
        clearTimeout(this.timeFilterChange);
        this.timeFilterChange = window.setTimeout(() => {

            this.searchTerm = el.value;
            this.inFilter = el.value.length > 0;

            // In tree mode, push filter into the shadow-DOM tree component directly
            if (this.modeFilter === 'all' && this.filterProject > 0) {
                const tree = this.querySelector('plugin-explore--mls-file-tree2-100555') as any;
                if (tree) tree.filter = this.searchTerm;
                return;
            }

            this.requestUpdate();

        }, 250);

    }

    private async getFiles() {

        try {
            const arraySf: mls.stor.IFileInfo[] = await this.getFilesProject();
            const arraySfHistory: mls.stor.IFileInfo[] = await this.getFileHistory();
            this.files = [...arraySf];
            this.history = this.filterArrayHistory([...arraySfHistory], this.files);
        } catch (e) {
            console.info(e);
        }

    }

    private filterArrayHistory(arrayAlvo: mls.stor.IFileInfo[], arrayBase: mls.stor.IFileInfo[]): mls.stor.IFileInfo[] {
        return arrayAlvo.filter(itemAlvo =>
            arrayBase.some(itemBase =>
                itemBase.folder === itemAlvo.folder &&
                itemBase.shortName === itemAlvo.shortName &&
                itemBase.extension === itemAlvo.extension &&
                itemBase.project === itemAlvo.project
            )
        );
    }

    private validFileByLevel(sf: mls.stor.IFileInfo): boolean {

        const ext = (this.extensionLevel as any)[mls.actualLevel] as string;
        const lv = mls.actualLevel === 1 ? 1 : this.levelFiles;

        if (
            !this.myDep.includes(sf.project) ||
            sf.level !== lv ||
            (sf.extension !== ext && !this.hiddenFiles)
        ) return false;

        if (this.filterProject !== 0 && this.filterProject !== sf.project) return false;

        const keyTs = mls.stor.getKeyToFile({ ...sf, extension: '.ts' });
        if (this.hiddenFiles && mls.stor.files[keyTs]) return false;


        if (mls.actualLevel === 1 && sf.level !== 1) {
            return false;
        }

        if ([4, 5, 6, 7].includes(mls.actualLevel) && sf.shortName.startsWith('be')) {
            return false;
        }

        return true;

    }

    private async getFilesProject(): Promise<mls.stor.IFileInfo[]> {

        if (!window['mls']) return [];
        this.filesInLocal = [];
        const arraySf: mls.stor.IFileInfo[] = [];
        const ext = (this.extensionLevel as any)[mls.actualLevel] as string;

        for (const i of Object.keys(mls.stor.files)) {

            const sf = mls.stor.files[i];
            if (!this.validFileByLevel(sf)) continue;

            const keyHtml = mls.stor.getKeyToFiles(sf.project, sf.level, sf.shortName, sf.folder, '.html');
            const keyStyle = mls.stor.getKeyToFiles(sf.project, sf.level, sf.shortName, sf.folder, '.less');
            const keyTestFile = mls.stor.getKeyToFiles(sf.project, sf.level, sf.shortName, sf.folder, '.test.ts');
            const keyDefsFile = mls.stor.getKeyToFiles(sf.project, sf.level, sf.shortName, sf.folder, '.defs.ts');

            const styleFile = mls.stor.files[keyStyle];
            const htmlFile = mls.stor.files[keyHtml];
            const testFile = mls.stor.files[keyTestFile];
            const defsFile = mls.stor.files[keyDefsFile];


            if (mls.actualLevel === 3 && !defsFile) {
                continue;
            } else if (mls.actualLevel === 3 && defsFile) {
                const m: any | undefined = await getInstanceByFile(defsFile);
                if (!m || !m.defs ||
                    !m.defs.meta || !m.defs.meta.type ||
                    m.defs.meta.type !== 'organism') continue;

                if (mls.actualModule && mls.actualModule !== sf.folder) continue;
            }

            if (mls.actualLevel === 4 && !defsFile) {
                continue;
            } else if (mls.actualLevel === 4 && defsFile) {
                const m: any | undefined = await getInstanceByFile(defsFile);
                if (!m || !m.defs ||
                    !m.defs.meta || !m.defs.meta.type ||
                    m.defs.meta.type !== 'page') continue;

                if (mls.actualModule && mls.actualModule !== sf.folder) continue;
            }


            const htmlLocal = htmlFile && htmlFile.inLocalStorage; //&& await this.isDifBaseTemplate(htmlFile);
            const styleLocal = styleFile && styleFile.inLocalStorage; //&& await this.isDifBaseTemplate(styleFile);
            const testLocal = testFile && testFile.inLocalStorage; //&& await this.isDifBaseTemplate(testFile);
            const defsLocal = defsFile && defsFile.inLocalStorage; //&& await this.isDifBaseTemplate(defsFile);

            const htmlError = htmlFile && htmlFile.hasError;
            const styleError = styleFile && styleFile.hasError
            const testError = testFile && testFile.hasError;
            const defsError = defsFile && defsFile.hasError;

            this.info.tot++;

            if (sf.isLocalVersionOutdated) this.info.version++;
            if (sf.inLocalStorage || htmlLocal || styleLocal || testLocal || defsLocal) {
                this.filesInLocal.push(sf);
                this.info.storage++;
            }
            if (sf.hasError || htmlError || styleError || testError || defsError) this.info.error++;

            arraySf.push(sf);
        }

        arraySf.sort((a, b) => a.shortName.localeCompare(b.shortName));

        return arraySf;

    }

    private dataDifBaseTemplate: Record<string, boolean> = {};
    private verifyDifBaseTemplate(file: mls.stor.IFileInfo): boolean {

        const { folder, shortName, project, extension } = file;
        const key = mls.stor.getKeyToFiles(project, 2, shortName, folder, extension);

        if (this.dataDifBaseTemplate[key] === undefined) return file.inLocalStorage;

        return this.dataDifBaseTemplate[key];

    }

    private async getFileHistory() {

        try {
            if (!window['mls']) return [];
            let arraySfHistory: mls.stor.IFileInfo[] = [];
            const lh = getHistory();
            if (lh.length <= 0 || !window['mls']) {

                const diff = this.filesInLocal.filter(a =>
                    !arraySfHistory.some(b => b.shortName === a.shortName && b.folder === a.folder)
                );

                arraySfHistory = [...arraySfHistory, ...diff];
                return arraySfHistory;
            }

            for await (const i of lh) {

                const lv = mls.actualLevel === 1 ? 1 : this.levelFiles;

                let key = mls.stor.getKeyToFiles(i.project, lv, i.shortName, i.folder, i.extension);

                if (!mls.stor.files[key] && +this.filterProject === 0) {
                    await mls.stor.server.loadProjectInfoIfNeeded(i.project);
                    key = mls.stor.getKeyToFiles(i.project, lv, i.shortName, i.folder, i.extension);
                }

                if (!mls.stor.files[key] || !this.validFileByLevel(mls.stor.files[key])) continue;
                arraySfHistory.push(mls.stor.files[key]);


            }

            const diff = this.filesInLocal.filter(a =>
                !arraySfHistory.some(b => b.shortName === a.shortName && b.folder === a.folder)
            );

            arraySfHistory = [...arraySfHistory, ...diff]

            return arraySfHistory.filter((obj, index, self) =>
                index === self.findIndex(o =>
                    o.project === obj.project &&
                    o.shortName === obj.shortName &&
                    o.folder === obj.folder
                )
            );

        }
        catch (e: any) {
            console.info('[pluginExploreList getFileHistory]', e);
            return [];
        }
    }



    private isValidNewName(file: mls.stor.IFileInfo, action: { mode: string, project: string, name: string, folder: string }): boolean {

        if (action.project === '' || action.name === '') return false;
        if (action.name.length === 0 || action.name.length > 255) return false;
        //const invalidCharacters = /[_\{}\[\]\*$@#=\-+!|?,<>=.;^~º°""''``áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/;
        //if (invalidCharacters.test(action.name) || invalidCharacters.test(action.folder)) return false;



        const lv = mls.actualLevel === 1 ? 1 : this.levelFiles;

        const ret = isNameValid(+action.project, action.name, action.folder, lv, file.extension);

        if (!ret) return false;

        const key = mls.stor.getKeyToFiles(+action.project, lv, action.name, action.folder, file.extension);
        return !mls.stor.files[key];

    }

    private initObserverResize() {

        if (this.resizeObserver) this.resizeObserver.disconnect();
        this.resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentRect.width < 515) {
                    this.classList.add('breakContent');
                } else {
                    this.classList.remove('breakContent');
                }
            }
        });
        this.resizeObserver.observe(this);
    }

    private saveLocalStorageLastOpen(storFile: mls.stor.IFileInfo, position: 'left' | 'right') {
        let data: string & OpenedFileL2 = '';
        if (mls.actualLevel === 2) {
            data = {} as OpenedFileL2 & string;
            if (storFile.folder) data[position] = `_${storFile.project}_${storFile.folder}/${storFile.shortName}`;
            else data[position] = `_${storFile.project}_${storFile.shortName}`;
        } else {
            if (storFile.folder) data = `_${storFile.project}_${storFile.folder}/${storFile.shortName}`;
            else data = `_${storFile.project}_${storFile.shortName}`;
        }

        saveOpenedFile(storFile.project, mls.actualLevel, data);
    }

    private async delAllByFolders(files: mls.stor.IFileInfo[], label: string) {

        // Delete exactly the files shown for this folder group. Using the
        // displayed IFileInfo objects avoids re-matching by folder/project,
        // which failed when the display key carried a project prefix
        // (e.g. "100554/myFolder") or when filterProject !== actualProject.
        const all = (files || []).filter((f) => this.hiddenFiles ? true : f.extension === '.ts');

        if (all.length === 0) return;

        if (!window.confirm(`${this.msg.delete}: ${label} (${all.length})?`)) return;

        for await (const mfile of all) {

            if (!mfile) continue;

            if (this.hiddenFiles) {
                mfile.status = 'deleted';
            } else await deleteAllFiles(mfile);
        }

        this.closeAllMenus();
        this.changeList();

    }

    private loadLastPreference() {
        const m = this.getLastModeFilter();
        if (m) this.modeFilter = m;
    }

    private getLastModeFilter() {
        const js = localStorage.getItem('_100555_/l2/pluginExplore/pluginExploreList');
        let m = '';
        if (js) {
            try {
                const j = JSON.parse(js);
                m = j.modeFilter;
            } catch (e) {

            }
        }

        return m;
    }

    private setLastPreference() {
        const js = localStorage.getItem('_100555_/l2/pluginExplore/pluginExploreList');
        let j: any = {};
        if (js) {
            try {
                j = JSON.parse(js);

            } catch (e) {

            }
        }

        j.modeFilter = this.modeFilter;
        localStorage.setItem('_100555_/l2/pluginExplore/pluginExploreList', JSON.stringify(j));
    }

    private getPinTasks(): IPinTask[] {
        const js = localStorage.getItem('_100555_/l2/pluginExplore/pluginExploreList');
        if (!js) return [];
        try {
            const j = JSON.parse(js);
            return Array.isArray(j.pinTask) ? j.pinTask : [];
        } catch (e) {
            return [];
        }
    }

    private savePinTasks(pins: IPinTask[]) {
        const js = localStorage.getItem('_100555_/l2/pluginExplore/pluginExploreList');
        let j: any = {};
        if (js) {
            try {
                j = JSON.parse(js);
            } catch (e) {

            }
        }

        j.pinTask = pins;
        localStorage.setItem('_100555_/l2/pluginExplore/pluginExploreList', JSON.stringify(j));
        this.pinTasks = pins;
    }

}

type TModeExploreList = 'list' | 'addL1' | 'addL2' | 'addL3' | 'addL4';

type TQuickFilter = '' | 'error' | 'local' | 'outdated';

interface IPinTask {
    project: number,
    file: string,
    folder: string,
    desc: string,
    color: string
}