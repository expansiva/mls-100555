/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleCursor.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { getState, setState } from '/_102029_/l2/collabState.js';
import { getMessageKey } from '/_102029_/l2/collabLitElement.js'
import { ICSSState } from '/_100555_/l2/utils/lessCSS.js';

/// **collab_i18n_start**
const message_pt = {
    description: 'Um plugin versátil para personalizar o cursor no seu site ou aplicativo. Altere o estilo do cursor para atender às suas necessidades, desde cursores personalizados a interações dinâmicas. Ideal para melhorar a experiência do usuário e criar interfaces únicas.'
}

const message_en = {
    description: 'A versatile plugin to customize the cursor on your website or application. Change the cursor style to suit your needs, from custom cursors to dynamic interactions. Perfect for enhancing user experience and creating unique interfaces'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const tags = ['cursor'];

export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}

@customElement('plugin-style--plugin-style-cursor-100555')
export class PluginStyleClipath extends StateLitElement {

    @propertyDataSource() state: ICSSState | undefined;
    @property() position: 'left' | 'right' = 'left';
    @property() showFull: string = 'false';

    render() {
        return html`${this.renderGallery()}`;
    }

    renderGallery() {

        return html`
            <div class="gallery">
                ${repeat(this.arrayGallery, ((key: any) => key) as any,
            ((css: any, index: any) => {
                return html`
                            <div class="itemgallery" style=${css.css} .gallery=${css.css} .name= ${css.name} @click="${this.handleChangeCss}">
                                ${css.name}
                            </div>
                        `;
            }) as any
        )}
            </div>
        
        `
    }

    private timeonChange = -1;
    private handleChangeCss(e: KeyboardEvent) {

        e.stopPropagation();
        let el = e.target as HTMLElement;
        if (!el.classList.contains('itemgallery')) {
            el = el.closest('.itemgallery') as HTMLElement;
        }

        let css = (el as any).gallery;
        let name = (el as any).name;
        if (!el || !css && !name) return;
        css = css.replace('cursor:', '').trim();

        if (this.timeonChange) window.clearTimeout(this.timeonChange);
        this.timeonChange = window.setTimeout(() => {
            this.setState(css);

        }, 100);
    }

    private setState(css: string) {
        setState(`less.${this.position}.emitter`, 'helper');
        const styles: CSSStyleDeclaration = getState(`less.${this.position}.lessCSS.styles`);
        styles.cursor = css;
    }

    private arrayGallery = [
        { "css": "cursor: alias", "name": "alias" },
        { "css": "cursor: all-scroll", "name": "all-scroll" },
        { "css": "cursor: auto", "name": "auto" },
        { "css": "cursor: cell", "name": "cell" },
        { "css": "cursor: col-resize", "name": "col-resize" },
        { "css": "cursor: context-menu", "name": "context-menu" },
        { "css": "cursor: copy", "name": "copy" },
        { "css": "cursor: crosshair", "name": "crosshair" },
        { "css": "cursor: default", "name": "default" },
        { "css": "cursor: e-resize", "name": "e-resize" },
        { "css": "cursor: ew-resize", "name": "ew-resize" },
        { "css": "cursor: grab", "name": "grab" },
        { "css": "cursor: grabbing", "name": "grabbing" },
        { "css": "cursor: help", "name": "help" },
        { "css": "cursor: move", "name": "move" },
        { "css": "cursor: n-resize", "name": "n-resize" },
        { "css": "cursor: ne-resize", "name": "ne-resize" },
        { "css": "cursor: nesw-resize", "name": "nesw-resize" },
        { "css": "cursor: ns-resize", "name": "ns-resize" },
        { "css": "cursor: nw-resize", "name": "nw-resize" },
        { "css": "cursor: nwse-resize", "name": "nwse-resize" },
        { "css": "cursor: no-drop", "name": "no-drop" },
        { "css": "cursor: none", "name": "none" },
        { "css": "cursor: not-allowed", "name": "not-allowed" },
        { "css": "cursor: pointer", "name": "pointer" },
        { "css": "cursor: progress", "name": "progress" },
        { "css": "cursor: row-resize", "name": "row-resize" },
        { "css": "cursor: s-resize", "name": "s-resize" },
        { "css": "cursor: se-resize", "name": "se-resize" },
        { "css": "cursor: sw-resize", "name": "sw-resize" },
        { "css": "cursor: text", "name": "text" },
        { "css": "cursor: w-resize", "name": "w-resize" },
        { "css": "cursor: wait", "name": "wait" },
        { "css": "cursor: zoom-in", "name": "zoom-in" },
        { "css": "cursor: zoom-out", "name": "zoom-out" }
    ]
}