/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleBoxShadow.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { getState, setState } from '/_102029_/l2/collabState.js';
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
    offSetX: 'X Offset',
    offSetY: 'Y Offset',
    blur: 'Blur ',
    spread: 'Spread',
    color: 'Cor',
    description: 'Um plugin intuitivo para gerenciar e personalizar sombras em elementos com box-shadow. Ajuste cores, deslocamento, desfoque, expansão e modo (inset/outset) de maneira simples e eficaz. Ideal para criar interfaces visuais modernas e estilosas.'
}

const message_en = {
    advanced: 'Advanced',
    offSetX: 'X Offset',
    offSetY: 'Y Offset',
    blur: 'Blur ',
    spread: 'Spread',
    color: 'Color',
    description: 'An intuitive plugin to manage and customize shadows on elements using box-shadow. Easily adjust color, offset, blur, spread, and mode (inset/outset). Perfect for crafting modern and stylish visual interfaces.'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const tags = ['box-shadow'];

export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}

@customElement('plugin-style--plugin-style-box-shadow-100555')
export class PluginStyleBoxShadow extends StateLitElement {

    @property() showFull: string = 'true';
    @propertyDataSource() state: ICSSState | undefined;
    @property() position: 'left' | 'right' = 'left';

    @property() boxShadow: string | undefined;
    @property() color: string | undefined;
    @property() spread: string | undefined;
    @property() boxBlur: string | undefined;
    @property() offsetY: string | undefined;
    @property() offsetX: string | undefined;
    @property() shadowMode: 'inset' | 'outset' = 'outset';

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    private msg: MessageType = messages['en'];

    handleIcaStateChange(_key: string, _value: ICSSState) {
        if (_key !== `less.${this.position}` || !_value) return;
        if (_value.emitter === 'helper') return;
        if (!_value.selector || !_value.lessCSS || !_value.lessCSS.lessAST || !_value.lessCSS.lessAST.ast[_value.selector]) return;
        const actualAst = _value.lessCSS.lessAST.ast[_value.selector];
        if (!actualAst) return;
        let hasRuleBoxInAST: boolean = false;
        Object.keys(actualAst).forEach((prop) => {
            if (tags.includes(prop)) hasRuleBoxInAST = true;
        });
        this.clear();

        if (hasRuleBoxInAST) {
            this._onIcaStateChange();
        }
    }


