/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleTokens.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getMessageKey } from '/_102029_/l2/collabLitElement.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { getTokens } from '/_102027_/l2/designSystemBase.js';

import { ICSSState } from '/_100555_/l2/utils/lessCSS.js';

/// **collab_i18n_start**
const message_pt = {
    description: 'Um plugin especializado para gerenciar tokens de design de cores. Defina, organize e aplique facilmente paletas de cores para garantir consistência em seus designs, melhorando a acessibilidade e o apelo visual em seus projetos.'
}

const message_en = {
    description: 'A specialized plugin for managing color design tokens. Easily define, organize, and apply color palettes to ensure consistency across your designs, enhancing accessibility and visual appeal in your projects.'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const tags = ['color:@*', 'background-color:@*', 'background:@*'];

export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}

@customElement('plugin-style--plugin-style-tokens-100555')
export class PluginCssTokens extends StateLitElement {

    private msg: MessageType = messages['en'];

    @propertyDataSource() state: ICSSState | undefined;

    @property() position: 'left' | 'right' = 'left';

    @property() level: number = 0;

    @property({ reflect: true }) prop: string = '';

    @property({ reflect: true }) value: string = '';

    @property() theme: string = 'Default';

    @property() tokens: Record<string, Record<string, Record<string, string>>> = {};

    private needOrder: boolean = true;

    private async getTokensColor() {
        const project = mls.actualProject;
        if(!project) throw new Error('Invalid project selected')
        const tokens = await getTokens(project)
        const resumeTokensByTheme = tokens.find((tk) => tk.themeName === this.theme);
        if (!resumeTokensByTheme) return undefined;
        const tokensColorKeys = Object.keys(resumeTokensByTheme.color);
        const filter = this.value.startsWith('@') ? this.value.substring(1, this.value.length) : this.value;
        const res = tokensColorKeys.filter((key) => !key.startsWith('_dark')).map((key2) => {
            return {
                key: key2,
                value: resumeTokensByTheme.color[key2]
            }
        });

        const grouping = this.groupColorsByState(res);
        if (!this.needOrder) return grouping;

        const sortedColors = Object.keys(grouping)
            .sort((a, b) => {
                if (filter.indexOf(a) > -1) return -1;
                if (filter.indexOf(b) > -1) return 1;
                return 0;
            })
            .reduce((result, key) => {
                result[key] = grouping[key];
                return result;
            }, {} as Record<string, any>);

        this.needOrder = false;
        return sortedColors;
    }

    private groupColorsByState(items: { key: string, value: string }[]) {
        const grouped: Record<string, Record<string, Record<string, string>>> = {};

        items.forEach(item => {

            const match = item.key.match(/^(.*?)(-(hover|focus|disabled))?$/);
            const baseKey = match ? match[1].replace(/-(lighter|darker|dark|light)/, '') : item.key;
            const state = match && match[3] ? match[3] : 'default';

            const variation = item.key.includes('lighter')
                ? 'lighter'
                : item.key.includes('darker')
                    ? 'darker'
                    : item.key.includes('dark')
                        ? 'dark'
                        : item.key.includes('light')
                            ? 'light'
                            : 'default';

            if (!grouped[baseKey]) {
                grouped[baseKey] = {};
            }

            if (!grouped[baseKey][state]) {
                grouped[baseKey][state] = { dark: "", light: "", lighter: "", darker: "", default: "" };
            }

            grouped[baseKey][state][variation] = item.value;
        });

        return grouped;
    }

    handleColorClick(key: string, value: string) {
        if (!this.state || !this.state.lessCSS || !this.state.selector || !this.prop) return;
        this.state.lessCSS.styles[this.prop as any] = `@${key}`;
    }

    setTooltip() {
        const doc: Document = this.ownerDocument || document;
        const tooltipEl = doc.querySelector('collab-tooltip') as any;
        this.querySelectorAll('.token-item').forEach((item) => {
            if (tooltipEl && tooltipEl.tooltip) tooltipEl.tooltip(item);
        })

    }

    async getTokens() {

        if (!this.needOrder && this.tokens) return;
        const tokens = await this.getTokensColor();
        if (tokens) this.tokens = tokens;
    }

    updated(changedProperties: any) {
        if (changedProperties.has('tokens')) {
            this.setTooltip();
        }
        if (changedProperties.has('value') && changedProperties.get('value')) {
            this.getTokens();
        }
    }

    async firstUpdated(a: any) {
        super.firstUpdated(a)
        this.getTokens();
    }

    handleIcaStateChange(_key: string, _value: ICSSState) {
        if (_key !== `less.${this.position}` || !_value) return;
        if (!_value.value?.startsWith('@')) {
            this.needOrder = true;
            return;
        }
        const { key, value } = _value;
        this.prop = key || '';
        this.value = value || '';
    }

    render() {

        return html`
            <div>
                ${Object.keys(this.tokens).map((cat) => html`
                <div class="tokens-container">
                    ${cat}
                    <div class="tokens-content">
                    ${Object.keys(this.tokens[cat]).map((state) => html`
                        <div class="token">
                        ${Object.keys(this.tokens[cat][state]).map((variation) => {
            return this.tokens[cat][state][variation] ? html`
                            <div
                                @click=${() => { this.handleColorClick(`${cat}${variation !== 'default' ? '-' + variation : ''}${state !== 'default' ? '-' + state : ''}`, this.tokens[cat][state][variation]) }} 
                                class="token-item${this.value === `@${cat}${variation !== 'default' ? '-' + variation : ''}${state !== 'default' ? '-' + state : ''}` ? ' selected' : ''} "
                                data-tooltip="${cat}${variation !== 'default' ? '-' + variation : ''}${state !== 'default' ? '-' + state : ''}"
                                style="background-color: ${this.tokens[cat][state][variation]};border-color: ${this.tokens[cat][state][variation]}">
                            
                            </div>
                            ` : html``;
        })}
                        </div>
                    `)}
                    </div>
                </div>
                `)}
            </div>
            `;

    }


}

