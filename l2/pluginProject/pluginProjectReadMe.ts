/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectReadMe.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, css, svg, TemplateResult } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
import { CollabEditMd } from '/_100555_/l2/utils/collabEditMd.js';

export const pluginData: mls.plugin.IPluginData = {
    title: "README.md",
    getSvg(): TemplateResult {
        return svg`
     <svg  height="22px" width="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M528.3 46.5H388.5c-48.1 0-89.9 33.3-100.4 80.3-10.6-47-52.3-80.3-100.4-80.3H48c-26.5 0-48 21.5-48 48v245.8c0 26.5 21.5 48 48 48h89.7c102.2 0 132.7 24.4 147.3 75 .7 2.8 5.2 2.8 6 0 14.7-50.6 45.2-75 147.3-75H528c26.5 0 48-21.5 48-48V94.6c0-26.4-21.3-47.9-47.7-48.1zM242 311.9c0 1.9-1.5 3.5-3.5 3.5H78.2c-1.9 0-3.5-1.5-3.5-3.5V289c0-1.9 1.5-3.5 3.5-3.5h160.4c1.9 0 3.5 1.5 3.5 3.5v22.9zm0-60.9c0 1.9-1.5 3.5-3.5 3.5H78.2c-1.9 0-3.5-1.5-3.5-3.5v-22.9c0-1.9 1.5-3.5 3.5-3.5h160.4c1.9 0 3.5 1.5 3.5 3.5V251zm0-60.9c0 1.9-1.5 3.5-3.5 3.5H78.2c-1.9 0-3.5-1.5-3.5-3.5v-22.9c0-1.9 1.5-3.5 3.5-3.5h160.4c1.9 0 3.5 1.5 3.5 3.5v22.9zm259.3 121.7c0 1.9-1.5 3.5-3.5 3.5H337.5c-1.9 0-3.5-1.5-3.5-3.5v-22.9c0-1.9 1.5-3.5 3.5-3.5h160.4c1.9 0 3.5 1.5 3.5 3.5v22.9zm0-60.9c0 1.9-1.5 3.5-3.5 3.5H337.5c-1.9 0-3.5-1.5-3.5-3.5V228c0-1.9 1.5-3.5 3.5-3.5h160.4c1.9 0 3.5 1.5 3.5 3.5v22.9zm0-60.9c0 1.9-1.5 3.5-3.5 3.5H337.5c-1.9 0-3.5-1.5-3.5-3.5v-22.8c0-1.9 1.5-3.5 3.5-3.5h160.4c1.9 0 3.5 1.5 3.5 3.5V190z"/></svg>
    `;
    }
};

@customElement('plugin-project--plugin-project-read-me-100555')
export class PluginProjectReadMe extends PluginBaseModule {

    @property({ type: Boolean }) autoPrepare: boolean = false;

    @query('.plugin-body') body: HTMLDivElement | undefined;

    @query('collab-edit-md-100554') mkEditor: CollabEditMd | undefined;

    async prepare() {
        await import('/_100555_/l2/utils/collabEditMd.js');
        this.setReadme();
    }

    firstUpdated() {
        if (!this.body || !this.autoPrepare) return;
        this.prepare();
    }

    render(): TemplateResult {
        this.style.display = 'block';
        this.style.width = '100%';
        this.style.height = '100%';
        if (this.scope !== "dashboard") return html``;
        return html`
            <div class="plugin-container">
                ${this.renderHeader()}
                ${this.renderBody()}
            </div>
        `;
    }

    renderHeader(): TemplateResult {
        return html`
            <header>
                <div>
                    <div>${pluginData.getSvg()}</div>
                    <h2>${pluginData.title}</h2>
                </div>
            </header>
        `;
    }

    renderBody(): TemplateResult {
        return html`<div class="plugin-body">${this.renderReadme()}</div>`;
    }

    private renderReadme() {
        return html`
            <div class="details-card">
                <div>
                    <collab-edit-md-100554></collab-edit-md-100554>
                </div>
            </div>
        `
    }

    private async setReadme() {

        const project = mls.actualProject;
        if (!project) {
            return;
        }
        const fileName = 'README';
        const keyToFilePackage = mls.stor.getKeyToFiles(project, 0, fileName, '', '.md');
        let file = mls.stor.files[keyToFilePackage];
        if (!file) {
            const content = `ReadMe: ${project}`;
            file = await this.createFile(fileName, '.md', '', content);
        }

        const res = await file.getContent();
        if (typeof res !== 'string') return;
        if (!this.mkEditor) return;

        customElements.whenDefined('collab-edit-md-100554').then(() => {
            if (!this.mkEditor) return;
            this.mkEditor.cbFinishEdit = this.onChangeMd.bind(this);
            this.mkEditor.setAttribute('value', res);
        });

    }

    private async onChangeMd() {

        const project = mls.actualProject;
        if (!project) return;
        const fileName = 'README';
        if (!this.mkEditor) return;
        const content = this.mkEditor.text;
        const keyToFilePackage = mls.stor.getKeyToFiles(project, 0, fileName, '', '.md');
        let file = mls.stor.files[keyToFilePackage];
        if (!file) return;
        const fileInfo: mls.stor.IFileInfoValue = {
            content,
            contentType: 'string',
        };
        await mls.stor.localStor.setContent(file, fileInfo);

    }

    private async createFile(shortName: string, extension: string, folder: string, content: string): Promise<mls.stor.IFileInfo> {

        const project = mls.actualProject;
        if (!project) throw new Error('Invalid project');
        const params = {
            project,
            level: 0,
            shortName,
            extension,
            versionRef: '0',
            folder
        };

        const file = await mls.stor.addOrUpdateFile(params);
        if (!file) throw new Error('Error on create new file');

        file.status = 'new';
        file.getValueInfo = () => this._getValueInfo(file);
        const contentType = typeof content === 'string' ? 'string' : 'blob';
        const fileInfo: mls.stor.IFileInfoValue = {
            content,
            contentType,
        };
        await mls.stor.localStor.setContent(file, fileInfo);
        return file;
    }

    public async _getValueInfo(
        file: mls.stor.IFileInfo,
        originalShortName?: string,
        originalFolder?: string,
        originalProject?: number,
        originalCRC?: string,
    ): Promise<mls.stor.IFileInfoValue> {

        file.inLocalStorage = file.status !== 'nochange';
        const content = await file.getContent();
        const contentType = typeof content === 'string' ? 'string' : 'blob';
        const obj: mls.stor.IFileInfoValue = {
            content,
            contentType,
            originalShortName,
            originalFolder,
            originalProject,
            originalCRC,
        };
        return obj;
    }

    static styles = css`
        :host {
            font-family: @font-family-primary;
            display: block;
            height: calc(100% - 55px);
            overflow: auto;
            background: @surface-bg;
            font-size: @font-size-16;
        }

        .plugin-body{
            height:100%;
            width: -webkit-fill-available;
            padding:1rem;
            overflow:hidden;
        }
        .plugin-container {
            padding: 10px 0;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            height:100%;
            width:100%;
        }

        header {
            margin-left: 16px;
        }
        
        header > div{
            display:flex;
            gap:.5rem;
        }
        icon {
            margin-right: 10px;
        }

        h2 {
            font-size: 18px;
            font-weight: bold;
            margin: 0;
            color: #333;
        }


    `;


}
