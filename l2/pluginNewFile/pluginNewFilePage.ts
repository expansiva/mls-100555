/// <mls fileReference="_100555_/l2/pluginNewFile/pluginNewFilePage.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { convertFileNameToTag } from '/_102027_/l2/utils.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { getMessageKey } from "/_102029_/l2/collabLitElement.js";
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { IDetails, createNewFile, changeTagName, changeClassName, changeWidget, changeStateName, getTemplateImport } from "/_100555_/l2/pluginNewFile/pluginNewFileBase.js";
import { ServiceBase } from '/_102027_/l2/serviceBase.js';
import '/_100555_/l2/pluginNewFile/widgetTextCode.js';

/// **collab_i18n_start**
const message_pt = {
    title: 'Página',
    description: "Cria um arquivo do tipo página, que pode manipular o globalState e os eventos da página.",
    project: "Projeto",
    shortName: "Nome",
    folder: "Pasta",
    rootFolder: "(raiz)",
    header: "Nova página",
    willCreate: "Será criado",
    preview: "Prévia do código",
    btnCreate: 'Criar página',
    loading: 'Criando arquivo...',
    emptyName: 'Digite um nome para o arquivo',
    error: 'Nome do arquivo em branco ou invalido',
    errorPageName: 'O nome do arquivo deve começar com "page"',

}

const message_en = {
    title: 'Page',
    description: "Creates a page file, which can manipulate the globalState and the page events.",
    project: "Project",
    shortName: "Name",
    folder: "Folder",
    rootFolder: "(root)",
    header: "New page",
    willCreate: "Will be created",
    preview: "Code preview",
    btnCreate: 'Create page',
    loading: 'Creating file...',
    emptyName: 'Type a name for the file',
    error: 'Blank or invalid file name',
    errorPageName: 'File name must start with "page"',

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
    description: msg.description,
    tags: ["lit", "html", "page"],
}

@customElement('plugin-new-file--plugin-new-file-page-100555')
export class PluginNewFilePage extends StateLitElement {

    @propertyDataSource({ attribute: true }) shortName: string | undefined;

    @propertyDataSource({ attribute: true }) project: number | undefined;

    @propertyDataSource({ attribute: true }) folder: string | undefined;

    @property() position: 'left' | 'right' = 'left';

    @property() loading: boolean = false;

    @state() private codeTab: 'typescript' | 'html' = 'typescript';

    private service = this.closest('service-detail-100554') as ServiceBase;

    private template: string = `
import { CollabPageElement } from '${getTemplateImport(102027,'collabPageElement', '')}';
import { customElement } from 'lit/decorators.js';
import { globalState, initState, setState } from '${getTemplateImport(102029,'collabState', '')}';

@customElement('[tagName]')
export class [className] extends CollabPageElement {
    initPage() {

    }
}
`;


    private enhancement: string = `_102027_/l2/enhancementLit.ts`;

    private groupName: string = `other`;

    private getTemplateTS(): string {

        let newExample = this.template;
        if (this.shortName && this.project) {
            newExample = changeTagName(newExample, convertFileNameToTag({ project: this.project, shortName: this.shortName, folder: this.folder }));
            newExample = changeClassName(newExample, this.project, this.shortName);
            newExample = changeWidget(newExample, this.project, this.shortName);
            newExample = changeStateName(newExample, this.shortName);

        }

        const group = this.groupName && this.groupName != 'other' ? ` groupName="${this.groupName}"` : ` groupName="page"`;
        const enhancement = this.enhancement ? this.enhancement : '_blank';

        const folder = this.folder ? `${this.folder}/` : '';
        const name = `_${this.project}_/l2/${folder}${this.shortName}.ts`
        return `/// <mls fileReference="${name}" enhancement="${enhancement}"/>\n${newExample}\n`
    }

    private getTemplateHTML(): string {

        if (!this.shortName || !this.project) return '';

        const tagName = convertFileNameToTag({ project: this.project, shortName: this.shortName, folder: this.folder });
        return `<${tagName}></${tagName}>`;
    }

    private async handleAddFile() {
        if (!this.project || !this.shortName) {
            this.service.setError(msg.error);
            return;
        };

        this.loading = true;
        try {
            await createNewFile({
                folder:this.folder,
                project: this.project,
                position: this.position,
                shortName: this.shortName,
                enhancement: this.enhancement,
                sourceTS: this.getTemplateTS(),
                sourceHTML: this.getTemplateHTML(),
                openPreview: true
            });
        } catch (e: any) {
            this.loading = false;
        }
    }

    render() {
        const hasName = !!(this.shortName && this.project);
        const folder = this.folder ? `${this.folder}/` : '';
        const filePath = hasName ? `_${this.project}_/l2/${folder}${this.shortName}.ts` : '';
        const tagName = hasName ? convertFileNameToTag({ project: this.project as number, shortName: this.shortName as string, folder: this.folder }) : '';

        return html`
            <div class="nf-card">
                <div class="nf-head">
                    <div class="nf-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>
                    </div>
                    <div class="nf-head-text">
                        <h2>${msg.header}</h2>
                        <p>${msg.description}</p>
                    </div>
                </div>

                <div class="nf-summary">
                    <div class="nf-summary-label">${msg.willCreate}</div>
                    ${hasName ? html`
                        <code class="nf-path">${filePath}</code>
                        <code class="nf-tag">&lt;${tagName}&gt;</code>
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
                        <div class="nf-tabs" role="tablist">
                            <button role="tab" aria-selected="${this.codeTab === 'typescript'}" class="${this.codeTab === 'typescript' ? 'active' : ''}" @click=${() => this.codeTab = 'typescript'}>TS</button>
                            <button role="tab" aria-selected="${this.codeTab === 'html'}" class="${this.codeTab === 'html' ? 'active' : ''}" @click=${() => this.codeTab = 'html'}>HTML</button>
                        </div>
                    </div>
                    <plugin-new-file--widget-text-code-100555 ?hidden=${this.codeTab !== 'typescript'} language="typescript" text="${this.getTemplateTS()}"></plugin-new-file--widget-text-code-100555>
                    <plugin-new-file--widget-text-code-100555 ?hidden=${this.codeTab !== 'html'} language="html" text="${this.getTemplateHTML()}"></plugin-new-file--widget-text-code-100555>
                </div>
            </div>
        `
    }

}
