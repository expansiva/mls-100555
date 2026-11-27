/// <mls fileReference="_100555_/l2/pluginNewFile/pluginNewFileMd.ts" enhancement="_102027_/l2/enhancementLit"/>


import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { getMessageKey } from "/_102029_/l2/collabLitElement.js";
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { IDetails } from "/_100555_/l2/pluginNewFile/pluginNewFileBase.js";
import { createStorFile, IReqCreateStorFile } from "/_102027_/l2/libStor.js";
import { createModelAnyFile } from "/_102027_/l2/libModel.js";
import { ServiceBase } from '/_102027_/l2/serviceBase.js';
import '/_100555_/l2/pluginNewFile/widgetTextCode.js';

/// **collab_i18n_start**
const message_pt = {
    title: "Markdown",
    desc: "Criar um arquivo md em branco.",
    header: "Arquivo Markdown",
    subtitle: "Arquivo .md em branco, para documentação ou anotações.",
    btnCreate: "Criar arquivo",
    project: "Projeto",
    shortName: "Nome",
    folder: "Pasta",
    rootFolder: "(raiz)",
    willCreate: "Será criado",
    preview: "Prévia do código",
    loading: "Criando arquivo...",
    emptyName: "Digite um nome para o arquivo",
    error: "Nome do arquivo em branco ou invalido",
}

const message_en = {
    title: "Markdown",
    desc: "Create a blank md file.",
    header: "Markdown file",
    subtitle: "Blank .md file, for documentation or notes.",
    btnCreate: "Create file",
    project: "Project",
    shortName: "Name",
    folder: "Folder",
    rootFolder: "(root)",
    willCreate: "Will be created",
    preview: "Code preview",
    loading: "Creating file...",
    emptyName: "Type a name for the file",
    error: "Blank or invalid file name",
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

const lang = getMessageKey(messages);
let msg: MessageType = messages[lang];

export const details: IDetails = {
    title: msg.title,
    description: msg.desc,
    tags: ["md"],
}

@customElement('plugin-new-file--plugin-new-file-md-100555')
export class PluginNewFileMd extends StateLitElement {

    @propertyDataSource() shortName: string | undefined;

    @propertyDataSource() folder: string | undefined;

    @propertyDataSource({ attribute: true }) project: number | undefined;

    @property() position: 'left' | 'right' = 'left';

    @property() loading: boolean = false;

    private service = this.closest('service-detail-100554') as ServiceBase;

    private template: string = ``;

    private enhancement: string = `_100554_enhancementLit`;

    private groupName: string = `other`;

    private getTemplate(): string {

        const enhancement = '_blank';
        const folder = this.folder ? `${this.folder}/` : '';
        const name = `_${this.project}_/l2/${folder}${this.shortName}.md`
        return `/// <mls fileReference="${name}" enhancement="${enhancement}"/>\n${this.template}\n`
    }

    private async handleAddFile() {
        if (!this.project || !this.shortName) {
            this.service.setError(msg.error)
            return;
        };
        this.loading = true;

        const param: IReqCreateStorFile = {
            project: this.project,
            shortName: this.shortName,
            folder: this.folder || '',
            extension: '.md',
            level: 2,
            source: this.getTemplate(),
            status: 'new'
        }

        try {
            const sf = await createStorFile(param, false, false);
            await createModelAnyFile(sf);

            if (this.service) {
                this.service.openService('_100554_serviceSource', 'left', 2)
                this.service.openService('_100554_serviceUnit', 'left', 2);
            }
            
            const key = mls.stor.getKeyToFile(sf);

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

            

        } catch (e: any) {
            this.loading = false;
        }
    }

    render() {
        const hasName = !!(this.shortName && this.project);
        const folder = this.folder ? `${this.folder}/` : '';
        const filePath = hasName ? `_${this.project}_/l2/${folder}${this.shortName}.md` : '';

        return html`
            <div class="nf-card">
                <div class="nf-head">
                    <div class="nf-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M8 18v-4l2 2 2-2v4"/><path d="M16 14v4"/><path d="M14.5 16.5L16 18l1.5-1.5"/></svg>
                    </div>
                    <div class="nf-head-text">
                        <h2>${msg.header}</h2>
                        <p>${msg.subtitle}</p>
                    </div>
                </div>

                <div class="nf-summary">
                    <div class="nf-summary-label">${msg.willCreate}</div>
                    ${hasName ? html`
                        <code class="nf-path">${filePath}</code>
                    ` : html`<div class="nf-hint">${msg.emptyName}</div>`}
                    <dl class="nf-meta">
                        <div><dt>${msg.project}</dt><dd>${this.project ?? '-'}</dd></div>
                        <div><dt>${msg.folder}</dt><dd>${this.folder || msg.rootFolder}</dd></div>
                        <div><dt>${msg.shortName}</dt><dd>${this.shortName || '-'}</dd></div>
                    </dl>
                </div>

                <button class="nf-create" ?disabled=${!hasName || this.loading} @click=${this.handleAddFile}>
                    ${this.loading ? html`<span class="nf-spinner"></span>${msg.loading}` : msg.btnCreate}
                </button>

                <div class="nf-code">
                    <div class="nf-code-head">
                        <span>${msg.preview}</span>
                        <span class="nf-lang">Markdown</span>
                    </div>
                    <plugin-new-file--widget-text-code-100555 language="markdown" text="${this.getTemplate()}"></plugin-new-file--widget-text-code-100555>
                </div>
            </div>
        `
    }

}