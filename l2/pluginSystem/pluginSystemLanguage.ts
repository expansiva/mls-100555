/// <mls fileReference="_100555_/l2/pluginSystem/pluginSystemLanguage.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, svg, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';

/// **collab_i18n_start**
const message_pt = {
    languageLabel: 'Linguagens',
    alterarLabel: 'Alterar',
}

const message_en = {
    languageLabel: 'Languages',
    alterarLabel: 'Change',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const pluginData: mls.plugin.IPluginData = {
    title: "Language",
    getSvg(): TemplateResult {
        return svg`
        <svg width="22px" height="22px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" aria-labelledby="languageIconTitle" stroke="#000000" stroke-width="1" stroke-linecap="square" stroke-linejoin="miter" fill="none" color="#000000"> <title id="languageIconTitle">Language</title> <circle cx="12" cy="12" r="10"/> <path stroke-linecap="round" d="M12,22 C14.6666667,19.5757576 16,16.2424242 16,12 C16,7.75757576 14.6666667,4.42424242 12,2 C9.33333333,4.42424242 8,7.75757576 8,12 C8,16.2424242 9.33333333,19.5757576 12,22 Z"/> <path stroke-linecap="round" d="M2.5 9L21.5 9M2.5 15L21.5 15"/> </svg>
    `;
    }
};

@customElement('plugin-system--plugin-system-language-100555')
export class PluginSystemLanguage100555 extends PluginBaseModule {

    private msg: MessageType = messages['en'];


    @property({ type: Boolean }) autoPrepare: boolean = false;

    @property() actualLanguage: ILanguage = 'pt-BR'

    @query('.select-language') selectLanguage: HTMLSelectElement | undefined;

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
        this.getUserLanguage();

        return html`
            <div class="plugin-container">
                   <details open> 
                    <summary>${this.msg.languageLabel}</summary>
                    <div>
                        <select style="width:200px" .value=${this.actualLanguage} class="select-language">
                            <option value="default">Default</option>
                            <option value="pt-BR">pt-BR</option>
                            <option value="en-US">en-US</option>
                        </select>
                        <button style="margin-top:1rem" @click=${this.handleChangeLanguageClick}>${this.msg.alterarLabel}</button>
                    </div>
                </details>
            </div>
        `;
    }

    private getUserLanguage() {
        const userSettings = localStorage.getItem('userSettings');
        if (!userSettings) {
            this.actualLanguage = 'default';
            return;
        }
        const data: IUserSettings = JSON.parse(userSettings);
        if (!data || !data.language) {
            this.actualLanguage = 'default';
            return;
        }
        this.actualLanguage = data.language as ILanguage;
    }

    private handleChangeLanguageClick() {
        if (!this.selectLanguage) return;
        const language = this.selectLanguage.value as ILanguage;
        this.setUserLanguage(language);
        location.reload();
    }

    private setUserLanguage(language: ILanguage) {
        let data: IUserSettings = { language: '' }
        const userSettings = localStorage.getItem('userSettings');
        if (userSettings) data = JSON.parse(userSettings);

        if (language === 'default') this.actualLanguage = this.getUserDefault();
        else this.actualLanguage = language;

        data.language = language;
        localStorage.setItem('userSettings', JSON.stringify(data));
    }

    private getUserDefault(): ILanguage {
        const navigatorLanguage = this.getNavigatorLanguage();
        const acceptLanguages = ['en-US', 'pt-BR'];
        const defaultLang = acceptLanguages.includes(navigatorLanguage) ? navigatorLanguage : 'en-US';
        return defaultLang as ILanguage;
    }

        private getNavigatorLanguage() {
        const lg = navigator.language ? navigator.language : '';
        return lg;
    };



}

type ILanguage = 'pt-BR' | 'en-US' | 'default'
interface IUserSettings {
    language: string,
}
