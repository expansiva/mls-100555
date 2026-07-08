/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleBorder.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property, query, queryAll } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { setState, getState } from '/_102029_/l2/collabState.js';
import { getMessageKey } from '/_102029_/l2/collabLitElement.js';
import { CollabDsInputSelectColor } from '/_100555_/l2/utils/collabDsInputSelectColor.js';
import { convertColorToHex } from '/_102027_/l2/libCommom.js';
import { ICSSState } from '/_100555_/l2/utils/lessCSS.js';
import '/_100555_/l2/utils/collabDsInputSelectColor.js';
import '/_100555_/l2/utils/collabDsInputRange.js';

import {
    collab_lock,
    collab_lock_open,
    collab_border_top,
    collab_border_left,
    collab_border_right,
    collab_border_bottom,
    collab_border_bottomLeft,
    collab_border_bottomRight,
    collab_border_topLeft,
    collab_border_topRight

} from '/_100555_/l2/utils/collabIcons.js'

/// **collab_i18n_start**
const message_pt = {
    advanced: 'Avançado',
    all: 'Todos os cantos',
    border: 'Borda',
    gallery: 'Galeria',
    top: 'Superior',
    left: 'Esquerda',
    bottom: 'Inferior',
    right: 'Direita',
    borderRadius: 'Raio da borda',
    topLeft: 'Superior/Esquerda',
    topRight: 'Superior/Direita',
    bottomLeft: 'Inferior/Esquerda',
    bottomRight: 'Inferior/Direita',
    description: 'Plugin desenvolvido para facilitar a manutenção, personalização e validação de propriedades de borda em estilos CSS, oferecendo suporte a ajustes dinâmicos e regras específicas.'

}

const message_en = {
    advanced: 'Advanced',
    all: 'All corners',
    border: 'Border',
    gallery: 'Gallery',
    top: 'Top',
    left: 'Left',
    bottom: 'Bottom',
    right: 'Right',
    borderRadius: 'Border Radius',
    topLeft: 'Top/Left',
    topRight: 'Top/Right',
    bottomLeft: 'Bottom/Left',
    bottomRight: 'Bottom/Right',
    description: 'Plugin designed to simplify the maintenance, customization, and validation of border properties in CSS styles, providing support for dynamic adjustments and specific rules.'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const tags = ['border*'];
export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}


@customElement('plugin-style--plugin-style-border-100555')
export class PluginStyleBorder extends StateLitElement {

    private msg: MessageType = messages['en'];

    @property() showFull: string = 'false';
    @propertyDataSource() state: ICSSState | undefined;
    @property() position: 'left' | 'right' = 'left';

    @property() borderLocked: boolean = false;
    @property() borderRadiusLocked: boolean = false;

    @property() borderLeft: string | undefined;
    @property() borderRight: string | undefined;
    @property() borderTop: string | undefined;
    @property() borderBottom: string | undefined;

    @property() borderLeftWidth: string | undefined;
    @property() borderRightWidth: string | undefined;
    @property() borderTopWidth: string | undefined;
    @property() borderBottomWidth: string | undefined;

    @property() borderLeftStyle: string | undefined;
    @property() borderRightStyle: string | undefined;
    @property() borderTopStyle: string | undefined;
    @property() borderBottomStyle: string | undefined;

    @property() borderLeftColor: string | undefined;
    @property() borderRightColor: string | undefined;
    @property() borderTopColor: string | undefined;
    @property() borderBottomColor: string | undefined;


    @property() borderTopLeftRadius: string | undefined;
    @property() borderTopRightRadius: string | undefined;
    @property() borderBottomLeftRadius: string | undefined;
    @property() borderBottomRightRadius: string | undefined;


    @query('#helper-border-radius-lock') inputLockRadius: HTMLInputElement | undefined;
    @query('#helper-border-lock') inputLock: HTMLInputElement | undefined;
    @queryAll('utils--collab-ds-input-select-color-100555') borderInputs: CollabDsInputSelectColor[] | undefined;
    @queryAll('utils--collab-ds-input-range-100555') borderRadiusInputs: HTMLInputElement[] | undefined;

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    private tpBorder = ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset', 'hidden'];

