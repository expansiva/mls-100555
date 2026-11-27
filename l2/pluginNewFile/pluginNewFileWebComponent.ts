/// <mls fileReference="_100555_/l2/pluginNewFile/pluginNewFileWebComponent.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { convertFileNameToTag } from '/_102027_/l2/utils.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { getMessageKey } from "/_102029_/l2/collabLitElement.js";
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { ServiceBase } from '/_102027_/l2/serviceBase.js';
import { IDetails, createNewFile, changeTagName, changeClassName, changeWidget, getTemplateImport } from "/_100555_/l2/pluginNewFile/pluginNewFileBase.js";
import '/_100555_/l2/pluginNewFile/widgetTextCode.js';

/// **collab_i18n_start**
const message_pt = {
    title: "Web component",
    description: "Criar um web component em lit 3, que será utilizado em páginas.\nO Lit é um framework para criar web componentes rápidos e com atualizações dinâmicas sem ter que repintar toda a tela.\nApós criar o arquivo use a inteligência artificial para preparar o web component.",
    header: "Novo web component",
    subtitle: "Componente Lit 3 para usar em páginas. Depois de criar, use a IA para prepará-lo.",
    btnCreate: "Criar componente",
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
    title: "Web component",
    description: "Create a web component in Lit 3 that will be used on pages.\nLit is a framework for creating fast web components with dynamic updates without repainting the entire screen.\nAfter creating the file, use artificial intelligence to prepare the web component.",
    header: "New web component",
    subtitle: "Lit 3 component to use on pages. After creating it, use AI to prepare it.",
    btnCreate: "Create component",
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
    description: msg.description,
    tags: ["lit", "html", "component"],
}

@customElement('plugin-new-file--plugin-new-file-web-component-100555')
export class PluginNewFileWebComponent extends StateLitElement {

    @propertyDataSource() shortName: string | undefined;

    @propertyDataSource({ attribute: true }) project: number | undefined;

    @propertyDataSource({ attribute: true }) folder: string | undefined;

    @property() position: 'left' | 'right' = 'left';

    @property() loading: boolean = false;

    private service = this.closest('service-detail-100554') as ServiceBase;

    private template: string = `
 import { html } from 'lit'; 
 import { customElement, property } from 'lit/decorators.js';
 import { StateLitElement } from '${getTemplateImport(102029, 'stateLitElement', '')}';

 @customElement('[tagName]')
 export class [className] extends StateLitElement {
    
     @property() name: string = 'Somebody';

     render() {
         return html\`<p> Hello, \${ this.name } !</p>\`;
     }
 }`;


    private enhancement: string = `_102027_/l2/enhancementLit.ts`;

    private groupName: string = `other`;

    private getTemplate(): string {


        let newExample = this.template;
        if (this.shortName && this.project) {
            newExample = changeTagName(newExample, convertFileNameToTag({ project: this.project, shortName: this.shortName, folder: this.folder }));
            newExample = changeClassName(newExample, this.project, this.shortName);
            newExample = changeWidget(newExample, this.project, this.shortName);
        }

        const group = this.groupName && this.groupName != 'other' ? ` groupName="${this.groupName}"` : '';
        const enhancement = this.enhancement ? this.enhancement : '_blank';

        const folder = this.folder ? `${this.folder}/` : '';
        const name = `_${this.project}_/l2/${folder}${this.shortName}.ts`
        return `/// <mls fileReference="${name}" enhancement="${enhancement}"/>\n${newExample}\n`
    }

    private async handleAddFile() {
        if (!this.project || !this.shortName) {
            this.service.setError(msg.error)
            return;
        };
        this.loading = true;
        try {
            await createNewFile({
                project: this.project,
                position: this.position,
                shortName: this.shortName,
                folder: this.folder,
                enhancement: this.enhancement,
                sourceTS: this.getTemplate(),
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
                        <svg viewBox="0 0 24 24"><path d="M8 6l-6 6 6 6"/><path d="M16 6l6 6-6 6"/><path d="M14 4l-4 16"/></svg>
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
                        <span class="nf-lang">TypeScript</span>
                    </div>
                    <plugin-new-file--widget-text-code-100555 language="typescript" text="${this.getTemplate()}"></plugin-new-file--widget-text-code-100555>
                </div>
            </div>
        `
    }

}