/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectDetail.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, css, svg, TemplateResult, LitElement } from 'lit';
import { query, property, customElement } from 'lit/decorators.js';
import { getAllWebComponentsInSource } from '/_102027_/l2/libCompile.js';
import { convertTagToFileName } from '/_102027_/l2/utils.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
import "/_100555_/l2/pluginProject/pluginProjectInfo.js";

export const pluginData: mls.plugin.IPluginData = {
    title: "Project Detail",
    getSvg(): TemplateResult {
        return svg`
        <svg height="22px" width="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM80 64l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16L80 96c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm16 96l192 0c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32L96 352c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32zm0 32l0 64 192 0 0-64L96 256zM240 416l64 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>
    `;
    }
};

@customElement('plugin-project--plugin-project-detail-100555')
export class PluginProjectDetail extends PluginBaseModule {

    @query('contentproject') contentproject: HTMLElement | undefined;
    @query('contentprojectinfo') contentprojectinfo: HTMLElement | undefined;

    async prepare() {
    }


    //----------COMPONENT--------------------

    firstUpdated() {
        this.loadProject();
    }

    render(): TemplateResult {

        return html`
            <contentprojectinfo>
            </contentprojectinfo>
            
            <div>
                <details open>
                    <summary>Project</summary>
                    <contentproject style="padding:2rem; display:block">
                    </contentproject>
                </details>
            </div>
        `;
    }


    //----------IMPLEMENTATION--------------------

    private async loadProject() {

        if (!this.contentproject || !this.contentprojectinfo) return;

        const txt = localStorage.getItem('serviceDetail');
        const info = txt ? JSON.parse(txt) : undefined;

        if (!info) return;

        localStorage.removeItem('serviceDetail');

        const prj = info.prj;
        const actual = mls.actualProject;

        if (!prj || !actual) return;

        if (prj !== actual) {
            await mls.stor.server.loadProjectInfoIfNeeded(prj, false);
        }

        this.contentprojectinfo.innerHTML = `
            <plugin-project--plugin-project-info-100555 autoPrepare="true" project="${prj}" ></plugin-project--plugin-project-info-100555>
        `

        const keyFile = mls.stor.getKeyToFiles(prj, 2, 'project', '', '.html');
        const storFile = mls.stor.files[keyFile];

        if (!storFile && this.contentproject) {
            this.contentproject.innerHTML = 'project.html not found';
            return;
        } else if (!storFile) return;


        const content = await storFile.getContent() as string;

        this.contentproject.innerHTML = '';
        const allWcs = getAllWebComponentsInSource(content);

        this.contentproject.innerHTML = content;

        allWcs.forEach((wc) => {
            const info = convertTagToFileName(wc);
            if (info) {
                const script = document.createElement('script');
                script.type = 'module';
                script.id = `_${info.project}_${info.shortName}`;
                script.src = (`/_${info.project}_${info.shortName}`);
                this.contentproject?.appendChild(script)
            }

        });




    }


    //----------CSS--------------------

    static styles = css`
    
        :host {
            font-family: @font-family-primary;
            display: block;
            height: calc(100% - 55px);
            overflow: auto;
            background: @bg-primary-color;
            font-size: @font-size-16;
        }   

        details{
            border: 1px solid var(--grey-color-light);
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1rem;
            >div{
                padding-left: 2rem;
            }
        } 
    `;


}