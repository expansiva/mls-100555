/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleMargin.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property, query, queryAll } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { setState, getState } from '/_102029_/l2/collabState.js';
import { getMessageKey } from '/_102029_/l2/collabLitElement.js';
import { ICSSState } from '/_100555_/l2/utils/lessCSS.js';
import '/_100555_/l2/utils/collabDsInputSelectColor.js';
import '/_100555_/l2/utils/collabDsInputRange.js';

import {
    collab_lock,
    collab_lock_open,
    collab_margin_bottom,
    collab_margin_top,
    collab_margin_left,
    collab_margin_right,
} from '/_100555_/l2/utils/collabIcons.js'

/// **collab_i18n_start**
const message_pt = {
    all: 'Group',
    margin: 'Margin',
    top: 'Superior',
    left: 'Esquerda',
    bottom: 'Inferior',
    right: 'Direita',
    description: 'Este plugin permite ajustar margens de maneira simples e intuitiva. Ideal para desenvolvedores que buscam precisão no espaçamento dos elementos, ele facilita a definição de distâncias internas e externas para garantir um layout consistente e bem estruturado.'

}

const message_en = {
    all: 'Group',
    margin: 'Margin',
    top: 'Top',
    left: 'Left',
    bottom: 'Bottom',
    right: 'Right',
    description: 'This plugin enables easy and intuitive adjustments of margins.Ideal for developers seeking precise element spacing, it streamlines the setup of inner and outer distances to ensure a consistent and well-structured layout.'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const tags = ['margin*'];
export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}


@customElement('plugin-style--plugin-style-margin-100555')
export class PluginStyleSpacing extends StateLitElement {

    private msg: MessageType = messages['en'];

    @propertyDataSource() state: ICSSState | undefined;
    @property() position: 'left' | 'right' = 'left';

    @property() showFull: string = 'true';
    @property() marginLocked: boolean = false;

    @property() marginLeft: string | undefined;
    @property() marginRight: string | undefined;
    @property() marginTop: string | undefined;
    @property() marginBottom: string | undefined;


    @query('#helper-margin-lock') inputLockM: HTMLInputElement | undefined;
    @queryAll('utils--collab-ds-input-range-100555[group="margin"]') marginInputs: HTMLInputElement[] | undefined;

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    handleIcaStateChange(_key: string, _value: ICSSState) {
        if (_key !== `less.${this.position}` || !_value) return;
        if (_value.emitter === 'helper') return;
        if (!_value.selector || !_value.lessCSS || !_value.lessCSS.lessAST || !_value.lessCSS.lessAST.ast[_value.selector]) return;
        const actualAst = _value.lessCSS.lessAST.ast[_value.selector];
        if (!actualAst) return;
        let hasRuleMarginInAST: boolean = false;
        Object.keys(actualAst).forEach((prop) => {
            if (prop.startsWith('margin')) hasRuleMarginInAST = true;
        });
        this.clear();

        if (hasRuleMarginInAST) {
            this._onIcaStateChange();
        }
    }

    private clear() {
        this.marginLeft = undefined;
        this.marginRight = undefined;
        this.marginTop = undefined;
        this.marginBottom = undefined;
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`

        ${this.showFull === 'true' ?
                html`
                ${this.renderGallery()}
                ${this.renderMargin()}
            ` :
                html`
                ${this.renderGallery()}
            `
            }
        `;
    }

    renderMargin() {
        return html`
            <h5 class="helper-group-title" >${this.msg.margin}</h5>
            <div class="helper-group-lock">
                <input id="helper-margin-lock" ?checked=${this.marginLocked} type="checkbox" @change=${this.handleChangeLockMargin}>
                <label for="helper-margin-lock"> ${this.msg.all}</label>
                <i>${this.marginLocked ? collab_lock : collab_lock_open}</i>
            </div>

            <div class="group">

                <div class="group-edit">
                    <i data-tooltip="${this.msg.top}">${collab_margin_top}</i>
                    <utils--collab-ds-input-range-100555
                        prop="margin-top"
                        value=${this.marginTop}
                        .arraySelect=${this.tpMeasures} 
                        group="margin"
                        @onchange="${(e: KeyboardEvent) => this.handleChangeMargin(e)}"
                    ></utils--collab-ds-input-range-100555>
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.left}" >${collab_margin_left}</i>
                    <utils--collab-ds-input-range-100555
                        prop="margin-left"
                        value="${this.marginLeft}"
                        .arraySelect=${this.tpMeasures} 
                        group="margin" 
                        @onchange="${(e: KeyboardEvent) => this.handleChangeMargin(e)}"
                    ></utils--collab-ds-input-range-100555>   
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.bottom}">${collab_margin_bottom}</i>
                    <utils--collab-ds-input-range-100555
                        prop="margin-bottom"
                        value=${this.marginBottom}
                        .arraySelect=${this.tpMeasures} 
                        group="margin" 
                        @onchange="${(e: KeyboardEvent) => this.handleChangeMargin(e)}"
                    ></utils--collab-ds-input-range-100555>
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.right}">${collab_margin_right}</i>
                    <utils--collab-ds-input-range-100555
                        prop="margin-right"
                        value=${this.marginRight}
                        .arraySelect=${this.tpMeasures} 
                        group="margin" 
                        @onchange="${(e: KeyboardEvent) => this.handleChangeMargin(e)}"
                    ></utils--collab-ds-input-range-100555>

                </div>
            </div>

        `
    }

