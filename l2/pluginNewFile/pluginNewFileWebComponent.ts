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
    title: 'Criar um web component em lit',
    description: "Criar um web component em lit 3 ,que será utilizado em páginas.\n O Lit é um framework para criar web componentes rápidos e com atualizações dinâmicas sem ter que repintar toda a tela.\n Após criar o arquivo use a inteligência artificial para preparar o web component.",
    project: "Projeto",
    shortName: "Nome",
    header: "Criar um web component em Lit",
    btnCreate: 'Criar arquivo',
    loading: 'Criando arquivo...',
    error: 'Nome do arquivo em branco ou invalido'
}

const message_en = {
    title: 'Create a web component in Lit',
    description: "Create a web component in Lit 3 that will be used on pages.\n Lit is a framework for creating fast web components with dynamic updates without repainting the entire screen.\n After creating the file, use artificial intelligence to prepare the web component.",
    project: "Project",
    shortName: "ShortName",
    header: "Create a web component in Lit",
    btnCreate: 'Create file',
    loading: 'Creating File...',
    error: 'Blank or invalid file name'

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
 import { StateLitElement } from '${getTemplateImport(102027, 'stateLitElement', '')}';

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

                    <plugin-new-file--widget-text-code-100555 language="typescript" text="${this.getTemplate()}"></plugin-new-file--widget-text-code-100555>
                
                </div>`
            }
        `
    }

}