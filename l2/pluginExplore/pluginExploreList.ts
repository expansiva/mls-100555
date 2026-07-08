/// <mls fileReference="_100555_/l2/pluginExplore/pluginExploreList.ts" enhancement="_102027_/l2/enhancementLit" /> 

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
import '/_100555_/l2/pluginExplore/collabInputSearch.js';
import '/_100555_/l2/pluginExplore/mlsFileTree.js';

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
    allFiles: 'Todos os arquivos'
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
    allFiles: 'All files'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const pluginData: mls.plugin.IPluginData = {
    title: "List",
    getSvg(): TemplateResult {
        return svg`
     <svg height="22px" width="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
    `;
    }
};

@customElement('plugin-explore--plugin-explore-list-100555')
export class PluginExploreList extends PluginBaseModule {

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

    @property() modeView: number = 0; // 0: alphabetical; 1: folder

    @property() hiddenFiles: boolean = false;

    @property() errorAux: string = '';

    @property({ type: Array }) files: mls.stor.IFileInfo[] = [];

    @property({ type: Array }) history: mls.stor.IFileInfo[] = [];

    @state() modeFilter: string | undefined;

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

        return html`
            <div class="contentServiceList scroll-custom">
                ${this.renderHeader()}
                <ul>
                    ${this.renderHistory()}
                    ${this.modeView === 1 ? this.renderFolder() : this.renderList()}
                </ul>
            </div>
        `
    }

    renderHeader() {

        let auxV = '';
        let auxE = '';
        let auxS = '';

        if (this.info.version > 0) {

            auxV = `<b>[${this.info.version}]</b> <span class="fa fa-unbalanced"></span> <b>${this.msg.filesChangedOnTheServer}, </b>`;
        }

        if (this.info.error > 0) {

            auxE = `<b>[${this.info.error}]</b> <span class="fa fa-bug"></span><b>${this.msg.filesWithErrors},</b>`;
        }

        if (this.info.storage > 0) {

            auxS = `<b>[${this.info.storage}]</b> <span class="fa fa-location-dot"></span> <b>${this.msg.filesInLocalStorage}.</b>`;
        }

        return html`
        <div class="groupHeader">
            <header class="toolbar"> 
                <div class="toolbar__left">
                    <plugin-explore--collab-input-search-100555 @input="${this.filterLiChange}"> </plugin-explore--collab-input-search-100555>
                    <div class="toolbar__radio-group">
                        <select @change=${this.changeSelectProject} .value="${this.filterProject}">
                            ${this.myDep.map((p) => html`<option value="${p}" ?selected=${this.filterProject === p}>${p}</option>`)}
                            <option value="0">${this.msg.localProject}</option>
                        </select>
                        <select @change=${this.changeHiddenFiles} .value="${this.modeFilter}">
                            <option value="comp">${this.msg.components}</option>
                            <option value="other">${this.msg.others}</option>
                            <option value="all">${this.msg.allFiles}</option>
                        </select>
                        <select @change=${this.changeModeOrder} .value="${this.modeView}">
                            <option value="0">${this.msg.orderName}</option>
                            <option value="1">${this.msg.orderFolder}</option>
                        </select>

                        <button class="toolbar__add-button" title="new file" @click="${this.showAdd}">+</button>
                        
                    </div>

                </div>

                <div class="toolbar__center">
                    
                </div>
            </header>
            <div class="groupInfo">
                <span style="margin-right:10px">
                    [${this.info.tot}]
				    <span class="fa fa-file"></span> 
                    ${this.msg.totalFiles}
                </span>
                ${auxV ? html`<span .innerHTML="${auxV}" style="margin-right:10px"></span>` : ''}
                ${auxE ? html`<span .innerHTML="${auxE}" style="margin-right:10px"></span>` : ''}
                ${auxS ? html`<span .innerHTML="${auxS}" style="margin-right:10px"></span>` : ''}
            </div>
        </div>
        `
    }

    renderHistory() {

        if (this.modeFilter === 'all' && this.filterProject > 0) {
            return html``;
        }

        return html`
            ${this.history.length <= 0 ? '' :
                html`
                    <li class="headerTitle">
                        ${+this.filterProject === 0 ? `${this.msg.history} (All Projects)` : `${this.msg.history}`}
                    </li>
                    ${repeat(
                    this.history,
                    ((item: mls.stor.IFileInfo) => 'h_' + item.project + '_' + item.shortName + '_' + item.folder) as any,
                    ((file: mls.stor.IFileInfo, index: any) => this.renderLiItem(file, index, true)) as any
                )}
                `
            }
        `;
    }

    renderList() {

        if (this.modeFilter === 'all' && this.filterProject > 0) {
            return html`<plugin-explore--mls-file-tree-100555 project="${this.filterProject}" position="${this.position}" filter="${this.searchTerm}"></plugin-explore--mls-file-tree-100555>`
        }

        let letterInit = '';
        return html`
            ${this.files.length <= 0 ? '' :
                html`
                    ${repeat(
                    this.files,
                    ((item: mls.stor.IFileInfo) => item.project + '_' + item.shortName + '_' + item.folder) as any,
                    ((file: mls.stor.IFileInfo, index: any) => {

                        if (letterInit !== file.shortName.charAt(0).toUpperCase()) {

                            letterInit = file.shortName.charAt(0).toUpperCase();

                            return html`
                                    <li class="headerTitle">${letterInit} </li>
                                    ${this.renderLiItem(file, index, false)}
                                `
                        }

                        return this.renderLiItem(file, index, false)

                    }) as any
                )}
                `
            }
        `;
    }

    renderFolder() {

        const folders: Record<string, mls.stor.IFileInfo[]> = {};
        this.files.forEach((f) => {
            let folder = f.folder;
            let aux = this.filterProject === 0 ? f.project + '/' : '';
            if (!f.folder) folder = 'root';

            const keyFolder = aux + folder;
            if (folders[keyFolder]) folders[keyFolder].push(f);
            else folders[keyFolder] = [f];
        });
        let keys = Object.keys(folders).sort();

        if (keys.length <= 0) return html``;

        return html`
        ${repeat(keys, ((item: string) => item) as any, ((key: string, index: any) => {

            return html`
                <li class="headerTitle" style="display:flex; justify-content: space-between;">${key} 
                
                    <span style="cursor:pointer; display:flex; position:relative; z-index:1;" title="delete all this folder" @click=${(e: MouseEvent) => { e.stopPropagation(); e.preventDefault(); this.delAllByFolders(folders[key], key); }}><svg xmlns="http://www.w3.org/2000/svg" style="width:15px; pointer-events:none;" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/></svg></span>
                </li>
                ${this.renderFolder2(folders[key])}
            `
        }) as any
        )}`


    }

    renderFolder2(files: mls.stor.IFileInfo[]) {

        return html`
            ${files.length <= 0 ? '' :
                html`
                    ${repeat(
                    files,
                    ((item: mls.stor.IFileInfo) => item.project + '_' + item.shortName + '_' + item.folder) as any,
                    ((file: mls.stor.IFileInfo, index: any) => {

                        return this.renderLiItem(file, index, false)

                    }) as any
                )}
                `
            }
        `;
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
        const nameFilter = inHistory
            ? '*******'
            : `${file.folder ? file.folder + '/' : ''}${file.shortName}${file.extension}`.toLocaleLowerCase();

        let auxVersion = '';
        let auxStorage = '';
        let auxBug = '';
        let auxHtml = '';

        const keyHtml = mls.stor.getKeyToFiles(file.project, file.level, file.shortName, file.folder, '.html');
        const keyStyle = mls.stor.getKeyToFiles(file.project, file.level, file.shortName, file.folder, '.less');
        const keyTest = mls.stor.getKeyToFiles(file.project, file.level, file.shortName, file.folder, '.test.ts');
        const defsTest = mls.stor.getKeyToFiles(file.project, file.level, file.shortName, file.folder, '.defs.ts');

        const styleFile = mls.stor.files[keyStyle];
        const htmlFile = mls.stor.files[keyHtml];
        const testFile = mls.stor.files[keyTest];
        const defsFile = mls.stor.files[defsTest];

        const htmlError = htmlFile && htmlFile.hasError;
        const styleError = styleFile && styleFile.hasError;
        const testError = testFile && testFile.hasError;
        const defsError = defsFile && defsFile.hasError;


        const titleLocalStorage = this.getTitleInLocalStorage(file, htmlFile, styleFile, testFile, defsFile);
        if (titleLocalStorage) {
            auxStorage = `<span title=" ${titleLocalStorage} in localstorage" class="fa fa-location-dot" style="color:lightskyblue; height: 14px; display: flex; justify-content: center; align-items: center;"></span>`
        }

        if (file.hasError || styleError || htmlError || testError || defsError) {
            auxBug = `<span title="bug" class="fa fa-bug" style="color:rgb(169, 3, 3); height: 14px; display: flex; justify-content: center; align-items: center;"></span>`
        }

        if (file.isLocalVersionOutdated) {
            auxVersion = `<span title="need conciliation" class="fa fa-unbalanced" style="color:orange; height: 14px; display: flex; justify-content: center; align-items: center;"></span>`
        }

        const style = this.inFilter && inHistory ? 'display:none' : '';
        const actualL2 = (mls.actual[2] as any)[this.position]?.shortName;
        const actualL2Folder = (mls.actual[2] as any)[this.position]?.folder;

        const validProject = this.filterProject === 0 && mls.actualProject !== file.project && file.project !== 0 ? false : true;

        let auxValidProject = '';

        return html`
            <li @click="${this.clickOptOpen}" class="${file.shortName === actualL2 && file.folder === actualL2Folder ? 'selected' : ''}" style="${style}${auxValidProject}" .myFile=${file} .nameFilter="${nameFilter}" ?disabled=${!validProject}>
                <div class="elContent">
                    <info-item>
                        <span class="classClick" @click="${this.clickGroupHidden}">
                           <span class="groupHiddenListIcon" >
                               <svg xmlns='http://www.w3.org/2000/svg' style='height: 21px;' viewBox='0 0 128 512' ><path style='fill:var(--text-primary-color)' d='M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z' fill='rgb(66,65,65,1)'/></svg>
                           </span>
                       </span>
                        </span>
                        <span class="spanFileName ${file.status === 'deleted' ? 'fileDeleted' : ''}">${name}</span>
                        <div style="display:flex; gap:.5rem" .innerHTML="${auxStorage + auxBug + auxVersion + auxHtml}"></div>
                    </info-item>
                    <div class="groupHiddenList">
                        <span class="mls-gpbtnslider-item" title="${this.msg.undo}" @click="${this.clickOptUndo}"><span class="fa fa-undo"></span> Undo</span>
                        <span class="mls-gpbtnslider-item" title="${this.msg.clone}" @click="${this.clickOptClone}" style="display:${this.hiddenFiles ? 'none' : ''}"><span class=" fa fa-clone"></span> Clone</span>
                        <span class="mls-gpbtnslider-item" title="${this.msg.rename}" @click="${this.clickOptRename}" style="display:${this.hiddenFiles ? 'none' : ''}"><span class=" fa fa-file-pen"></span> Rename</span>
                        <span class="mls-gpbtnslider-item" title="${this.msg.delete}" @click="${this.clickOptDel}"><span class=" fa fa-trash"></span> Delete</span>
                        <span class="mls-gpbtnslider-item" title="${this.msg.security}" @click="${this.clickOptOpenSecurity}" style="display:${this.hiddenFiles ? 'none' : ''}"><span class=" fa-solid fa-shield-halved"></span> Security</span> 
                    </div>
                    
                </div>
            </li>
        `;

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
        const all = this.querySelectorAll('.activegpbtnslider');
        Array.from(all).forEach((i) => i.classList.remove('activegpbtnslider'));
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

        if (this.modeView === 1) spanFileName.innerText = mfile.folder ? mfile.folder + '/' + mfile.shortName : mfile.shortName;

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
            htmlText: '<plugin-view-file-100554 nameFile="' + key + '"></plugin-view-file-100554>'
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
        readProjectTypescriptAndCompile(mls.actualProject as number, '', true);
        readProjectTypescriptAndCompileL1(mls.actualProject as number, '', true);
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

    private clickGroupHidden(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        const father = el.closest('li');
        if (!father)
            return;
        const target = father.querySelector('.groupHiddenList');
        if (!target)
            return;
        target.classList.toggle('activegpbtnslider');


    }

    private async changeSelectProject(e: any) {

        this.info.tot = 0;
        this.info.version = 0;
        this.info.storage = 0;
        this.info.error = 0;
        this.filterProject = +e.target.value;
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

    private async changeModeOrder(e: any) {
        this.modeView = e.target.value === '0' ? 0 : 1;
        this.filterByLevel[mls.actualLevel] = { prj: this.filterProject, group: this.modeView };
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
                const tree = this.querySelector('plugin-explore--mls-file-tree-100555') as any;
                if (tree) tree.filter = this.searchTerm;
                return;
            }

            const contentServiceList = el.closest('.contentServiceList');
            if (!contentServiceList) return;

            const all = contentServiceList.querySelectorAll('li');
            all.forEach((li: any) => {

                const name = li.nameFilter ? li.nameFilter : '******';
                const inp = el.value.toLocaleLowerCase();

                if (name.indexOf(inp) >= 0 || li.classList.contains('folder')) {
                    li.style.display = '';
                } else {
                    li.style.display = 'none';
                }
            });

        }, 500);

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

}

type TModeExploreList = 'list' | 'addL1' | 'addL2' | 'addL3' | 'addL4';