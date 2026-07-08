/// <mls fileReference="_100555_/l2/pluginSystem/pluginSystemTheme.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, css, svg, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';

/// **collab_i18n_start**
const message_pt = {
    alterarLabel: 'Alterar',
    themeLabel: 'Tema',
    themeOptDark: 'Escuro',
    themeOptLight: 'Claro',
    themeOptDf: 'Padrão',
}

const message_en = {
    alterarLabel: 'Change',
    themeLabel: 'Theme',
    themeOptDark: 'Dark',
    themeOptLight: 'Light',
    themeOptDf: 'Default',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const pluginData: mls.plugin.IPluginData = {
    title: "Theme",
    getSvg(): TemplateResult {
        return svg`
    <svg  width="22px" height="22px" viewBox="-7.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.75 8.25v0.219c0 0.844-0.375 1.25-1.156 1.25s-1.125-0.406-1.125-1.25v-0.219c0-0.813 0.344-1.219 1.125-1.219s1.156 0.406 1.156 1.219zM12.063 9.25l0.156-0.188c0.469-0.688 1.031-0.781 1.625-0.344 0.625 0.438 0.719 1.031 0.25 1.719l-0.188 0.156c-0.469 0.688-1.031 0.781-1.625 0.313-0.625-0.438-0.688-0.969-0.219-1.656zM5 9.063l0.125 0.188c0.469 0.688 0.406 1.219-0.188 1.656-0.625 0.469-1.219 0.375-1.688-0.313l-0.125-0.156c-0.469-0.688-0.406-1.281 0.188-1.719 0.625-0.438 1.219-0.281 1.688 0.344zM8.594 11.125c2.656 0 4.844 2.188 4.844 4.875 0 2.656-2.188 4.813-4.844 4.813-2.688 0-4.844-2.156-4.844-4.813 0-2.688 2.156-4.875 4.844-4.875zM1.594 12.5l0.219 0.063c0.813 0.25 1.063 0.719 0.844 1.469-0.25 0.75-0.75 0.969-1.531 0.719l-0.219-0.063c-0.781-0.25-1.063-0.719-0.844-1.469 0.25-0.75 0.75-0.969 1.531-0.719zM15.375 12.563l0.219-0.063c0.813-0.25 1.313-0.031 1.531 0.719s-0.031 1.219-0.844 1.469l-0.188 0.063c-0.813 0.25-1.313 0.031-1.531-0.719-0.25-0.75 0.031-1.219 0.813-1.469zM8.594 18.688c1.469 0 2.688-1.219 2.688-2.688 0-1.5-1.219-2.719-2.688-2.719-1.5 0-2.719 1.219-2.719 2.719 0 1.469 1.219 2.688 2.719 2.688zM0.906 17.281l0.219-0.063c0.781-0.25 1.281-0.063 1.531 0.688 0.219 0.75-0.031 1.219-0.844 1.469l-0.219 0.063c-0.781 0.25-1.281 0.063-1.531-0.688-0.219-0.75 0.063-1.219 0.844-1.469zM16.094 17.219l0.188 0.063c0.813 0.25 1.063 0.719 0.844 1.469s-0.719 0.938-1.531 0.688l-0.219-0.063c-0.781-0.25-1.063-0.719-0.813-1.469 0.219-0.75 0.719-0.938 1.531-0.688zM3.125 21.563l0.125-0.188c0.469-0.688 1.063-0.75 1.688-0.313 0.594 0.438 0.656 0.969 0.188 1.656l-0.125 0.188c-0.469 0.688-1.063 0.75-1.688 0.313-0.594-0.438-0.656-0.969-0.188-1.656zM13.906 21.375l0.188 0.188c0.469 0.688 0.375 1.219-0.25 1.656-0.594 0.438-1.156 0.375-1.625-0.313l-0.156-0.188c-0.469-0.688-0.406-1.219 0.219-1.656 0.594-0.438 1.156-0.375 1.625 0.313zM9.75 23.469v0.25c0 0.844-0.375 1.25-1.156 1.25s-1.125-0.406-1.125-1.25v-0.25c0-0.844 0.344-1.25 1.125-1.25s1.156 0.406 1.156 1.25z"></path>
        </svg>
    `;
    }
};


@customElement('plugin-system--plugin-system-theme-100555')
export class PluginSystemTheme100555 extends PluginBaseModule {

    private msg: MessageType = messages['en'];

    @property({ type: Boolean }) autoPrepare: boolean = false;
    @property() actualTheme: string = 'default';
    @query('.select-theme') selectTheme: HTMLSelectElement | undefined;


    firstUpdated() {
        if (!this.autoPrepare) return;
        this.prepare();
    }

    async prepare() {
        await this.init();
    }

    private async init() {
    }

    render(): TemplateResult {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        this.getUserSettings();

        return html`
            <div class="plugin-container">
                  <details open> 
                <summary>${this.msg.themeLabel}</summary>
                <div>
                    <select style="width:200px" .value=${this.actualTheme} class="select-theme">
                        <option value="default">${this.msg.themeOptDf}</option>
                        <option value="dark">${this.msg.themeOptDark}</option>
                        <option value="light">${this.msg.themeOptLight}</option>
                    </select>
                    <button style="margin-top:1rem" @click=${this.handleChangeThemeClick}>${this.msg.alterarLabel}</button>
                </div>
            </details>
            </div>
        `;
    }


    private handleChangeThemeClick() {
        if (!this.selectTheme) return;
        const theme = this.selectTheme.value;
        this.setUserTheme(theme);
        location.reload();
    }

    private getUserSettings() {
        let userTheme = this.getUserTheme();
        if (!userTheme) userTheme = this.getUserThemeOS();
        this.actualTheme = userTheme;

    }

    private setUserTheme(theme: string) {
        localStorage.setItem('_100554_serviceUserSettings_theme', theme);
    }

    private getUserTheme() {
        return localStorage.getItem('_100554_serviceUserSettings_theme');
    }

    private getUserThemeOS() {
        const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return isDarkMode ? 'dark' : 'light';
    }

}