    renderGallery() {
        return html`
            <div class="gallery">
                ${repeat(this.gallery, ((key: string) => key) as any,
            ((galleryItem: IGallery, index: number) => {
                return html`
                <div class="box" @click=${() => { this.onGalleryClick(galleryItem) }}>
                    <div style="${galleryItem.style}"></div>
                </div>`;
            }) as any
        )}
            </div>
        
        `
    }

    private _onIcaStateChange() {
        if (!this.state || !this.state.lessCSS) return;
        const rule = this.findCSSRuleInIframe(this.state.lessCSS.selector);
        if (!rule) return;
        this.setValues(rule);
    }

    private timeonChangeMargin = -1;

    private handleChangeMargin(e: KeyboardEvent) {

        clearTimeout(this.timeonChangeMargin);
        const el = (e.detail as any).target as HTMLInputElement;
        const prop = el.getAttribute('prop');
        if (!prop) return;
        const convertedProp = this.state?.lessCSS?.lessAST.toCamelCaseProperty(prop);
        if (this.timeonChangeMargin) window.clearTimeout(this.timeonChangeMargin);
        this.timeonChangeMargin = window.setTimeout(() => {
            if (!this.marginLocked) {
                if (!convertedProp) return;
                (this as any)[convertedProp] = el.value;
                this.setState();
                return;
            }
            this.marginInputs?.forEach((inp) => {
                if (inp === el) return;
                inp.value = el.value;
            });
            this.marginBottom = this.marginLeft = this.marginRight = this.marginTop = el.value;
            this.setState();

        }, 100);
    }

    private handleChangeLockMargin() {
        if (!this.inputLockM) return;
        this.marginLocked = this.inputLockM.checked;
    }

    private setState() {

        const allMargin = [this.marginTop, this.marginLeft, this.marginBottom, this.marginRight];
        const areMarginsAllEqual = allMargin.every(value => value === allMargin[0]);
        const areMarginPairsEqual = (this.marginTop === this.marginBottom) && (this.marginLeft === this.marginRight);

        let marginValue: any;

        if (areMarginsAllEqual) marginValue = this.marginTop;
        else if (areMarginPairsEqual) marginValue = `${this.marginTop} ${this.marginRight}`;
        else {
            marginValue = {
                marginTop: this.marginTop,
                marginRight: this.marginRight,
                marginBottom: this.marginBottom,
                marginLeft: this.marginLeft,
            };
        }

        this.updateMargins(marginValue);

    }

    updateMargins(margin: string | { [key: string]: string }) {

        setState(`less.${this.position}.emitter`, 'helper');
        const styles: CSSStyleDeclaration = getState(`less.${this.position}.lessCSS.styles`);
        if (typeof margin === 'string') {
            styles.marginTop = styles.marginRight = styles.marginBottom = styles.marginLeft = '';
            styles.margin = margin;
        } else {
            styles.margin = '';
            this.marginTop = styles.marginTop = margin.marginTop || '';
            this.marginRight = styles.marginRight = margin.marginRight || '';
            this.marginBottom = styles.marginBottom = margin.marginBottom || '';
            this.marginLeft = styles.marginLeft = margin.marginLeft || '';
        }

    }

    private setValues(rule: CSSStyleRule): void {

        if (rule.style) {
            for (let i = 0; i < rule.style.length; i++) {
                const propertyName = rule.style[i];
                if (propertyName.startsWith('margin-')) {
                    const propertyValue = rule.style.getPropertyValue(propertyName);
                    const el = this.querySelector(`utils--collab-ds-input-range-100555[prop="${propertyName}"]`) as HTMLInputElement;
                    const convertedProp = this.state?.lessCSS?.lessAST.toCamelCaseProperty(propertyName);
                    if (!convertedProp) return;
                    (this as any)[convertedProp] = propertyValue;
                    if (el) el.defaultValue = propertyValue;
                }
            }

            this.checkMarginsEquals();

        }

    }

    private checkMarginsEquals() {
        if ([this.marginBottom, this.marginLeft, this.marginRight, this.marginTop].every(margin => margin === this.marginBottom)) {
            this.marginLocked = true;
            if (this.inputLockM) this.inputLockM.checked = true;
        } else {
            this.marginLocked = false;
            if (this.inputLockM) this.inputLockM.checked = false;
        }
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

    private onGalleryClick(item: IGallery) {

        this.marginBottom = item.state.marginBottom;
        this.marginTop = item.state.marginTop;
        this.marginLeft = item.state.marginLeft;
        this.marginRight = item.state.marginRight;
        this.checkMarginsEquals();
        this.setState();
    }

    private gallery: IGallery[] = [
        { style: 'margin: 10px', state: { marginBottom: '10px', marginTop: '10px', marginLeft: '10px', marginRight: '10px' } },
        { style: 'margin: 10px 0', state: { marginBottom: '10px', marginTop: '10px', marginLeft: '0', marginRight: '0' } },
        { style: 'margin: 0 10px', state: { marginBottom: '0', marginTop: '0', marginLeft: '10px', marginRight: '10px' } },
        { style: 'margin-left: 10px', state: { marginBottom: '', marginTop: '', marginLeft: '10px', marginRight: '' } },
        { style: 'margin-right: 10px', state: { marginBottom: '', marginTop: '', marginLeft: '', marginRight: '10px' } },
        { style: 'margin-top: 10px', state: { marginBottom: '', marginTop: '10px', marginLeft: '', marginRight: '' } },
        { style: 'margin-bottom: 10px', state: { marginBottom: '10px', marginTop: '', marginLeft: '', marginRight: '' } },

    ];

}

interface IGallery {
    style: string,
    state: {
        marginBottom: string,
        marginTop: string,
        marginLeft: string,
        marginRight: string,
    }
}