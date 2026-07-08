/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleTextShadow.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { setState, getState } from '/_102029_/l2/collabState.js';
import { getMessageKey } from '/_102029_/l2/collabLitElement.js';
import { ICSSState } from '/_100555_/l2/utils/lessCSS.js';
import { convertColorToHex } from '/_102027_/l2/libCommom.js';
import '/_100555_/l2/utils/collabDsInputSelectColor.js';
import '/_100555_/l2/utils/collabDsInputRange.js';
import '/_100555_/l2/utils/collabDsInputSelectColor.js';
import '/_100555_/l2/utils/collabDsInputRange.js';

/// **collab_i18n_start**
const message_pt = {
    advanced: 'Avançado',
    xOffset: 'X Offset',
    yOffset: 'Y Offset',
    blur: 'Desfoque',
    color: 'Cor',
    gallery: 'Galeria',
    description: 'Um plugin abrangente para gerenciar e personalizar propriedades de sombra de texto. Aplique sombras sem esforço com deslocamentos ajustáveis, desfoque e opções de cores para melhorar a aparência e a legibilidade do texto.'

}

const message_en = {
    advanced: 'Advanced',
    xOffset: 'X Offset',
    yOffset: 'Y Offset',
    blur: 'Blur',
    color: 'Color',
    gallery: 'Galeria',
    description: 'A comprehensive plugin for managing and customizing text-shadow properties. Effortlessly apply shadows with adjustable offsets, blur, and color options to enhance text appearance and readability.'


}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const tags = ['text-shadow'];

export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}

@customElement('plugin-style--plugin-style-text-shadow-100555')
export class PluginStyleTextShadow extends StateLitElement {

    @property() showFull: string = 'true';
    @propertyDataSource() state: ICSSState | undefined;
    @property() position: 'left' | 'right' = 'left';
    @property() textShadow: string | undefined;

    @property() offSetX: string | undefined;
    @property() offSetY: string | undefined;
    @property() textBlur: string | undefined;
    @property() color: string | undefined;

    private msg: MessageType = messages['en'];

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    handleIcaStateChange(_key: string, _value: ICSSState) {
        if (_key !== `less.${this.position}` || !_value) return;
        if (_value.emitter === 'helper') return;
        if (!_value.selector || !_value.lessCSS || !_value.lessCSS.lessAST || !_value.lessCSS.lessAST.ast[_value.selector]) return;
        const actualAst = _value.lessCSS.lessAST.ast[_value.selector];
        if (!actualAst) return;
        let hasRuleTextShadowInAST: boolean = false;
        Object.keys(actualAst).forEach((prop) => {
            if (prop === 'text-shadow') hasRuleTextShadowInAST = true;
        });
        this.clear();

        if (hasRuleTextShadowInAST) {
            this._onIcaStateChange();
        }
    }

    private clear() {
        this.textShadow = undefined;
        this.offSetX = undefined;
        this.offSetY = undefined;
        this.textBlur = undefined;
        this.color = undefined;
    }

    private _onIcaStateChange() {
        if (!this.state || !this.state.lessCSS) return;
        const rule = this.findCSSRuleInIframe(this.state.lessCSS.selector);
        if (!rule) return;
        this.setValues(rule);
    }

    private findCSSRuleInIframe(ruleSelector: string): CSSStyleRule | null {

        const json = this.state?.lessCSS?.lessAST.ast[ruleSelector];
        if (!json) return null;

        const properties = Object.entries(json)
            .filter(([key]) => !key.startsWith('_'))
            .sort(([, a], [, b]) => (a as { line: number }).line - (b as { line: number }).line);

        let ruleText = properties.map(([key, item]) => `${key}: ${(item as { value: string }).value};`).join(' ');
        const selector = ruleSelector;
        const cssStyleSheet = new CSSStyleSheet();
        const ruleIndex = cssStyleSheet.insertRule(`${selector} { ${ruleText} }`, 0);
        const cssStyleRule = cssStyleSheet.cssRules[ruleIndex];
        return cssStyleRule as CSSStyleRule;

    }

    private setValues(rule: CSSStyleRule) {

        if (rule.style) {
            for (let i = 0; i < rule.style.length; i++) {
                const propertyName = rule.style[i];
                if (propertyName === 'text-shadow') {
                    const propertyValue = rule.style.getPropertyValue(propertyName);
                    const convertedProp = this.state?.lessCSS?.lessAST.toCamelCaseProperty(propertyName);
                    if (!convertedProp) return;
                    (this as any)[convertedProp] = propertyValue;
                }
            }
        }
        this.setValues2();
    }


