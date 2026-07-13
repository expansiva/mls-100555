/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleIndexItem.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { customElement, property, state } from 'lit/decorators.js';
import { CollabLitElement } from '/_102029_/l2/collabLitElement.js';
import { IHelpers } from '/_100555_/l2/utils/cssHelperIndexBase.js';
import { convertFileNameToTag, getPath } from '/_102027_/l2/utils.js';


import {
    collab_heart,
    collab_heart_o,
    collab_question,
    collab_angles_right,
    collab_chevron_right,
    collab_info_circle
} from '/_100555_/l2/utils/collabIcons.js'

@customElement('plugin-style--plugin-style-index-item-100555')
export class PluginStyleIndexItem extends CollabLitElement {

    @property({ reflect: false }) help: IHelpers | undefined;
    @property() position: 'left' | 'right' = 'left';
    @property({ reflect: true }) mode: 'collapsed' | 'expanded' | 'full' = 'collapsed';
    @property() pluginLoaded: boolean = false;

    firstUpdated() {
        if (this.mode !== 'collapsed') {
            const container = this.querySelector('.plugin-item-container') as HTMLElement;
            this.openPlugin(container, this.help, false);
        }
    }

    updated(_changedProperties: Map<PropertyKey, unknown>) {
        if (_changedProperties.has('mode') && this.mode) {
            this.pluginEl?.setAttribute('showFull', this.mode === 'full' ? 'true' : 'false');
        }
    }

    render() {

        return html`
            <div class="plugin-item" .data=${this.help} >
                
                <div class="plugin-item-header">
                    <span>${this.help?.name}</span>
                    <div class="plugin-item-icons">
                        <i
                            class="i-expanded ${this.mode === 'full' || this.mode === 'expanded' ? 'open' : ''}"
                            @click=${(e: MouseEvent) => { this.handleExpandedClick(e); }}
                        >${collab_chevron_right}</i>

                        <i
                            class="i-full ${this.mode === 'full' ? 'open' : ''}"
                            @click=${(e: MouseEvent) => { this.handleFullClick(e); }}
                        
                        >${collab_angles_right}</i>
                        <i
                            class="i-question ${this.help?.showInfo ? 'info' : ''}"
                            @click=${(e: MouseEvent) => { this.handleInfoClick(e); }}
                        >${collab_question}</i>
                        <i
                            class="i-like ${this.help?.liked ? 'liked' : ''} ${this.help?.likedAnimation ? 'likedAnimation' : ''}"
                            @click=${(e: MouseEvent) => { this.handleLikeClick(e); }}
                        >${this.help?.liked ? collab_heart : collab_heart_o}
                        </i>
                    </div>
                </div>
                
                ${this.help?.showInfo ? html`
                    <div class="plugin-item-info">
                        <i>${collab_info_circle}</i>
                        <span>${this.help.widget}</span>
                    </div>
                    <div class="plugin-item-desc">${this.help.description}</div>

                `: ''}

                <div
                    class="plugin-item-container ${this.help?.mode === 'expanded' ? 'expanded' : ''}"
                    style="${this.help?.mode !== 'collapsed' ? 'display:block;' : 'display:none;'}"
                >
                </div>            

            </div>`
    }

    private pluginEl: HTMLElement | undefined;

    private async openPlugin(container: HTMLElement, help: IHelpers | undefined, close: boolean) {
        if (!help) return;

        if (close) {
            container.style.display = 'none';
            return;
        }

        if (container.childElementCount === 0) {
            const info = getPath(help.widget);
            if (!info) throw new Error('[openPlugin] Not found path:' + help.widget);
            const { folder, project, shortName } = info;
            const tag = convertFileNameToTag({ project, shortName, folder });
            this.pluginEl = document.createElement(tag);
            this.pluginEl.setAttribute('state', `{{ less.${this.position} }}`);
            this.pluginEl.setAttribute('showFull', this.mode === 'full' ? 'true' : 'false');
            container.appendChild(this.pluginEl);
        } else {
            const item = this.pluginEl;
            if (item) item.setAttribute('showFull', this.mode === 'full' ? 'true' : 'false');
        }
        container.style.display = 'block';
    }

    async handleOpenPlugin(e: MouseEvent, help: IHelpers, close: boolean = false) {
        e.stopPropagation();
        const target = e.target as HTMLElement;
        if (!target) return;
        const parent = target.closest('.plugin-item') as HTMLElement;
        if (!parent) return;
        const container = parent.querySelector('.plugin-item-container') as HTMLElement;
        if (!container) return;
        this.openPlugin(container, help, close);
    }

    async handleExpandedClick(e: MouseEvent) {
        e.stopPropagation();
        if (!this.help) return;
        if (this.mode === 'expanded' || this.mode === 'full') {
            this.mode = 'collapsed'
            this.handleOpenPlugin(e, this.help, true);
        } else {
            this.mode = 'expanded'
            await this.handleOpenPlugin(e, this.help);
        }

        this.help.mode = this.mode;

    }

    handleFullClick(e: MouseEvent) {
        e.stopPropagation();
        if (!this.help) return;
        if (this.mode === 'full') {
            this.mode = 'collapsed';
            this.handleOpenPlugin(e, this.help, true);
        } else {
            this.mode = 'full';
            this.handleOpenPlugin(e, this.help)
        }

        this.help.mode = this.mode;

    }

    async handleLikeClick(e: MouseEvent) {
        e.stopPropagation();
        if (!this.help) return;

        this.help.liked = !this.help.liked;
        this.help.likedAnimation = this.help.liked;
        this.requestUpdate();
        setTimeout(() => {
            if (!this.help) return;
            this.help.likedAnimation = false;
        }, 1000);
    }

    async handleInfoClick(e: MouseEvent) {
        if (!this.help) return;
        e.stopPropagation();
        this.help.showInfo = !this.help.showInfo;
        this.requestUpdate();
    }

}
