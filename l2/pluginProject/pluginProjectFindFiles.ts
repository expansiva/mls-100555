/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectFindFiles.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, svg, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
import { MindMapData } from '/_102027_/l2/libMindMap.js'
import '/_100554_/l2/widgetMindMapL4.js';

/// **collab_i18n_start**
const message_pt = {
    btnSearch: 'Pesquisar',
    lblSearch: 'Texto a pesquisar (texto ou regex):',
    lblChoice: 'Selecionar tipo de arquivo:',
    lblPrj: 'Selecionar o projeto:',
    lblTotal: 'Total arquivos encontrados:',
}

const message_en = {
    btnSearch: 'Search',
    lblSearch: 'Text to search (text or regex):',
    lblChoice: 'Select file type:',
    lblPrj: 'Select project:',
    lblTotal: 'Total files found:',
};

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'pt': message_pt,
    'en': message_en
}
/// **collab_i18n_end**

@customElement('plugin-project--plugin-project-find-files-100555')
export class PluginProjectFindFiles extends PluginBaseModule {

    private msg: MessageType = messages['en'];
    private matchedFiles: string[] = [];
    private usingRegex: boolean = false;
    private progressValue: number = 0;

    @property() mode: 'list' | 'map' = 'list';
    @property({ type: String }) dataJson: MindMapData | undefined;

    async updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        const propMode = changedProperties.get('mode');
        if (propMode) {
            this.dataJson = undefined;
            this.configMode();
        }
    }

    render(): TemplateResult {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        if (this.scope !== "dashboard") return html``;
        return html`
            <div class="plugin-container">
                ${this.renderHeader()}
                ${this.renderBody()}
                ${this.mode === 'list' ? this.renderList() : this.renderMap()}
            </div>
        `;
    }

    renderHeader(): TemplateResult {
        return html`
            <header>
                <span class="svg-container">${pluginData.getSvg()}</span>
                <span>${pluginData.title}</span>
            </header>
        `;
    }

    renderBody(): TemplateResult {
        const projects = [
            mls.actualProject as number,
            ...mls.l5.getProjectDependencies(mls.actualProject || 0, false) || []
        ];

        return html`
            <div class="body">
                <div class="form-group" style="width:15%; min-width:140px">
                    <label for="filterProject">${this.msg.lblPrj}</label>
                    <select name="filterProject">
                        ${repeat(
                            projects,
                            (project:number) => project,
                            (project:number) => html` <option value="${project}"> ${project} </option> ` )}
                    </select>
                </div>

                <div class="form-group" style="width:15%; min-width:140px">
                    <label for="fileType">${this.msg.lblChoice}</label>
                    <select name="fileType">
                        <option value=".ts">.ts - typescript</option>
                        <option value=".html">.html - page</option>
                        <option value=".less">.less - style</option>
                    </select>
                </div>
                
                <div class="form-group" style="width:35%; min-width:200px">
                    <label for="searchText">${this.msg.lblSearch}</label>
                    <input name="searchText" type="text"  autocomplete="off"/>     
                </div>
                <div class="view-toggle">
                    <button class="btn is-active" @click=${this.changeMode} mode="list" data-view="list" title="List view">
                        <!-- Ícone lista -->
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>

                    <button class="btn" data-view="mindmap" @click=${this.changeMode} mode="map" title="Mindmap view">
                        <!-- Ícone mindmap -->
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="6" r="2" fill="currentColor"/>
                        <circle cx="6" cy="18" r="2" fill="currentColor"/>
                        <circle cx="18" cy="18" r="2" fill="currentColor"/>
                        <path d="M12 8v4M10 14l-4 2M14 14l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                <button @click="${this.onSearch}" class="btn-primary"  style="width:10%; min-width:80px">${this.msg.btnSearch}</button>
            </div>
            <div class="progress-section">
                <progress value="${this.progressValue}" max="100"></progress>
                <p class="result-info">${this.msg.lblTotal} ${this.matchedFiles.length}, regex:${this.usingRegex}</p>
            </div>
        `;
    }

    renderList() {
        return html`

            <ul class="results-list">
                ${this.matchedFiles.slice().sort((a, b) => a.localeCompare(b)).map(file => html`<li @click="${this.openFile}">${file}</li>`)}
            </ul>
        `
    }

    renderMap() {
        if (!this.dataJson) return html``;
        return html`<widget-mind-map-l4-100554 .mapState=${this.dataJson} showbreadcrumb="off"></widget-mind-map-l4-100554>`
    }

    async onSearch() {
        const fileType = (this.querySelector('[name="fileType"]') as HTMLSelectElement).value;
        const searchText = (this.querySelector('[name="searchText"]') as HTMLInputElement).value;
        const project = +(this.querySelector('[name="filterProject"]') as HTMLSelectElement).value;
        const files = Object.entries(mls.stor.files)
            .filter(([, file]) => file.project === project && file.extension === fileType)
            .map(([key]) => key);
        await this.searchFiles(files, searchText);
    }

    async searchFiles(files: string[], searchText: string) {
        this.matchedFiles = [];
        this.progressValue = 0;
        let filesProcessed = 0;

        let regex: RegExp | null = null;
        this.usingRegex = false;
        try {
            if (searchText.startsWith('/') && searchText.endsWith('/')) {
                const pattern = searchText.slice(1, -1);
                regex = new RegExp(pattern);
                this.usingRegex = true;
            } else {
                regex = null;
            }
        } catch {
            regex = null;
        }

        const promises = files.map(async (file) => {
            const fileContent: string | Blob | null = await mls.stor.files[file].getContent("");
            if (typeof fileContent === 'string') {
                const lines = fileContent.split('\n');
                const found = lines.some(line => {
                    if (regex) {
                        return regex.test(line);
                    } else {
                        return line.includes(searchText);
                    }
                });
                if (found) {
                    this.matchedFiles.push(file);
                }
            }
            filesProcessed++;
            this.progressValue = (filesProcessed / files.length) * 100;
            this.requestUpdate();
        });

        await Promise.all(promises);
    }

    changeMode(e: MouseEvent) {
        const el = e.target as HTMLElement;
        if (!el) return;

        const father = el.closest('.view-toggle');
        if (!father) return;

        const remove = father.querySelector('.is-active')
        const add = document.querySelector('.btn:not(.is-active)');
        if (!remove || !add) return;
        remove.classList.remove('is-active');
        add.classList.add('is-active');

        this.mode = add.getAttribute('mode') as any | 'list';
    }

    configMode() {
        const center = 'findFiles'
        const js = {
            current: center,
            nodes: [] as any[]
        }

        const main = {
            id: center,
            label: "Find Files",
            type: "findFile",
            meta: {
                fileKey: "findFiles"
            },
            related: [] as any[]
        }

        js.nodes.push(main);

        this.matchedFiles.slice().sort((a, b) => a.localeCompare(b)).forEach((i) => {

            if (!mls.stor.files[i]) return;
            const id = center + '_' + i;
            main.related.push(id);

            const item = {
                id,
                label: mls.stor.convertFileToFileReference(mls.stor.files[i]),
                type: "findFile_item",
                related: [],
                meta: {
                    fileKey: "findFiles"
                },
                navigate: true
            }

            js.nodes.push(item);
        });


        this.dataJson = js;

    }


    openFile(e: MouseEvent) {

        const el = e.target as HTMLElement;
        if (!el) return;

        const li = el.closest('li');
        if (!li) return;

        const key = li.innerText;

        const f = mls.stor.files[key];
        if (!f) return;

        this.fireEvents('open', f);
    }


    async fireEvents(action: string, file: mls.stor.IFileInfo, timeout: number = 0) {

        try {

            const params = {} as mls.events.IFileAction;

            await file.getOrCreateModel();

            (params.action as any) = action;
            params.level = file.level;
            params.project = file.project;
            params.shortName = file.shortName;
            params.extension = file.extension;
            params.folder = file.folder;
            params.position = 'left';

            if (['open'].includes(action)) {

                let name = `_${file.project}_${file.shortName}`;
                if (file.folder) name = `_${file.project}_${file.folder}/${file.shortName}`;
                mls.actual[2].setFullName(name);
                mls.actual[2]['left'] = file

            }

            mls.events.fire([mls.actualLevel], ['FileAction'], JSON.stringify(params), timeout);

        } catch (err: any) {

        }

    }

}