    private setValues2() {

        const auxTextShadow: any = {
            offSetX: '',
            offSetY: '',
            color: '',
            blur: '',
        }

        let value = this.textShadow;
        if (!value) return;

        if (value.indexOf('rgb') >= 0) {
            auxTextShadow.color = value.substring(value.indexOf('rgb'), value.indexOf(')') + 1);
            value = value.replace(auxTextShadow.color, '').trim();
        } else if (value.indexOf('#') >= 0) {
            auxTextShadow.color = value.substring(value.indexOf('#'), value.indexOf(' ') + 1).trim();
            value = value.replace(auxTextShadow.color, '').trim();
        } else if (/[a-z]/.test(value.substring(0, 1))) {
            auxTextShadow.color = value.substring(value.indexOf(value.substring(0, 2)), value.indexOf(' ') + 1).trim();
            value = value.replace(auxTextShadow.color, '').trim();
        }

        const arrayValues = value.split(' ');
        this.offSetX = arrayValues[0] || '';
        this.offSetY = arrayValues[1] || '';
        this.textBlur = arrayValues[2] || '';
        this.color = auxTextShadow.color;

    }



    private arrayGallery = [
        '',
        'text-shadow: 2px 2px;',
        'text-shadow: 2px 2px 5px;',
        'text-shadow: 0 0 3px',
        'text-shadow: 3px 3px 3px;',
        'text-shadow: 3px -3px 3px;',
        'text-shadow: 1px 1px 2px #000;',
        'text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);',
        'text-shadow: -2px 2px 4px #333;',
        'text-shadow: 0 0 5px #f00;',
        'text-shadow: 4px 4px 6px rgba(50, 50, 50, 0.75);',
        'text-shadow: -3px -3px 4px #888;',
        'text-shadow: 5px 5px 10px #ff6347;',
        'text-shadow: 1px 2px 0 #000, 2px 3px 0 #ff0;',
        'text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);',
        'text-shadow: 2px 2px 8px #006400;',
        'text-shadow: 6px 6px 10px #0000ff;',
        'text-shadow: 0 0 2px #ccc, 2px 2px 4px #000;',
        'text-shadow: -1px -1px 3px #555;',
        'text-shadow: 2px 2px 5px rgba(100, 100, 100, 0.5);',
        'text-shadow: 0px 1px 1px #999, 0px 2px 2px #666;',
    ];

    private mountValue(): void {
        let value = '';
        if (this.offSetX) value = this.offSetX;
        if (this.offSetY) value += ' ' + this.offSetY;
        if (this.textBlur) value += ' ' + this.textBlur;
        if (this.color) value += ' ' + this.color;
        this.textShadow = value;
        this.setState();
    }


    private setState() {
        setState(`less.${this.position}.emitter`, 'helper');
        const styles: CSSStyleDeclaration = getState(`less.${this.position}.lessCSS.styles`);
        styles.textShadow = this.textShadow || '';
    }

    private timeonChangeProp = -1;

    private handleChange(e: KeyboardEvent) {
        console.info('change');
        clearTimeout(this.timeonChangeProp);
        const el = e.detail ? (e.detail as any).target : e.target as HTMLInputElement;
        const prop = el.getAttribute('prop');
        if (!prop) return;
        if (this.timeonChangeProp) window.clearTimeout(this.timeonChangeProp);
        this.timeonChangeProp = window.setTimeout(() => {
            (this as any)[prop] = el.value;
            this.mountValue();
        }, 100);
    }


    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
             ${this.showFull === 'true' ?
                html`
                ${this.renderGallery()}
                ${this.renderColumn()}
            ` :
                html`
                ${this.renderGallery()}
            `
            }
        `;
    }



    renderColumn() {
        return html`
            <div>
                <div class="group">
                    <span>${this.msg.xOffset}</span>
                    <div class="group-edit">
                        <utils--collab-ds-input-range-100555
                            prop="offSetX"
                            value=${this.offSetX}
                            .arraySelect=${this.tpMeasures}  
                            @onchange=${this.handleChange}
                        ></utils--collab-ds-input-range-100555>
                    </div>

                    <span>${this.msg.yOffset}</span>
                    <div class="group-edit">
                        <utils--collab-ds-input-range-100555
                            prop="offSetY"
                            value=${this.offSetY}
                            .arraySelect=${this.tpMeasures}  
                            @onchange=${this.handleChange}
                        ></utils--collab-ds-input-range-100555>
                    </div>

