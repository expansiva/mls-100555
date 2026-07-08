/// <mls fileReference="_100555_/l2/pluginNewFile/pluginNewFilePage.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { convertFileNameToTag } from '/_102027_/l2/utils.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { getMessageKey } from "/_102029_/l2/collabLitElement.js";
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { IDetails, createNewFile, changeTagName, changeClassName, changeWidget, changeStateName, getTemplateImport } from "/_100555_/l2/pluginNewFile/pluginNewFileBase.js";
import { ServiceBase } from '/_102027_/l2/serviceBase.js';
import '/_100555_/l2/pluginNewFile/widgetTextCode.js';

/// **collab_i18n_start**
const message_pt = {
    title: 'Criar um arquivo de pagina.',
    description: "Criar um arquivo do tipo pagina. Na pagina sera possivel manipular o globalState e dos eventos da página.",
    project: "Projeto",
    shortName: "Nome",
    header: "Criar uma pagina",
    btnCreate: 'Criar arquivo',
    loading: 'Criando arquivo...',
    error: 'Nome do arquivo em branco ou invalido',
    errorPageName: 'O nome do arquivo deve começar com "page"',

}

const message_en = {
    title: 'Create a page file.',
    description: "Create a page file. In the page, it will be possible to manipulate the globalState and the page events.",
    project: "Project",
    shortName: "ShortName",
    header: "Create a page",
    btnCreate: 'Create file',
    loading: 'Creating File...',
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

    private service = this.closest('service-detail-100554') as ServiceBase;

    private template: string = `
import { CollabPageElement } from '${getTemplateImport(102027,'collabPageElement', '')}';
import { customElement } from 'lit/decorators.js';
import { globalState, initState, setState } from '${getTemplateImport(102027,'collabState', '')}';

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
        return html`
            ${this.loading ?
                html`<div>${msg.loading}</div>`
                :
                html`   
                <div>
                    <h2>${msg.header} </h2>
                    <hr>
                    <div>
                        <span> <b>${msg.project}:</b> ${this.project}</span>
                        <span> <b>${msg.shortName}:</b> ${this.shortName}</span>    
                    </div>
                    <div style="margin-top:1rem;">
                        <button @click=${this.handleAddFile}>${msg.btnCreate}</button>
                    </div>

                    <plugin-new-file--widget-text-code-100555 language="typescript" text="${this.getTemplateTS()}"></plugin-new-file--widget-text-code-100555>
                    <plugin-new-file--widget-text-code-100555 language="html" text="${this.getTemplateHTML()}"></plugin-new-file--widget-text-code-100555>

                
                </div>`
            }
        `
    }

}