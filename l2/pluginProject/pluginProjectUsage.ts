/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectUsage.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, css, svg, TemplateResult } from 'lit';
import { customElement, query, property } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
import { getDateFormated } from '/_102027_/l2/libCommom.js';
import { getConfigProject } from '/_102027_/l2/libProjectConfig.js';
import * as icons from '/_100555_/l2/utils/collabIcons.js';

export const pluginData: mls.plugin.IPluginData = {
    title: "Usage",
    getSvg(): TemplateResult {
        return svg`
     <svg height="22px" width="22px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 459.75 459.75" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M447.652,304.13h-40.138c-6.681,0-12.097,5.416-12.097,12.097v95.805c0,6.681,5.416,12.098,12.097,12.098h40.138 c6.681,0,12.098-5.416,12.098-12.098v-95.805C459.75,309.546,454.334,304.13,447.652,304.13z"></path> <path d="M348.798,258.13H308.66c-6.681,0-12.098,5.416-12.098,12.097v141.805c0,6.681,5.416,12.098,12.098,12.098h40.138 c6.681,0,12.097-5.416,12.097-12.098V270.228C360.896,263.546,355.48,258.13,348.798,258.13z"></path> <path d="M151.09,304.13h-40.138c-6.681,0-12.097,5.416-12.097,12.097v95.805c0,6.681,5.416,12.098,12.097,12.098h40.138 c6.681,0,12.098-5.416,12.098-12.098v-95.805C163.188,309.546,157.771,304.13,151.09,304.13z"></path> <path d="M52.236,258.13H12.098C5.416,258.13,0,263.546,0,270.228v141.805c0,6.681,5.416,12.098,12.098,12.098h40.138 c6.681,0,12.097-5.416,12.097-12.098V270.228C64.333,263.546,58.917,258.13,52.236,258.13z"></path> <path d="M249.944,196.968h-40.138c-6.681,0-12.098,5.416-12.098,12.098v202.967c0,6.681,5.416,12.098,12.098,12.098h40.138 c6.681,0,12.098-5.416,12.098-12.098V209.066C262.042,202.384,256.625,196.968,249.944,196.968z"></path> <path d="M436.869,244.62c8.14,0,15-6.633,15-15v-48.479c0-8.284-6.716-15-15-15c-8.284,0-15,6.716-15,15v12.119L269.52,40.044 c-3.148-3.165-7.536-4.767-11.989-4.362c-4.446,0.403-8.482,2.765-11.011,6.445L131.745,209.185L30.942,144.969 c-6.987-4.451-16.26-2.396-20.71,4.592c-4.451,6.987-2.396,16.259,4.592,20.71l113.021,72c2.495,1.589,5.286,2.351,8.046,2.351 c4.783,0,9.475-2.285,12.376-6.507L261.003,74.025L400.8,214.62h-12.41c-8.284,0-15,6.716-15,15c0,8.284,6.716,15,15,15 c6.71,0,41.649,0,48.443,0H436.869z"></path> </g> </g></svg>
    `;
    }
};

/// **collab_i18n_start**
const message_pt = {
    detailsResume: 'Resumo',
    designSystems: 'Design systems',
    lastModified: 'Última modificação',
    files: 'Arquivos',
}

const message_en = {
    designSystems: 'Design systems',
    lastModified: 'Last Modified',
    detailsResume: 'Resume',
    files: 'Files',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('plugin-project--plugin-project-usage-100555')
export class PluginProjectUsage extends PluginBaseModule {

    private msg: MessageType = messages['en'];

    @property({ type: Boolean }) autoPrepare: boolean = false;
    @property() designSystems: number | undefined;
    @property() projectLastModified: string | undefined;
    @property() files: number | undefined;
    @property() chartData = {};

    @query('.plugin-body') body: HTMLDivElement | undefined;


    async prepare() {

        const project = mls.actualProject;
        if (!project) return;
        let settings = mls.l5.getProjectSettings(project);
        let details = mls.l5.getProjectDetails(project);
        if (!details || !settings) return;
        const config = await getConfigProject(project);
        this.designSystems = config?.designSystems ? Object.keys(config.designSystems).length : 0;
        this.projectLastModified = getDateFormated(details.repository_lastModified || '');
        this.files = Object.keys(mls.stor.files).filter((item => item.startsWith(project.toString()))).length;
    
    }

    firstUpdated() {
        if (!this.body || !this.autoPrepare) return;
        this.prepare();
    }

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
        return html`<div class="plugin-body">
            ${this.renderResume()}
        </div>`;
    }

    private renderResume() {
        return html`
            <div class="details-card">
                <details open>
                    <summary>${this.msg.detailsResume}</summary>
                    <div>
                        <ul class="listInfo">
                            <li style="margin-bottom:1rem;">
                                <b>${this.msg.lastModified}:</b>
                                <span style="font-style: italic;-">${this.projectLastModified}</span>
                            </li>
                            <li>
                                <b><span>Total Files:</span></b>
                                <div>
                                    <ul>
                                        <li>
                                            <b>${icons.collab_book}${this.msg.designSystems}:</b> 
                                            ${this.designSystems}
                                        </li>
                                        <li>
                                            <b>
                                                ${icons.collab_file_signature}
                                                ${this.msg.files}:
                                            </b>
                                            ${this.files}
                                        </li>
                                    </ul>
                                </div>

                            </li>
                            
                        </ul>
                    </div>
            </details>
        </div>

        `
    }

    static styles = css`

        :host {
            font-family: @font-family-primary;
            display: block;
            height: calc(100% - 55px);
            overflow: auto;
            background: @bg-primary-color;
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

        small {
            color: #888;
            margin-left: auto;
            font-size: 14px;
        }

        p {
            font-size: 16px;
            color: #555;
        }
        .details-card{
            margin-top: 1rem;
            border: 1px solid var(--grey-color-light);
            padding: 1rem;
            border-radius: 10px;
        }

        .listInfo{
            list-style: none;
            margin: 0px;
            padding: 0px;
            padding-left: .5rem;
            margin-bottom: 2rem;
            ul{
                list-style: none;

            }
        }

        details{
            margin-bottom: 1rem;
            >div{
                padding-left: 2rem;
            }
        }
    `;


}
