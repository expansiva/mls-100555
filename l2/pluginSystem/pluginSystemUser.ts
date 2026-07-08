/// <mls fileReference="_100555_/l2/pluginSystem/pluginSystemUser.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, svg, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';

/// **collab_i18n_start**
const message_pt = {
    develpoment: 'Em desenvolvimento',
    alterarLabel: 'Alterar',
}

const message_en = {
    develpoment: 'In Develpoment',
    alterarLabel: 'Change',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const pluginData: mls.plugin.IPluginData = {
    title: "User Preferencies",
    getSvg(): TemplateResult {
        return svg`
        <svg width="22px" height="22px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>
    `;
    }
};

@customElement('plugin-system--plugin-system-user-100555')
export class PluginSystemLanguage100555 extends PluginBaseModule {

    private msg: MessageType = messages['en'];

    @property({ type: Boolean }) autoPrepare: boolean = false;

    @property({ type: Boolean }) consoleEnabled: boolean = false;

    @query('#console-input') inputConsole: HTMLInputElement | undefined;

    firstUpdated() {
        if (!this.autoPrepare) return;
        this.prepare();
    }

    async prepare() {
        await this.init();
    }

    private async init() {
        const collabConsole = document.querySelector('collab-console') as HTMLElement;
        if (collabConsole) {
            const show = collabConsole.getAttribute('show') === 'true';
            this.consoleEnabled = show;
        }

    }

    private onChangeConsoleEnabled() {
        const collabConsole = document.querySelector('collab-console') as HTMLElement;
        if (collabConsole && this.inputConsole) {
            collabConsole.setAttribute('show', `${this.inputConsole.checked ? 'true' : 'false'}`)
        }
    }

    render(): TemplateResult {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html
            `<div style="display:flex;align-items:center;">
            <label for="console-input"> Enable develpoment console</label>
            <input @change=${this.onChangeConsoleEnabled} .checked=${this.consoleEnabled} id="console-input" style="cursor:pointer;" type="checkbox"></input>
        </div>`;
    }
}
