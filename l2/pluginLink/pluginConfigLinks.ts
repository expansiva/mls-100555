/// <mls fileReference="_100555_/l2/pluginLink/pluginConfigLinks.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, svg, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, query, property } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
import { getConfigProject, updateConfigProject } from '/_102027_/l2/libProjectConfig.js';

@customElement('plugin-link--plugin-config-links-100555')
export class PluginConfigLinks extends PluginBaseModule {

    @property() myLinks: ILinks[] = [];
    @property({ type: Boolean }) autoPrepare: boolean = false;
    private myConfig: mls.l5_common.ProjectConfig | undefined;

    async prepare() {
        this.init();
    }

    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        if (!this.autoPrepare) return;
        this.prepare();
    }

    render(): TemplateResult {

        return html`
            ${this.renderEdit()}
            <div class="plugin-links">
                ${repeat(this.myLinks, ((lk: ILinks) => lk.url) as any,
            ((l: ILinks, index: any) => {

                return this.renderLink(l, index);

            }) as any)}
                <button style="float:right" class="btn-edit" @click="${this.setModeEdit}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
                    
                    New
                </button>
            </div>
        `;
    }

    renderLink(l: ILinks, idx: number): TemplateResult {

        return html`
            <link-item style="border:1px solid ${l.color}">
                
                <svg class="del-link" @click="${this.clickDel}" index="${idx}"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                <a target="_blank" href="${l.url}" >
                    
                    <label style="color:${l.color}; cursor:pointer;">${l.title}</label>
                </a>
            </link-item>
        
        `

    }

    renderEdit(): TemplateResult {
        return html`
            <div class="content-edit">
                <content-edit>
                    <div class="body-edit">
                        
                        <div style="width:30%">
                            <label>title</label>
                            <input style="width:100%" ref="title"/>
                        </div> 
                        <div style="width:50%">
                            <label>url</label>
                            <input style="width:100%" ref="url"/>
                        </div> 
                        <div style="width:20%">
                            <label>color</label>
                            <input style="width:100%" ref="color" type="color"/>
                        </div>

                    </div>
                    <button style="margin-left:2rem" @click="${this.addLink}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
                        add
                    </button> 
                    <button @click="${this.removeModeEdit}"> 
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M48.5 224L40 224c-13.3 0-24-10.7-24-24L16 72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8L48.5 224z"/></svg>
                        cancel
                    </button>
                </content-edit>
                
            </div>
        
        `
    }

    //------IMPLEMENTS---------

    private async init() {

        const prj = mls.actualProject;
        if (!prj) return;

        this.myConfig = await getConfigProject(prj);

        if (this.myConfig && (this.myConfig as any)['links']) {
            this.myLinks = (this.myConfig as any)['links'];
        }

        this.requestUpdate();
    }

    private async addLink(e: MouseEvent) {

        let el = e.target as HTMLElement;
        if (!el) return;
        el = el.closest('content-edit') as HTMLElement;
        if (!el) return;

        const alIpt = el.querySelectorAll('*[ref]');
        const info: ILinks = { color: '', title: '', url: '' };

        Array.from(alIpt).forEach((i) => {

            const key = i.getAttribute('ref') as string;
            (info as any)[key] = (i as HTMLInputElement).value;
            (i as HTMLInputElement).value = '';

        });

        if (!info.url || !info.title) {
            alert('fill all the fields!');
            return;
        }

        if (!info.color) info.color = '#000000';

        this.myLinks.push(info);
        this.updateConfig();
        this.requestUpdate();

    }

    private async updateConfig() {

        try {

            const prj = mls.actualProject;
            if (!prj || !this.myConfig) return;
        
            (this.myConfig as any)['links'] = this.myLinks;

            updateConfigProject(prj, this.myConfig);

        } catch (e) {
            console.info(e);
        }

        
    }

    private clickDel(e: MouseEvent) {

        e.stopPropagation();
        let el = e.target as HTMLElement;
        if (!el) return;

        if (el.tagName.toLocaleLowerCase() !== 'svg') {
            el = (el.closest('svg') as any) as HTMLElement;
        }
        const index = el.getAttribute('index');

        if (index != '' && index != null) this.myLinks.splice(+index, 1);
        this.updateConfig();
        this.requestUpdate();
    }

    private removeModeEdit() {

        this.classList.remove('mode-edit')
    }

    private setModeEdit() {

        this.classList.add('mode-edit')
    }

    private test = [
        {
            url: 'https://chatgpt.com/',
            title: 'ChatGPT',
            color: '#007bff',

        },
        {
            url: 'https://github.com/expansiva/',
            title: 'gitHub',
            color: '#000000',


        }, {
            url: 'https://www.techdrop.news/',
            title: 'TechDrop',
            color: '#4e00ff',

        },
        {
            url: 'https://www.youtube.com/@multilevelstudio7354',
            title: 'youtube',
            color: '#ff0303',


        }
    ];

}

interface ILinks {
    title: string,
    url: string,
    color: string,
}

export const pluginData: mls.plugin.IPluginData = {
    title: "Config links",
    getSvg(): TemplateResult {
        return svg`
     <svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"/></svg>
    `;
    }
};