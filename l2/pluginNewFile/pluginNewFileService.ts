/// <mls fileReference="_100555_/l2/pluginNewFile/pluginNewFileService.ts" enhancement="_102027_/l2/enhancementLit" />

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
    title: "Service",
    description: "Criar um service, que será utilizado no sistema collab.\nUm service no collab.codes, permite a criação de menus após selecionar o level, fica no nav2, com ícones.\nApós criar o arquivo use a inteligência artificial para preparar o service.",
    header: "Novo service",
    subtitle: "Service do collab, com menu e ícone no nav2. Depois de criar, use a IA para prepará-lo.",
    btnCreate: "Criar service",
    project: "Projeto",
    shortName: "Nome",
    folder: "Pasta",
    rootFolder: "(raiz)",
    willCreate: "Será criado",
    preview: "Prévia do código",
    loading: "Criando arquivo...",
    emptyName: "Digite um nome para o arquivo",
    error: "Nome do arquivo em branco ou invalido",
    errorServiceName: 'Nome do arquivo deve começar com "service"',
}

const message_en = {
    title: "Service",
    description: "Create a service to be used in the Collab system.\nA service in collab.codes allows creating menus after selecting the level, placed in nav2 with icons.\nAfter creating the file, use artificial intelligence to prepare the service.",
    header: "New service",
    subtitle: "Collab service, with menu and icon in nav2. After creating it, use AI to prepare it.",
    btnCreate: "Create service",
    project: "Project",
    shortName: "Name",
    folder: "Folder",
    rootFolder: "(root)",
    willCreate: "Will be created",
    preview: "Code preview",
    loading: "Creating file...",
    emptyName: "Type a name for the file",
    error: "Blank or invalid file name",
    errorServiceName: 'File name must start with "service"',
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
    tags: ["lit", "internal", "service"],
}


@customElement('plugin-new-file--plugin-new-file-service-100555')
export class PluginNewFileService extends StateLitElement {

    @propertyDataSource() shortName: string | undefined;

    @propertyDataSource({ attribute: true }) project: number | undefined;

    @propertyDataSource({ attribute: true }) folder: string | undefined;

    @property() position: 'left' | 'right' = 'left';

    @property() loading: boolean = false;

    private service = this.closest('service-detail-100554') as ServiceBase;

    private template: string = `
import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ServiceBase, IService, IToolbarContent, IServiceMenu } from '${getTemplateImport(102027, 'serviceBase', '')}';

@customElement('[tagName]')
export class [className] extends ServiceBase {
    public details: IService = {
        icon: '&#xf15b',
        state: 'foreground',
        position: 'right',
        tooltip: 'Service Example',
        visible: true,
        widget: '[widgetName]',
        level: [5]
    }

    public onClickMain(op: string): void {
        if (this.menu.setMode) this.menu.setMode('initial');
    }

    public menu: IServiceMenu = {
        title: 'Example',
        main: {},
        tools: {},
        tabs: undefined,
        onClickMain: this.onClickMain.bind(this),
    }

    onServiceClick(visible: boolean, reinit: boolean, el: IToolbarContent | null) {

    }


    @property() 
    name: string = 'Somebody';

    render() {
        return html\`<p> Hello, \${ this.name } !</p>\`;
    }
}`;


    private enhancement: string = `_102027_/l2/enhancementLitService.js`;

    private groupName: string = `other`;

    private getTemplate(): string {

        let newExample = this.template;
        if (this.shortName && this.project && this.shortName) {

            const name = this.folder ? this.folder + '/' + this.shortName : this.shortName
            newExample = changeTagName(newExample, convertFileNameToTag({ project: this.project, shortName: this.shortName, folder: this.folder }));
            newExample = changeClassName(newExample, this.project, this.shortName);
            newExample = changeWidget(newExample, this.project, name);
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
        if (!this.shortName.startsWith('service')) {
            this.service.setError(msg.errorServiceName);
            return;
        }

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
                        <svg viewBox="0 0 24 24"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>
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
                        ${this.shortName?.startsWith('service') ? '' : html`<div class="nf-warn">${msg.errorServiceName}</div>`}
                        <code class="nf-tag">&lt;${tagName}&gt;</code>
                    ` : html`<div class="nf-hint">${msg.emptyName}</div>`}
                    <dl class="nf-meta">
                        <div><dt>${msg.project}</dt><dd>${this.project ?? '-'}</dd></div>
                        <div><dt>${msg.folder}</dt><dd>${this.folder || msg.rootFolder}</dd></div>
                        <div><dt>${msg.shortName}</dt><dd>${this.shortName || '-'}</dd></div>
                    </dl>
                </div>

                <button class="nf-create" ?disabled=${!hasName || this.loading || !this.shortName?.startsWith('service')} @click=${this.handleAddFile}>
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