    handleIcaStateChange(_key: string, _value: ICSSState) {

        if (_key !== `less.${this.position}` || !_value) return;
        if (_value.emitter === 'helper') return;
        if (!_value.selector || !_value.lessCSS || !_value.lessCSS.lessAST || !_value.lessCSS.lessAST.ast[_value.selector]) return;
        const actualAst = _value.lessCSS.lessAST.ast[_value.selector];
        if (!actualAst) return;
        let hasRuleBorderInAST: boolean = false;
        Object.keys(actualAst).forEach((prop) => {
            if (prop.startsWith('border')) hasRuleBorderInAST = true;
        });
        this.clear();

        if (hasRuleBorderInAST) {
            this._onIcaStateChange();
        }

    }

    private clear() {
        this.borderLocked = false;
        this.borderRadiusLocked = false;
        this.borderLeft = undefined;
        this.borderRight = undefined;
        this.borderTop = undefined;
        this.borderBottom = undefined;
        this.borderLeftWidth = undefined;
        this.borderRightWidth = undefined;
        this.borderTopWidth = undefined;
        this.borderBottomWidth = undefined;
        this.borderLeftStyle = undefined;
        this.borderRightStyle = undefined;
        this.borderTopStyle = undefined;
        this.borderBottomStyle = undefined;
        this.borderLeftColor = undefined;
        this.borderRightColor = undefined;
        this.borderTopColor = undefined;
        this.borderBottomColor = undefined;
        this.borderTopLeftRadius = undefined;
        this.borderTopRightRadius = undefined;
        this.borderBottomLeftRadius = undefined;
        this.borderBottomRightRadius = undefined;
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
                ${this.renderBorderGallery()}
                <div style=${this.showFull === 'false' ? 'display:none' : 'display:block'} >
                    ${this.renderBorder()}
                </div>
                <div style=${this.showFull === 'false' ? 'display:none' : 'display:block'} >
                    ${this.renderBorderRadius()}
                </div>
        `;
    }

    renderBorder() {
        return html`
            <h5 class="helper-group-title" >${this.msg.border}</h5>
            <div class="helper-group-lock">
                <input id="helper-border-lock" ?checked=${this.borderLocked} type="checkbox" @change=${this.handleChangeLockBorder}>
                <label for="helper-border-lock"> ${this.msg.all}</label>
                <i>${this.borderLocked ? collab_lock : collab_lock_open}</i>
            </div>

            <div class="group">

                <div class="group-edit">
                    <i data-tooltip="${this.msg.top}">${collab_border_top}</i>
                    <utils--collab-ds-input-select-color-100555
                        prop="border-top"
                        _valueInput=${this.borderTopWidth}
                        _valueSelect=${this.borderTopStyle}
                        _valueColor=${convertColorToHex(this.borderTopColor || '')}
                        .arrayInputSelect=${this.tpMeasures} 
                        .arraySelect=${this.tpBorder} 
                        group="border"
                        @onchange="${(e: KeyboardEvent) => this.handleChangeBorder(e)}"
                    ></utils--collab-ds-input-select-color-100555>
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.left}" >${collab_border_left}</i>
                    <utils--collab-ds-input-select-color-100555
                        prop="border-left"
                        _valueInput=${this.borderLeftWidth}
                        _valueSelect=${this.borderLeftStyle}
                        _valueColor=${convertColorToHex(this.borderLeftColor || '')}
                        .arrayInputSelect=${this.tpMeasures} 
                        .arraySelect=${this.tpBorder} 
                        group="border" 
                        @onchange="${(e: KeyboardEvent) => this.handleChangeBorder(e)}"
                    ></utils--collab-ds-input-select-color-100555>   
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.bottom}">${collab_border_bottom}</i>
                    <utils--collab-ds-input-select-color-100555
                        prop="border-bottom"
                        _valueInput=${this.borderBottomWidth}
                        _valueSelect=${this.borderBottomStyle}
                        _valueColor=${convertColorToHex(this.borderBottomColor || '')}
                        .arrayInputSelect=${this.tpMeasures} 
                        .arraySelect=${this.tpBorder} 
                         group="border" 
                        @onchange="${(e: KeyboardEvent) => this.handleChangeBorder(e)}"
                    ></utils--collab-ds-input-select-color-100555>
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.right}">${collab_border_right}</i>
                    <utils--collab-ds-input-select-color-100555
                        prop="border-right"
                        _valueInput=${this.borderRightWidth}
                        _valueSelect=${this.borderRightStyle}
                        _valueColor=${convertColorToHex(this.borderRightColor || '')}
                        .arrayInputSelect=${this.tpMeasures} 
                        .arraySelect=${this.tpBorder} 
                        group="border" 
                        @onchange="${(e: KeyboardEvent) => this.handleChangeBorder(e)}"
                    ></utils--collab-ds-input-select-color-100555>

                </div>
            </div>

        `
    }

    renderBorderRadius() {
        return html`
            <h5 class="helper-group-title" >${this.msg.borderRadius}</h5>
                <div class="helper-group-lock">
                <input id="helper-border-radius-lock" ?checked=${this.borderRadiusLocked} type="checkbox" @change=${this.handleChangeLockBorderRadius}>
                <label for="helper-border-radius-lock"> ${this.msg.all}</label>
                <i>${this.borderRadiusLocked ? collab_lock : collab_lock_open}</i>
            </div>

            <div class="group">

                <div class="group-edit">
                    <i data-tooltip="${this.msg.topLeft}">${collab_border_topLeft}</i>
                    <utils--collab-ds-input-range-100555
                        prop="border-top-left-radius"
                        value=${this.borderTopLeftRadius}
                        .arraySelect=${this.tpMeasures}  
                        group="radius"
                        @onchange="${(e: KeyboardEvent) => this.handleChangeBorderRadius(e)}"
                    ></utils--collab-ds-input-range-100555>
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.topRight}">${collab_border_topRight}</i>
                    <utils--collab-ds-input-range-100555
                        prop="border-top-right-radius"
                        value=${this.borderTopRightRadius}
                        .arraySelect=${this.tpMeasures} 
                        group="radius"
                        @onchange="${(e: KeyboardEvent) => this.handleChangeBorderRadius(e)}"
                    ></utils--collab-ds-input-range-100555>    

                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.bottomLeft}">${collab_border_bottomLeft}</i>
                    <utils--collab-ds-input-range-100555
                        prop="border-bottom-left-radius"
                        value=${this.borderBottomLeftRadius}
                        .arraySelect=${this.tpMeasures} 
                        group="radius"
                        @onchange="${(e: KeyboardEvent) => this.handleChangeBorderRadius(e)}"
                    ></utils--collab-ds-input-range-100555> 

                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.bottomRight}">${collab_border_bottomRight}</i>
                    <utils--collab-ds-input-range-100555
                        prop="border-bottom-right-radius"
                        value=${this.borderBottomRightRadius}
                        .arraySelect=${this.tpMeasures} 
                        group="radius"
                        @onchange="${(e: KeyboardEvent) => this.handleChangeBorderRadius(e)}"
                    ></utils--collab-ds-input-range-100555> 
                </div>
            </div>

        `
    }

    renderBorderGallery() {
        return html`
            <div class="gallery">
                ${repeat(this.gallery, ((key: string) => key) as any,
            ((galleryItem: IGallery, index: number) => {
                return html`<span style="${galleryItem.style}" @click=${() => { this.onGalleryClick(galleryItem) }} > Item</span>`;
            }) as any
        )}
            </div>
        
        `
    }

    private timeonChangeBorder = -1;
    private handleChangeBorder(e: KeyboardEvent) {
        if (this.timeonChangeBorder) window.clearTimeout(this.timeonChangeBorder);
        const el = (e.detail as any).target as CollabDsInputSelectColor;
        const prop = el.getAttribute('prop');
        if (!prop) return;
        const convertedProp = this.state?.lessCSS?.lessAST.toCamelCaseProperty(prop);
        this.timeonChangeBorder = window.setTimeout(() => {
            if (!this.borderLocked) {
                if (!convertedProp) return;
                (this as any)[convertedProp] = el.value;
                this.setState();
                return;
            }
            this.borderInputs?.forEach((inp) => {
                if (inp === el) return;
                inp.value = el.value;
            });
            this.borderBottomWidth = this.borderLeft = this.borderRight = this.borderTop = el.value;
            this.setState();
        }, 100);
    }

    private timeonChangeBorderRadius = -1;
    private handleChangeBorderRadius(e: KeyboardEvent) {
        if (this.timeonChangeBorderRadius) window.clearTimeout(this.timeonChangeBorderRadius);
        const el = (e.detail as any).target as HTMLInputElement;
        const prop = el.getAttribute('prop');
        if (!prop) return;
        const convertedProp = this.state?.lessCSS?.lessAST.toCamelCaseProperty(prop);
        this.timeonChangeBorderRadius = window.setTimeout(() => {
            if (!this.borderRadiusLocked) {
                if (!convertedProp) return;
                (this as any)[convertedProp] = el.value;
                this.setState();
                return;
            }
            this.borderRadiusInputs?.forEach((inp) => {
                if (inp === el) return;
                inp.value = el.value;
            });
            this.borderBottomLeftRadius = this.borderBottomRightRadius = this.borderTopLeftRadius = this.borderTopRightRadius = el.value;
            this.setState();
        }, 100);
    }

    private handleChangeLockBorderRadius() {
        if (!this.inputLockRadius) return;
        this.borderRadiusLocked = this.inputLockRadius.checked;

    }

    private handleChangeLockBorder() {
        if (!this.inputLock) return;
        this.borderLocked = this.inputLock.checked;
    }

    private _onIcaStateChange() {
        if (!this.state || !this.state.lessCSS) return;
        const rule = this.findCSSRuleInIframe(this.state.lessCSS.selector);
        if (!rule) return;
        this.setValues(rule);
    }

    private setBorderValues() {
        const aux: { [key: string]: Function } = {
            'border-bottom': (value: string) => { this.borderBottom = value },
            'border-top': (value: string) => { this.borderTop = value },
            'border-left': (value: string) => { this.borderLeft = value },
            'border-right': (value: string) => { this.borderRight = value },
        }
        this.borderInputs?.forEach((bdInp) => {
            const prop = bdInp.getAttribute('prop');
            if (!prop) return;
            aux[prop](bdInp.value);
        })
    }


    private setState() {

        this.setBorderValues();

        const allBorder = [this.borderTop, this.borderLeft, this.borderBottom, this.borderRight];
        const areBordersAllEqual = allBorder.every(value => value === allBorder[0]);
        const areBorderPairsEqual = (this.borderTop === this.borderBottom) && (this.borderLeft === this.borderRight);

        const allBorderRadius = [this.borderBottomRightRadius, this.borderBottomLeftRadius, this.borderTopLeftRadius, this.borderTopRightRadius];
        const areBorderRadiussAllEqual = allBorderRadius.every(value => value === allBorderRadius[0]);
        const areBorderRadiusPairsEqual = (this.borderBottomLeftRadius === this.borderTopLeftRadius) && (this.borderBottomRightRadius === this.borderTopRightRadius);

        let borderValue: any;
        let borderRadiusValue: any;

        if (areBordersAllEqual) borderValue = this.borderTop;
        else if (areBorderPairsEqual) borderValue = `${this.borderTop} ${this.borderRight}`;
        else {
            borderValue = {
                borderTop: this.borderTop,
                borderRight: this.borderRight,
                borderBottom: this.borderBottom,
                borderLeft: this.borderLeft,
            };
        }

        if (areBorderRadiussAllEqual) borderRadiusValue = this.borderTopLeftRadius;
        else if (areBorderRadiusPairsEqual) borderRadiusValue = `${this.borderTopLeftRadius} ${this.borderTopRightRadius}`;
        else {
            borderRadiusValue = {
                borderTopLeftRadius: this.borderTopLeftRadius,
                borderTopRightRadius: this.borderTopRightRadius,
                borderBottomLeftRadius: this.borderBottomLeftRadius,
                borderBottomRightRadius: this.borderBottomRightRadius,
            };
        }

        this.checkBorderEquals();
        this.checkBorderRadiusEquals();
        this.updateBorder(borderValue);
        this.updateBorderRadius(borderRadiusValue);


    }


    private updateBorderRadius(borderRadius: string | { [key: string]: string }) {
        if (borderRadius === undefined) return;

        setState(`less.${this.position}.emitter`, 'helper');
        const styles: CSSStyleDeclaration = getState(`less.${this.position}.lessCSS.styles`);

        if (typeof borderRadius === 'string') {
            styles.borderTopLeftRadius = styles.borderTopRightRadius = styles.borderBottomLeftRadius = styles.borderBottomRightRadius = '';
            styles.borderRadius = borderRadius;
        } else {
            styles.borderRadius = '';
            styles.borderBottomLeftRadius = borderRadius.borderBottomLeftRadius || '';
            styles.borderBottomRightRadius = borderRadius.borderBottomRightRadius || '';
            styles.borderTopLeftRadius = borderRadius.borderTopLeftRadius || '';
            styles.borderTopRightRadius = borderRadius.borderTopRightRadius || '';
        }

    }

    private updateBorder(border: string | { [key: string]: string }) {
        if (border === undefined) return;

        setState(`less.${this.position}.emitter`, 'helper');
        const styles: CSSStyleDeclaration = getState(`less.${this.position}.lessCSS.styles`);

        styles.breakInside

        if (typeof border === 'string') {
            styles.borderTop = styles.borderRight = styles.borderBottom = styles.borderLeft = '';
            styles.border = border;
        } else {
            styles.border = '';
            styles.borderTop = border.borderTop || '';
            styles.borderRight = border.borderRight || '';
            styles.borderBottom = border.borderBottom || '';
            styles.borderLeft = border.borderLeft || '';
        }

    }

    private setValues(rule: CSSStyleRule): void {

        const borderProps = ['border-left-width', 'border-bottom-width', 'border-top-width', 'border-right-width', 'border-left-style', 'border-bottom-style', 'border-top-style', 'border-right-style', 'border-left-color', 'border-bottom-color', 'border-top-color', 'border-right-color'];
        const borderRadiusProps = ['border-top-right-radius', 'border-top-left-radius', 'border-bottom-left-radius', 'border-bottom-right-radius'];
        if (rule.style) {
            for (let i = 0; i < rule.style.length; i++) {
                const propertyName = rule.style[i];

                if (borderRadiusProps.includes(propertyName)) {
                    const propertyValue = rule.style.getPropertyValue(propertyName);
                    const el = this.querySelector(`utils--collab-ds-input-range-100555[prop="${propertyName}"]`) as HTMLInputElement;
                    const convertedProp = this.state?.lessCSS?.lessAST.toCamelCaseProperty(propertyName);
                    if (!convertedProp) return;
                    (this as any)[convertedProp] = propertyValue;
                    if (el) {
                        el.defaultValue = propertyValue;
                        el.value = propertyValue;
                    }
                }

                if (borderProps.includes(propertyName)) {
                    const propertyValue = rule.style.getPropertyValue(propertyName);
                    const convertedProp = this.state?.lessCSS?.lessAST.toCamelCaseProperty(propertyName);
                    if (!convertedProp) return;
                    (this as any)[convertedProp] = propertyValue;
                }
            }

            this.checkBorderEquals();
            this.checkBorderRadiusEquals();

        }

    }

    private checkBorderEquals() {
        if (
            [this.borderBottomColor, this.borderTopColor, this.borderRightColor, this.borderLeftColor].every(borderColor => borderColor === this.borderBottomColor) &&
            [this.borderBottomStyle, this.borderTopStyle, this.borderRightStyle, this.borderLeftStyle].every(borderStyle => borderStyle === this.borderBottomStyle) &&
            [this.borderBottomWidth, this.borderTopWidth, this.borderRightWidth, this.borderLeftWidth].every(borderWidth => borderWidth === this.borderBottomWidth)
        ) {
            this.borderLocked = true;
            if (this.inputLock) this.inputLock.checked = true;
        } else {
            this.borderLocked = false;
            if (this.inputLock) this.inputLock.checked = false;
        }
    }

    private checkBorderRadiusEquals() {
        if ([this.borderBottomLeftRadius, this.borderBottomRightRadius, this.borderTopLeftRadius, this.borderTopRightRadius].every(borderRadius => borderRadius === this.borderTopRightRadius)) {
            this.borderRadiusLocked = true;
            if (this.inputLockRadius) this.inputLockRadius.checked = true;
        } else {
            this.borderRadiusLocked = false;
            if (this.inputLockRadius) this.inputLockRadius.checked = false;
        }
    }


    private replaceTokens(cssText: string) {
        const tokens = this.state?.lessCSS?.lessAST.ast.root;
        if (!tokens) return cssText;
        for (const [token, { value }] of Object.entries(tokens)) {
            const tokenRegex = new RegExp(token, 'g');
            cssText = cssText.replace(tokenRegex, value);
        }
        return cssText;
    }

    private findCSSRuleInIframe(ruleSelector: string): CSSStyleRule | null {

        const json = this.state?.lessCSS?.lessAST.ast[ruleSelector];
        if (!json) return null;

        const properties = Object.entries(json)
            .filter(([key]) => !key.startsWith('_'))
            .sort(([, a], [, b]) => (a as { line: number }).line - (b as { line: number }).line);

        let ruleText = properties.map(([key, item]) => `${key}: ${(item as { value: string }).value};`).join(' ');
        ruleText = this.replaceTokens(ruleText)

        const selector = ruleSelector;
        const cssStyleSheet = new CSSStyleSheet();
        const ruleIndex = cssStyleSheet.insertRule(`${selector} { ${ruleText} }`, 0);
        const cssStyleRule = cssStyleSheet.cssRules[ruleIndex];
        return cssStyleRule as CSSStyleRule;

    }

    private async onGalleryClick(item: IGallery) {

        this.borderLeftWidth = item.state.borderLeftWidth;
        this.borderRightWidth = item.state.borderRightWidth;
        this.borderTopWidth = item.state.borderTopWidth;
        this.borderBottomWidth = item.state.borderBottomWidth;
        this.borderLeftStyle = item.state.borderLeftStyle;
        this.borderRightStyle = item.state.borderRightStyle;
        this.borderTopStyle = item.state.borderTopStyle;
        this.borderBottomStyle = item.state.borderBottomStyle;
        this.borderLeftColor = item.state.borderLeftColor;
        this.borderRightColor = item.state.borderRightColor;
        this.borderTopColor = item.state.borderTopColor;
        this.borderBottomColor = item.state.borderBottomColor;
        this.borderTopLeftRadius = item.state.borderTopLeftRadius;
        this.borderTopRightRadius = item.state.borderTopRightRadius;
        this.borderBottomLeftRadius = item.state.borderBottomLeftRadius;
        this.borderBottomRightRadius = item.state.borderBottomRightRadius;
        await this.updateComplete;
        this.checkBorderEquals();
        this.checkBorderRadiusEquals();
        this.setState();
    }

    private gallery: IGallery[] = [
        {
            style: 'border: 3px solid #2c3e50; border-bottom: 6px groove #16a085;',
            state: {
                borderLeftWidth: '3px',
                borderRightWidth: '3px',
                borderTopWidth: '3px',
                borderBottomWidth: '6px',
                borderLeftStyle: 'solid',
                borderRightStyle: 'solid',
                borderTopStyle: 'solid',
                borderBottomStyle: 'groove',
                borderLeftColor: '#2c3e50',
                borderRightColor: '#2c3e50',
                borderTopColor: '#2c3e50',
                borderBottomColor: '#16a085',
                borderTopLeftRadius: '',
                borderTopRightRadius: '',
                borderBottomLeftRadius: '',
                borderBottomRightRadius: '',

            }
        },
        {
            style: 'border-left: 1px solid #000000; border-right: 1px solid #000000; border-top: 1px solid #000000;',
            state: {
                borderLeftWidth: '1px',
                borderRightWidth: '1px',
                borderTopWidth: '1px',
                borderBottomWidth: '',
                borderLeftStyle: 'solid',
                borderRightStyle: 'solid',
                borderTopStyle: 'solid',
                borderBottomStyle: '',
                borderLeftColor: '#000000',
                borderRightColor: '#000000',
                borderTopColor: '#000000',
                borderBottomColor: '',
                borderTopLeftRadius: '',
                borderTopRightRadius: '',
                borderBottomLeftRadius: '',
                borderBottomRightRadius: '',
            }
        },
        {
            style: 'border-left: 1px solid #000000; border-right: 1px solid #000000; border-bottom: 1px solid #000000;',
            state: {
                borderLeftWidth: '1px',
                borderRightWidth: '1px',
                borderTopWidth: '',
                borderBottomWidth: '1px',
                borderLeftStyle: 'solid',
                borderRightStyle: 'solid',
                borderTopStyle: '',
                borderBottomStyle: 'solid',
                borderLeftColor: '#000000',
                borderRightColor: '#000000',
                borderTopColor: '',
                borderBottomColor: '#000000',
                borderTopLeftRadius: '',
                borderTopRightRadius: '',
                borderBottomLeftRadius: '',
                borderBottomRightRadius: '',
            }
        },
        {
            style: 'border: 5px dashed #32557f;',
            state: {
                borderLeftWidth: '5px',
                borderRightWidth: '5px',
                borderTopWidth: '5px',
                borderBottomWidth: '5px',
                borderLeftStyle: 'dashed',
                borderRightStyle: 'dashed',
                borderTopStyle: 'dashed',
                borderBottomStyle: 'dashed',
                borderLeftColor: '#32557f',
                borderRightColor: '#32557f',
                borderTopColor: '#32557f',
                borderBottomColor: '#32557f',
                borderTopLeftRadius: '',
                borderTopRightRadius: '',
                borderBottomLeftRadius: '',
                borderBottomRightRadius: '',
            }
        },
        {
            style: 'border-left: 4px solid #e85f99; border-right: 4px solid #f18867; border-top: 4px solid #65587f; border-bottom: 4px solid #50bda1;',
            state: {
                borderLeftWidth: '4px',
                borderRightWidth: '4px',
                borderTopWidth: '4px',
                borderBottomWidth: '4px',
                borderLeftStyle: 'solid',
                borderRightStyle: 'solid',
                borderTopStyle: 'solid',
                borderBottomStyle: 'solid',
                borderLeftColor: '#e85f99',
                borderRightColor: '#f18867',
                borderTopColor: '#65587f',
                borderBottomColor: '#50bda1',
                borderTopLeftRadius: '',
                borderTopRightRadius: '',
                borderBottomLeftRadius: '',
                borderBottomRightRadius: '',
            }
        },
        {
            style: 'border: 8px groove;',
            state: {
                borderLeftWidth: '8px',
                borderRightWidth: '8px',
                borderTopWidth: '8px',
                borderBottomWidth: '8px',
                borderLeftStyle: 'groove',
                borderRightStyle: 'groove',
                borderTopStyle: 'groove',
                borderBottomStyle: 'groove',
                borderLeftColor: '',
                borderRightColor: '',
                borderTopColor: '',
                borderBottomColor: '',
                borderTopLeftRadius: '',
                borderTopRightRadius: '',
                borderBottomLeftRadius: '',
                borderBottomRightRadius: '',
            }
        },
        {
            style: 'border-top: 2px solid #3C514D; border-bottom: 3px dashed #3C514D; border-left: 5px double #212410; border-right: 3px dotted rgb(223,112,0);',
            state: {
                borderLeftWidth: '5px',
                borderRightWidth: '3px',
                borderTopWidth: '2px',
                borderBottomWidth: '3px',
                borderLeftStyle: 'double',
                borderRightStyle: 'dotted',
                borderTopStyle: 'solid',
                borderBottomStyle: 'dashed',
                borderLeftColor: '#212410',
                borderRightColor: 'rgb(223,112,0)',
                borderTopColor: '#3C514D',
                borderBottomColor: '#3C514D',
                borderTopLeftRadius: '',
                borderTopRightRadius: '',
                borderBottomLeftRadius: '',
                borderBottomRightRadius: '',
            }
        },
        {
            style: 'border: 3px double #3498db;',
            state: {
                borderLeftWidth: '3px',
                borderRightWidth: '3px',
                borderTopWidth: '3px',
                borderBottomWidth: '3px',
                borderLeftStyle: 'double',
                borderRightStyle: 'double',
                borderTopStyle: 'double',
                borderBottomStyle: 'double',
                borderLeftColor: '#3498db',
                borderRightColor: '#3498db',
                borderTopColor: '#3498db',
                borderBottomColor: '#3498db',
                borderTopLeftRadius: '',
                borderTopRightRadius: '',
                borderBottomLeftRadius: '',
                borderBottomRightRadius: '',
            }
        },
        {
            style: 'border: 6px outset #2ecc71;',
            state: {
                borderLeftWidth: '6px',
                borderRightWidth: '6px',
                borderTopWidth: '6px',
                borderBottomWidth: '6px',
                borderLeftStyle: 'outset',
                borderRightStyle: 'outset',
                borderTopStyle: 'outset',
                borderBottomStyle: 'outset',
                borderLeftColor: '#2ecc71',
                borderRightColor: '#2ecc71',
                borderTopColor: '#2ecc71',
                borderBottomColor: '#2ecc71',
                borderTopLeftRadius: '',
                borderTopRightRadius: '',
                borderBottomLeftRadius: '',
                borderBottomRightRadius: '',
            }
        },
        {
            style: 'border: 2px solid #e74c3c;',
            state: {
                borderLeftWidth: '2px',
                borderRightWidth: '2px',
                borderTopWidth: '2px',
                borderBottomWidth: '2px',
                borderLeftStyle: 'solid',
                borderRightStyle: 'solid',
                borderTopStyle: 'solid',
                borderBottomStyle: 'solid',
                borderLeftColor: '#e74c3c',
                borderRightColor: '#e74c3c',
                borderTopColor: '#e74c3c',
                borderBottomColor: '#e74c3c',
                borderTopLeftRadius: '',
                borderTopRightRadius: '',
                borderBottomLeftRadius: '',
                borderBottomRightRadius: '',
            }
        },
        {
            style: 'border-left: 8px ridge #8e44ad; border-right: 8px groove #16a085;',
            state: {
                borderLeftWidth: '8px',
                borderRightWidth: '8px',
                borderTopWidth: '',
                borderBottomWidth: '',
                borderLeftStyle: 'ridge',
                borderRightStyle: 'groove',
                borderTopStyle: '',
                borderBottomStyle: '',
                borderLeftColor: '#8e44ad',
                borderRightColor: '#16a085',
                borderTopColor: '',
                borderBottomColor: '',
                borderTopLeftRadius: '',
                borderTopRightRadius: '',
                borderBottomLeftRadius: '',
                borderBottomRightRadius: '',
            }
        },
        {
            style: 'border: 5px dotted #2980b9;',
            state: {
                borderLeftWidth: '5px',
                borderRightWidth: '5px',
                borderTopWidth: '5px',
                borderBottomWidth: '5px',
                borderLeftStyle: 'dotted',
                borderRightStyle: 'dotted',
                borderTopStyle: 'dotted',
                borderBottomStyle: 'dotted',
                borderLeftColor: '#2980b9',
                borderRightColor: '#2980b9',
                borderTopColor: '#2980b9',
                borderBottomColor: '#2980b9',
                borderTopLeftRadius: '',
                borderTopRightRadius: '',
                borderBottomLeftRadius: '',
                borderBottomRightRadius: '',
            }
        },
        {
            style: 'border: 4px dashed rgba(255, 165, 0, 0.8);',
            state: {
                borderLeftWidth: '4px',
                borderRightWidth: '4px',
                borderTopWidth: '4px',
                borderBottomWidth: '4px',
                borderLeftStyle: 'dashed',
                borderRightStyle: 'dashed',
                borderTopStyle: 'dashed',
                borderBottomStyle: 'dashed',
                borderLeftColor: 'rgba(255, 165, 0, 0.8)',
                borderRightColor: 'rgba(255, 165, 0, 0.8)',
                borderTopColor: 'rgba(255, 165, 0, 0.8)',
                borderBottomColor: 'rgba(255, 165, 0, 0.8)',
                borderTopLeftRadius: '',
                borderTopRightRadius: '',
                borderBottomLeftRadius: '',
                borderBottomRightRadius: '',
            }
        },
    ]
}


interface IGallery {
    style: string,
    state: {
        borderLeftWidth: string,
        borderRightWidth: string,
        borderTopWidth: string,
        borderBottomWidth: string,
        borderLeftStyle: string,
        borderRightStyle: string,
        borderTopStyle: string,
        borderBottomStyle: string,
        borderLeftColor: string,
        borderRightColor: string,
        borderTopColor: string,
        borderBottomColor: string,
        borderTopLeftRadius: string,
        borderTopRightRadius: string,
        borderBottomLeftRadius: string,
        borderBottomRightRadius: string,
    }
}