                    <span>${this.msg.blur}</span>
                    <div class="group-edit">
                        <utils--collab-ds-input-range-100555
                            prop="textBlur"
                            value=${this.textBlur}
                            .arraySelect=${this.tpMeasures}  
                            @onchange=${this.handleChange}
                        ></utils--collab-ds-input-range-100555>
                    </div>
                    
                    <span>${this.msg.color}</span>
                    <div class="group-edit">
                        <utils--collab-ds-input-select-color-100555 
                            prop="color" 
                            useInput="false"
                            useSelect="false" 
                            _valueColor=${convertColorToHex(this.color || '')}
                            @onchange=${this.handleChange}
                        ></utils--collab-ds-input-select-color-100555>
                    </div>
                </div>
            </div>
        `;
    }

    renderGallery() {
        return html`
            <div class="gallery">
                ${repeat(this.gallery, ((key: any) => key) as any,
            ((galleryItem: IGallery, index: number) => {
                return html`<h5 style="${galleryItem.style}" @click=${() => { this.onGalleryClick(galleryItem) }}>Item</h5>`;
            }) as any
        )}
            </div>
         `
    }

    private async onGalleryClick(item: IGallery) {
        this.textShadow = item.state.textShadow;
        this.setValues2();
        await this.updateComplete;
        this.setState();
    }

    private gallery: IGallery[] = [
        {
            state: { textShadow: '2px 2px' },
            style: 'text-shadow: 2px 2px;'
        },
        {
            state: { textShadow: '2px 2px 5px' },
            style: 'text-shadow: 2px 2px 5px;'
        },
        {
            state: { textShadow: '0 0 3px' },
            style: 'textShadow: 0 0 3px;'
        },
        {
            state: { textShadow: '3px 3px 3px' },
            style: 'text-shadow: 3px 3px 3px;'
        },
        {
            state: { textShadow: '3px -3px 3px' },
            style: 'text-shadow: 3px -3px 3px;'
        },
        {
            state: { textShadow: '1px 1px 2px #000' },
            style: 'text-shadow: 1px 1px 2px #000;'
        },
        {
            state: { textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' },
            style: 'text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);'
        },
        {
            state: { textShadow: '-2px 2px 4px #333' },
            style: 'text-shadow: -2px 2px 4px #333;'
        },
        {
            state: { textShadow: '0 0 5px #f00' },
            style: 'text-shadow: 0 0 5px #f00;'
        },
        {
            state: { textShadow: '4px 4px 6px rgba(50, 50, 50, 0.75)' },
            style: 'text-shadow: 4px 4px 6px rgba(50, 50, 50, 0.75);'
        },
        {
            state: { textShadow: '-3px -3px 4px #888' },
            style: 'text-shadow: -3px -3px 4px #888;'
        },
        {
            state: { textShadow: '5px 5px 10px #ff6347' },
            style: 'text-shadow: 5px 5px 10px #ff6347;'
        },
        {
            state: { textShadow: '1px 2px 0 #000, 2px 3px 0 #ff0' },
            style: 'text-shadow: 1px 2px 0 #000, 2px 3px 0 #ff0;'
        },
        {
            state: { textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' },
            style: 'text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);'
        },
        {
            state: { textShadow: '2px 2px 8px #006400' },
            style: 'text-shadow: 2px 2px 8px #006400;'
        },
        {
            state: { textShadow: '6px 6px 10px #0000ff' },
            style: 'text-shadow: 6px 6px 10px #0000ff;'
        },
        {
            state: { textShadow: '0 0 2px #ccc, 2px 2px 4px #000' },
            style: 'text-shadow: 0 0 2px #ccc, 2px 2px 4px #000;'
        },
        {
            state: { textShadow: '-1px -1px 3px #555' },
            style: 'text-shadow: -1px -1px 3px #555;'
        },
        {
            state: { textShadow: '2px 2px 5px rgba(100, 100, 100, 0.5)' },
            style: 'text-shadow: 2px 2px 5px rgba(100, 100, 100, 0.5);'
        },
        {
            state: { textShadow: '0px 1px 1px #999, 0px 2px 2px #666' },
            style: 'text-shadow: 0px 1px 1px #999, 0px 2px 2px #666;'
        },

    ];

}

interface IGallery {
    style: string,
    state: {
        textShadow: string,
    }
}
