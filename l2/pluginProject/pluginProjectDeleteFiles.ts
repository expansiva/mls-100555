/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectDeleteFiles.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, svg, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
import { getListNewFilesToDeleteByFolder, deleteAllFilesLocal } from '/_102027_/l2/libCommom.js';
import { removeModule } from '/_100555_/l2/utils/projectAST.js';
import { removeTokensTheme } from '/_102027_/l2/designSystemBase.js';

/// **collab_i18n_start**
const message_pt = {
    btnSearch: 'Pesquisar',
    btnDelete: 'Deletar',
    lblSearch: 'Caminho do modulo:',
    lblChoice: 'Selecionar tipo de arquivo:',
    lblTotal: 'Total arquivos encontrados:',
}

const message_en = {
    btnSearch: 'Search',
    btnDelete: 'Delete',
    lblSearch: 'Module path:',
    lblChoice: 'Select file type:',
    lblTotal: 'Total files found:',
};

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'pt': message_pt,
    'en': message_en
}
/// **collab_i18n_end**

@customElement('plugin-project--plugin-project-delete-files-100555')
export class PluginProjectDeleteFiles extends PluginBaseModule {

    private msg: MessageType = messages['en'];

    @state() groupName: string = '';
    @state() filesToDelete: mls.stor.IFileInfo[] = [];
    selectedFiles = new Map<string, mls.stor.IFileInfo>();
    @state() logs: string[] = [];


    render(): TemplateResult {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
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

    async updated(changedProperties: Map<PropertyKey, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('filesToDelete')) {
            this.selectedFiles = new Map(
                this.filesToDelete.map(file => [this.getFileKey(file), file])
            );
        }
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
        return html`
            <div class="body">
                <div style="margin-top: 10px;">
                    <label for="searchText">${this.msg.lblSearch}</label>
                    <input
                        .value=${this.groupName} 
                        @input=${(e: KeyboardEvent) => this.groupName = (e.target as HTMLInputElement).value} 
                        name="searchText" type="text" />

                    <div>
                        <button @click="${this.onSearch}">${this.msg.btnSearch}</button>
                        ${this.filesToDelete.length > 0 ? html`<button @click="${this.onDelete}">${this.msg.btnDelete}</button>` : ''}
                    </div>
                

                </div>

                <p>${this.msg.lblTotal} ${this.filesToDelete.length}</p>
                <ul>
                    ${this.filesToDelete
                .slice()
                .sort((a, b) => a.shortName.localeCompare(b.shortName))
                .map(file => {
                    const fileKey = this.getFileKey(file);
                    return html`
                            <li>
                            <label>
                                <input 
                                type="checkbox"
                                .checked=${this.selectedFiles.has(fileKey)}
                                @change=${(e: Event) => {
                            const checked = (e.target as HTMLInputElement).checked;
                            if (checked) {
                                this.selectedFiles.set(fileKey, file);
                            } else {
                                this.selectedFiles.delete(fileKey);
                            }
                            this.requestUpdate();
                        }}
                                />
                                ${fileKey}
                            </label>
                            </li>
                        `;
                })}
                </ul>

                ${this.logs.length > 0 ?
                html`<ul class="logs">
                        <pre>
                            ${this.logs.map((log) => html`<li>${log}</li>`)}
                        </pre>
                    </ul>`
                : ''
            }

                    
            </div>
        `;
    }

    private getFileKey(file: mls.stor.IFileInfo): string {
        return file.folder ? `_${file.project}_${file.folder}/${file.shortName}${file.extension}` : `_${file.project}_${file.shortName}${file.extension}`;
    }

    private clear() {
        this.logs = [];
        this.selectedFiles.clear();
        this.filesToDelete = [];
    }

    async onSearch() {
        this.clear();
        const project = mls.actualProject;
        if (!project) {
            this.logs.push('No project selected');
            return;
        }
        this.filesToDelete = await getListNewFilesToDeleteByFolder(project, this.groupName, true);
        this.selectedFiles = new Map(
            this.filesToDelete.map(file => [this.getFileKey(file), file])
        );
    }

    async onDelete() {
        const files: mls.stor.IFileInfo[] = Array.from(this.selectedFiles.values());
        this.filesToDelete = [];
        const project = mls.actualProject;
        if (!project) {
            this.logs.push('No project selected');
            return;
        }
        for await (const log of deleteAllFilesLocal(files)) {
            this.logs.push(log);
            this.requestUpdate();
        }


        await this.removeThemeFromDesignSystem(this.groupName, project);
        await this.removeModuleFromProjectFile(this.groupName, project);
        this.logs.push('All files removed');
        const key = mls.stor.getKeyToFiles(100554, 2, 'pluginProjectDeleteFiles', '', '.ts');
        const storFile = mls.stor.files[key];
        mls.events.fireFileAction('statusOrErrorChanged', storFile, 'left');
        this.requestUpdate();

    }



