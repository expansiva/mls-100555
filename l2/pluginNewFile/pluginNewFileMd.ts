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
    title: "Criar um arquivo MD em branco.",
    desc: "Criar um arquivo em branco md.",
    project: "Projeto",
    shortName: "Nome",
    header: "Arquivo em branco",
    btnCreate: 'Criar arquivo',
    loading: 'Criando arquivo...',
    error: 'Nome do arquivo em branco ou invalido'

}

const message_en = {
    title: "Create a MD blank file.",
    desc: "Create a blank file md.",
    project: "Project",
    shortName: "ShortName",
    header: "Blank File",
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