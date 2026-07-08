/// <mls fileReference="_100555_/l2/pluginProject/pluginGenerateDist.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, svg, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, state } from 'lit/decorators.js';
import { convertFileNameToTag } from '/_102027_/l2/utils.js'
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';

/// **collab_i18n_start**
const message_pt = {
    msg1: "Nenhum build configurado para este projeto.",
    msg2: "Não encontrado modulo informado:",
    msg3: "Não foi possível carregar o plugin:",
}

const message_en = {
    msg1: "No build configured for this project.",
    msg2: "The specified module was not found:",
    msg3: "The plugin could not be loaded:",
};

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'pt': message_pt,
    'en': message_en
}
/// **collab_i18n_end**

@customElement('plugin-project--plugin-generate-dist-100555')
export class PluginGenerateDist extends PluginBaseModule {

    private msg: MessageType = messages['en'];
    @state() error = '';
    @state() tag = '';

    firstUpdated() {
        this.init();
    }

    async updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        const propMode = changedProperties.get('mode');
    }

    render(): TemplateResult {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html` ${this.tag ? this.renderTag() :this.renderDefault()} `;
    }

    renderTag() {
        console.info(this.tag)
        return unsafeHTML(`<${this.tag}></${this.tag}>`);
    }

    renderDefault(): TemplateResult {
        return html`
            <div class="agent-box"> 
                ${this.renderHeader()}
                ${this.error ? this.error : ''}
            </div> 
        `;
    }

    renderHeader(): TemplateResult {
        return html`
            <header>
                <span class="svg-container">${pluginData.getSvg()}</span>
                <span>${pluginData.title} - ${mls.actualProject}</span>
            </header>
        `;
    }

    //-------IMPLEMENTATION-------

    private async init() {

        const buildModuleName = await this.getBuildByProject(mls.actualProject || 0);

        if (!buildModuleName) {
            this.error = this.msg.msg1;
            return;
        }
        const hasExtension = this.hasExtension(buildModuleName);
        const fTs = hasExtension ? buildModuleName : buildModuleName + '.ts';


        const info = mls.stor.convertFileReferenceToFile(fTs);
        const k = mls.stor.getKeyToFile(info);
        const s = mls.stor.files[k];
        if (!s) {
            this.error = this.msg.msg2 + fTs;
            return;
        }

        try {

            const hasBar = buildModuleName.startsWith('/');
            const fIm = hasBar ? buildModuleName : '/' + buildModuleName;
            await import(fIm);
            const tag = convertFileNameToTag(s);
            this.tag = tag;

            
        } catch (e) {
            this.error = this.msg.msg3 + buildModuleName;
            return;
            
        }


    }

    private hasExtension(str: string) {
        const filename: string = str.split('/').pop() || '';
        return /\.[^./]+$/.test(filename);
    }

    private async getBuildByProject(project: number): Promise<string | undefined> {
        if (!project) return;
        const url = `/_${project}_/l2/project.js`
        try {
            const modulePrj = await import(url);
            if (!modulePrj || !modulePrj.projectConfig || !modulePrj.projectConfig.masterFrontEnd || !modulePrj.projectConfig.masterFrontEnd.generateDist) return;

            return modulePrj.projectConfig.masterFrontEnd.generateDist;

        } catch (err) {
            console.error('no find project config');
            return;
        }
    }


}

export const pluginData: mls.plugin.IPluginData = {
    title: "Generate Dist",
    getSvg(): TemplateResult {
        return svg`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M352 173.3L352 384C352 401.7 337.7 416 320 416C302.3 416 288 401.7 288 384L288 173.3L246.6 214.7C234.1 227.2 213.8 227.2 201.3 214.7C188.8 202.2 188.8 181.9 201.3 169.4L297.3 73.4C309.8 60.9 330.1 60.9 342.6 73.4L438.6 169.4C451.1 181.9 451.1 202.2 438.6 214.7C426.1 227.2 405.8 227.2 393.3 214.7L352 173.3zM320 464C364.2 464 400 428.2 400 384L480 384C515.3 384 544 412.7 544 448L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 448C96 412.7 124.7 384 160 384L240 384C240 428.2 275.8 464 320 464zM464 488C477.3 488 488 477.3 488 464C488 450.7 477.3 440 464 440C450.7 440 440 450.7 440 464C440 477.3 450.7 488 464 488z"/></svg>
    `;
    }
}