export const pluginData: mls.plugin.IPluginData = {
    title: "Find in Files",
    getSvg(): TemplateResult {
        return svg`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110.94 122.88"><title>lookup</title><path fill="currentColor" d="M19.26,40.53a2.74,2.74,0,0,1-2.59-2.82,2.69,2.69,0,0,1,2.59-2.82H63.41A2.72,2.72,0,0,1,66,37.71a2.68,2.68,0,0,1-2.58,2.82ZM79.41,66a24.82,24.82,0,0,1,20.78,38.41l10.75,11.71-7.42,6.77-10.36-11.4A24.82,24.82,0,1,1,79.41,66Zm13.2,11.62a18.66,18.66,0,1,0,5.47,13.2,18.66,18.66,0,0,0-5.47-13.2Zm-73.32-22a2.73,2.73,0,0,1-2.58-2.82A2.68,2.68,0,0,1,19.29,50H41.37A2.74,2.74,0,0,1,44,52.84a2.68,2.68,0,0,1-2.58,2.82ZM82.76,17.14H92a6.64,6.64,0,0,1,6.61,6.61V55.18c-.2,2.07-5.27,2.1-5.7,0V23.75a.92.92,0,0,0-.94-.94H82.73V55.18c-.49,1.88-4.72,2.16-5.67,0V6.61a.92.92,0,0,0-.94-.94H6.58a1,1,0,0,0-.68.27,1,1,0,0,0-.26.67V85.18a1,1,0,0,0,.26.67,1,1,0,0,0,.68.27H43.36c2.86.29,3,5.23,0,5.67H21.5v10.53a.92.92,0,0,0,.94.94H43.36c2.07.23,2.74,4.94,0,5.67H22.48a6.62,6.62,0,0,1-6.61-6.61V91.79H6.61a6.49,6.49,0,0,1-4.66-2A6.56,6.56,0,0,1,0,85.18V6.61A6.49,6.49,0,0,1,2,2,6.55,6.55,0,0,1,6.61,0H76.16a6.51,6.51,0,0,1,4.66,2,6.54,6.54,0,0,1,1.94,4.66V17.14ZM19.26,25.4a2.74,2.74,0,0,1-2.59-2.82,2.69,2.69,0,0,1,2.59-2.82H63.41A2.73,2.73,0,0,1,66,22.58a2.69,2.69,0,0,1-2.58,2.82Z"/></svg>
    `;
    }
};