    private clear() {
        this.boxShadow = undefined;
        this.color = undefined;
        this.spread = undefined;
        this.boxBlur = undefined;
        this.offsetY = undefined;
        this.offsetX = undefined;
        this.shadowMode = 'outset';
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

    private setValues2() {

        let value = this.boxShadow || '';
        if (!value) return;

        let vColor = '';
        if (value.indexOf('rgb') >= 0) {
            vColor = value.substring(value.indexOf('rgb'), value.indexOf(')') + 1);
            value = value.replace(vColor, '').trim();
        } else if (value.indexOf('#') >= 0) {
            vColor = value.substring(value.indexOf('#'), value.indexOf(' ') + 1).trim();
            value = value.replace(vColor, '').trim();
        } else if (/[a-z]/.test(value.substring(0, 1))) {
            vColor = value.substring(value.indexOf(value.substring(0, 2)), value.indexOf(' ') + 1).trim();
            value = value.replace(vColor, '').trim();
        }

        const arrayValues = value.split(' ');
        this.offsetX = arrayValues.length > 0 ? arrayValues[0] : '';
        this.offsetY = arrayValues.length > 1 ? arrayValues[1] : '';
        this.boxBlur = arrayValues.length > 2 ? arrayValues[2] : '';
        this.spread = arrayValues.length > 3 ? arrayValues[3] : '';
        this.color = vColor;
        if (value.indexOf('inset') >= 0) this.shadowMode = 'inset';

    }

    private setValues(rule: CSSStyleRule) {

        if (rule.style) {
            for (let i = 0; i < rule.style.length; i++) {
                const propertyName = rule.style[i];
                if (propertyName === 'box-shadow') {
                    const propertyValue = rule.style.getPropertyValue(propertyName);
                    const convertedProp = this.state?.lessCSS?.lessAST.toCamelCaseProperty(propertyName);
                    if (!convertedProp) return;
                    (this as any)[convertedProp] = propertyValue;
                }
            }
        }

        this.setValues2();


    }

    private mountValue(): void {
        let value = '';
        value += this.offsetX ? this.offsetX : '0px';
        value += this.offsetY ? ' ' + this.offsetY : ' 0px';
        value += this.boxBlur ? ' ' + this.boxBlur : ' 0px';
        value += this.spread ? ' ' + this.spread : ' 0px';
        value += this.color ? ' ' + this.color : '';
        value += this.shadowMode ? this.shadowMode === 'outset' ? '' : ' ' + this.shadowMode : '';
        if (!this.offsetX || !this.offsetY) value = '';
        this.boxShadow = value;
        this.setState();
    }

    private setState() {
        setState(`less.${this.position}.emitter`, 'helper');
        const styles: CSSStyleDeclaration = getState(`less.${this.position}.lessCSS.styles`);
        styles.boxShadow = this.boxShadow || '';
    }

    private timeonChangeProp = -1;

    private handleChange(e: KeyboardEvent) {
        if (this.timeonChangeProp) window.clearTimeout(this.timeonChangeProp);
        const el = e.detail ? (e.detail as any).target : e.target as HTMLInputElement;
        const prop = el.getAttribute('prop');
        if (!prop) return;
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
                    ${this.renderBoxShadow()}

                ` :
                html`
                    ${this.renderGallery()}
                `
            }
        `;

    }

    renderBoxShadow() {
        return html`
            <div class="group">
                <div class="group-edit">
                    <input type="radio" prop="shadowMode" ?checked=${this.shadowMode === 'outset'} id="outset" name="rgHcTypeBoxShadow" value="outset" @change=${this.handleChange}>
                    <label for="outset" >outset</label>
                    <input type="radio" prop="shadowMode" ?checked=${this.shadowMode === 'inset'} id="inset" name="rgHcTypeBoxShadow" value="inset" @change=${this.handleChange}>
                    <label for="inset" >inset</label>
                </div>
                <span>${this.msg.offSetX}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555
                    @onchange=${this.handleChange} 
                    prop="offsetX"
                    value=${this.offsetX} 
                    .arraySelect=${this.tpMeasures}  
                    ></utils--collab-ds-input-range-100555>
                </div>
                <span>${this.msg.offSetY}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555
                    @onchange=${this.handleChange} 
                    prop="offsetY"
                    value=${this.offsetY} 
                    .arraySelect=${this.tpMeasures}  
                    ></utils--collab-ds-input-range-100555>
                </div>
                <span>${this.msg.blur}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555
                    @onchange=${this.handleChange} 
                    prop="boxBlur"
                    value=${this.boxBlur} 
                    .arraySelect=${this.tpMeasures}  
                    ></utils--collab-ds-input-range-100555>
                </div>
                <span>${this.msg.spread}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555
                    @onchange=${this.handleChange} 
                    prop="spread"
                    value=${this.spread} 
                    .arraySelect=${this.tpMeasures}  
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
        `;
    }

    renderGallery() {
        return html`
            <div class="gallery">
                ${repeat(this.gallery, ((key: any) => key) as any,
            ((galleryItem: IGallery, index: number) => {
                return html`<div class="gallery-item" style="${galleryItem.style}" @click=${() => { this.onGalleryClick(galleryItem) }}></div>`;
            }) as any
        )}
            </div>
        
        `
    }

    private async onGalleryClick(item: IGallery) {
        this.boxShadow = item.state.boxShadow;
        this.setValues2();
        await this.updateComplete;
        this.setState();
    }

    private gallery: IGallery[] = [
        {
            state: { boxShadow: '0 10px 10px -5px;' },
            style: 'box-shadow: 0 10px 10px -5px;'
        },
        {
            state: { boxShadow: '0 0 10px 5px' },
            style: 'box-shadow: 0 0 10px 5px;'
        },
        {
            state: { boxShadow: '5px 5px 20px' },
            style: 'box-shadow: 5px 5px 20px;'
        },
        {
            state: { boxShadow: '5px -5px' },
            style: 'box-shadow: 5px -5px;'
        },
        {
            state: { boxShadow: '5px 5px' },
            style: 'box-shadow: 5px 5px;'
        },
        {
            state: { boxShadow: '-5px -5px 10px' },
            style: 'box-shadow: -5px -5px 10px;'
        },
        {
            state: { boxShadow: '5px 5px 10px' },
            style: 'box-shadow: 5px 5px 10px;'
        },
        {
            state: { boxShadow: 'inset 0 0 10px' },
            style: 'box-shadow: inset 0 0 10px;'
        },
        {
            state: { boxShadow: '0 0 10px' },
            style: 'box-shadow: 0 0 10px;'
        },
    ];

}

interface IGallery {
    style: string,
    state: {
        boxShadow: string,
    }
}