    private async removeThemeFromDesignSystem(moduleName: string, project: number) {
        const shortName = 'designSystem';
        const folder = '';
        const key = mls.stor.getKeyToFiles(project, 2, shortName, folder, '.ts');
        const keyModels = mls.editor.getKeyModel(project, shortName, folder, 2)
        const storFile = mls.stor.files[key];
        const models = mls.editor.models[keyModels];
        if (!storFile || !models || !models.ts) return;
        await removeTokensTheme(project, moduleName);
        this.logs.push('Theme removed from designSystem.ts');
    }

    private async removeModuleFromProjectFile(moduleName: string, project: number) {
        await removeModule(project, moduleName);
        this.logs.push('Modules removed from modules.ts');
    }


}

export const pluginData: mls.plugin.IPluginData = {
    title: "Delete local files",
    getSvg(): TemplateResult {
        return svg`
    <?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 114.066 122.881" enable-background="new 0 0 114.066 122.881" xml:space="preserve"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M65.959,67.42h38.739c5.154,0,9.368,4.219,9.368,9.367v36.725 c0,5.154-4.221,9.369-9.368,9.369H65.959c-5.154,0-9.369-4.215-9.369-9.369V76.787C56.59,71.639,60.805,67.42,65.959,67.42 L65.959,67.42L65.959,67.42z M20.463,67.578c-1.494,0-2.74-1.352-2.74-2.988c0-1.672,1.209-2.989,2.74-2.989H43.88 c1.494,0,2.74,1.353,2.74,2.989c0,1.672-1.21,2.988-2.74,2.988H20.463L20.463,67.578L20.463,67.578z M87.795,18.186h9.822 c1.923,0,3.703,0.783,4.947,2.063c1.281,1.281,2.064,3.025,2.064,4.947v33.183h-6.051V25.196c0-0.285-0.107-0.533-0.284-0.711 c-0.179-0.178-0.427-0.285-0.712-0.285H87.76v34.18h-6.014V7.011c0-0.285-0.107-0.534-0.284-0.711 c-0.179-0.178-0.429-0.285-0.713-0.285H6.976c-0.285,0-0.535,0.106-0.712,0.285C6.085,6.478,5.979,6.726,5.979,7.011v83.348 c0,0.285,0.107,0.533,0.285,0.711c0.178,0.178,0.427,0.285,0.711,0.285h38.871v6.014H22.812v11.174 c0,0.285,0.107,0.535,0.285,0.713c0.177,0.176,0.427,0.285,0.711,0.285l22.038-0.002v6.014H23.844 c-1.921,0-3.701-0.783-4.946-2.064c-1.281-1.279-2.065-3.023-2.065-4.947V97.369H7.011c-1.922,0-3.701-0.785-4.946-2.064 C0.783,94.023,0,92.279,0,90.357V7.011C0,5.089,0.783,3.31,2.064,2.064C3.345,0.783,5.089,0,7.011,0h73.774 c1.921,0,3.701,0.783,4.947,2.063c1.28,1.282,2.063,3.025,2.063,4.947V18.186L87.795,18.186L87.795,18.186L87.795,18.186z M20.428,28.647c-1.495,0-2.74-1.353-2.74-2.99c0-1.672,1.21-2.989,2.74-2.989l46.833,0c1.495,0,2.739,1.353,2.739,2.989 c0,1.672-1.208,2.99-2.739,2.99L20.428,28.647L20.428,28.647L20.428,28.647z M20.428,48.114c-1.495,0-2.74-1.353-2.74-2.989 c0-1.672,1.21-2.989,2.74-2.989l46.833,0c1.495,0,2.739,1.352,2.739,2.989c0,1.672-1.208,2.989-2.739,2.989L20.428,48.114 L20.428,48.114L20.428,48.114z M73.868,98.787c-2.006,0-3.634-1.627-3.634-3.635c0-2.006,1.628-3.633,3.634-3.633 c13.891,0,9.023,0,22.92,0c2.007,0,3.635,1.627,3.635,3.633c0,2.008-1.628,3.635-3.635,3.635 C82.897,98.787,87.766,98.787,73.868,98.787L73.868,98.787L73.868,98.787z"/></g></svg>
    `;
    }
};