/// <mls fileReference="_100555_/l2/pluginStyle/pluginStylePadding.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property, query, queryAll } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { getState, setState } from '/_102029_/l2/collabState.js';
import { getMessageKey } from '/_102029_/l2/collabLitElement.js';
import { ICSSState } from '/_100555_/l2/utils/lessCSS.js';
import '/_100555_/l2/utils/collabDsInputSelectColor.js';
import '/_100555_/l2/utils/collabDsInputRange.js';
import {
    collab_lock,
    collab_lock_open,
    collab_padding_bottom,
    collab_padding_top,
    collab_padding_left,
    collab_padding_right,


} from '/_100555_/l2/utils/collabIcons.js'

/// **collab_i18n_start**
const message_pt = {
    all: 'Group',
    padding: 'Padding',
    top: 'Superior',
    left: 'Esquerda',
    bottom: 'Inferior',
    right: 'Direita',
    description: 'Este plugin permite ajustar preenchimentos de maneira simples e intuitiva. Ideal para desenvolvedores que buscam precisão no espaçamento dos elementos, ele facilita a definição de distâncias internas e externas para garantir um layout consistente e bem estruturado.'

}

const message_en = {
    all: 'Group',
    padding: 'Padding',
    top: 'Top',
    left: 'Left',
    bottom: 'Bottom',
    right: 'Right',
    description: 'This plugin enables easy and intuitive adjustments paddings. Ideal for developers seeking precise element spacing, it streamlines the setup of inner and outer distances to ensure a consistent and well-structured layout.'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const tags = ['padding*'];
export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}


@customElement('plugin-style--plugin-style-padding-100555')
export class PluginStylePadding extends StateLitElement {

    private msg: MessageType = messages['en'];

    @propertyDataSource() state: ICSSState | undefined;
    @property() position: 'left' | 'right' = 'left';

    @property() showFull: string = 'true';
    @property() paddingLocked: boolean = false;
    @property() paddingLeft: string | undefined;
    @property() paddingRight: string | undefined;
    @property() paddingTop: string | undefined;
    @property() paddingBottom: string | undefined;


    @query('#helper-padding-lock') inputLockP: HTMLInputElement | undefined;
    @queryAll('utils--collab-ds-input-range-100555[group="padding"]') paddingInputs: HTMLInputElement[] | undefined;

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    handleIcaStateChange(_key: string, _value: ICSSState) {

        if (_key !== `less.${this.position}` || !_value) return;
        if (_value.emitter === 'helper') return;
        if (!_value.selector || !_value.lessCSS || !_value.lessCSS.lessAST || !_value.lessCSS.lessAST.ast[_value.selector]) return;
        const actualAst = _value.lessCSS.lessAST.ast[_value.selector];
        if (!actualAst) return;
        let hasRulePaddingInAST: boolean = false;
        Object.keys(actualAst).forEach((prop) => {
            if (prop.startsWith('padding')) hasRulePaddingInAST = true;
        });
        this.clear();

        if (hasRulePaddingInAST) {
            this._onIcaStateChange();
        }

    }

    private clear() {
        this.paddingLeft = undefined;
        this.paddingRight = undefined;
        this.paddingTop = undefined;
        this.paddingBottom = undefined;
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`

        ${this.showFull === 'true' ?
                html`
                ${this.renderGallery()}
                ${this.renderPadding()}
            ` :
                html`
                ${this.renderGallery()}
            `
            }
        `;
    }

    renderPadding() {
        return html`
            <h5 class="helper-group-title" >${this.msg.padding}</h5>
                <div class="helper-group-lock">
                <input id="helper-padding-lock" ?checked=${this.paddingLocked} type="checkbox" @change=${this.handleChangeLockPadding}>
                <label for="helper-padding-lock"> ${this.msg.all}</label>
                <i>${this.paddingLocked ? collab_lock : collab_lock_open}</i>
            </div>

            <div class="group">

                <div class="group-edit">
                    <i data-tooltip="${this.msg.top}">${collab_padding_top}</i>
                    <utils--collab-ds-input-range-100555
                        prop="padding-top"
                        value=${this.paddingTop}
                        .arraySelect=${this.tpMeasures}  
                        group="padding"
                        @onchange="${(e: KeyboardEvent) => this.handleChangePadding(e)}"
                    ></utils--collab-ds-input-range-100555>
                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.left}">${collab_padding_left}</i>
                    <utils--collab-ds-input-range-100555
                        prop="padding-left"
                        value=${this.paddingLeft}
                        .arraySelect=${this.tpMeasures} 
                        group="padding"
                        @onchange="${(e: KeyboardEvent) => this.handleChangePadding(e)}"
                    ></utils--collab-ds-input-range-100555>    

                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.bottom}">${collab_padding_bottom}</i>
                    <utils--collab-ds-input-range-100555
                        prop="padding-bottom"
                        value=${this.paddingBottom}
                        .arraySelect=${this.tpMeasures} 
                        group="padding"
                        @onchange="${(e: KeyboardEvent) => this.handleChangePadding(e)}"
                    ></utils--collab-ds-input-range-100555> 

                </div>

                <div class="group-edit">
                    <i data-tooltip="${this.msg.right}">${collab_padding_right}</i>
                    <utils--collab-ds-input-range-100555
                        prop="padding-right"
                        value=${this.paddingRight}
                        .arraySelect=${this.tpMeasures} 
                        group="padding"
                        @onchange="${(e: KeyboardEvent) => this.handleChangePadding(e)}"
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
                    <div style="${galleryItem.style}">
                        <span></span>
                    </div>
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

    private timeonChangePadding = -1;
    private handleChangePadding(e: KeyboardEvent) {

        clearTimeout(this.timeonChangePadding);
        const el = (e.detail as any).target as HTMLInputElement;
        const prop = el.getAttribute('prop');
        if (!prop) return;
        const convertedProp = this.state?.lessCSS?.lessAST.toCamelCaseProperty(prop);
        if (this.timeonChangePadding) window.clearTimeout(this.timeonChangePadding);
        this.timeonChangePadding = window.setTimeout(() => {
            if (!this.paddingLocked) {
                if (!convertedProp) return;
                (this as any)[convertedProp] = el.value;
                this.setState();
                return;
            }
            this.paddingInputs?.forEach((inp) => {
                if (inp === el) return;
                inp.value = el.value;
            });
            this.paddingBottom = this.paddingLeft = this.paddingRight = this.paddingTop = el.value;
            this.setState();

        }, 100);
    }

    private handleChangeLockPadding() {
        if (!this.inputLockP) return;
        this.paddingLocked = this.inputLockP.checked;
    }

    private setState() {
        const allPadding = [this.paddingTop, this.paddingLeft, this.paddingBottom, this.paddingRight];
        const arePaddingsAllEqual = allPadding.every(value => value === allPadding[0]);
        const arePaddingPairsEqual = (this.paddingTop === this.paddingBottom) && (this.paddingLeft === this.paddingRight);

        let paddingValue: any;
        if (arePaddingsAllEqual) paddingValue = this.paddingTop;
        else if (arePaddingPairsEqual) paddingValue = `${this.paddingTop} ${this.paddingRight}`;
        else {
            paddingValue = {
                paddingTop: this.paddingTop,
                paddingRight: this.paddingRight,
                paddingBottom: this.paddingBottom,
                paddingLeft: this.paddingLeft,
            };
        }
        this.updatePadding(paddingValue);

    }

    updatePadding(padding: string | { [key: string]: string }) {

        setState(`less.${this.position}.emitter`, 'helper');
        const styles: CSSStyleDeclaration = getState(`less.${this.position}.lessCSS.styles`);
        if (typeof padding === 'string') {
            styles.paddingTop = styles.paddingRight = styles.paddingBottom = styles.paddingLeft = '';
            styles.padding = padding;
        } else {
            styles.padding = '';
            this.paddingTop = styles.paddingTop = padding.paddingTop || '';
            this.paddingRight = styles.paddingRight = padding.paddingRight || '';
            this.paddingBottom = styles.paddingBottom = padding.paddingBottom || '';
            this.paddingLeft = styles.paddingLeft = padding.paddingLeft || '';
        }

    }


    private setValues(rule: CSSStyleRule): void {

        if (rule.style) {
            for (let i = 0; i < rule.style.length; i++) {
                const propertyName = rule.style[i];
                if (propertyName.startsWith('padding-')) {
                    const propertyValue = rule.style.getPropertyValue(propertyName);
                    const el = this.querySelector(`utils--collab-ds-input-range-100555[prop="${propertyName}"]`) as HTMLInputElement;
                    const convertedProp = this.state?.lessCSS?.lessAST.toCamelCaseProperty(propertyName);
                    if (!convertedProp) return;
                    (this as any)[convertedProp] = propertyValue;
                    if (el) el.defaultValue = propertyValue;
                }
            }

            this.checkPaddingEquals();
        }

    }


    private checkPaddingEquals() {

        if ([this.paddingBottom, this.paddingLeft, this.paddingRight, this.paddingTop].every(padding => padding === this.paddingBottom)) {
            this.paddingLocked = true;
            if (this.inputLockP) this.inputLockP.checked = true;
        } else {
            this.paddingLocked = false;
            if (this.inputLockP) this.inputLockP.checked = false;
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
        this.paddingBottom = item.state.paddingBottom;
        this.paddingTop = item.state.paddingTop;
        this.paddingLeft = item.state.paddingLeft;
        this.paddingRight = item.state.paddingRight;
        this.checkPaddingEquals();
        this.setState();
    }

    private gallery: IGallery[] = [
        { style: 'padding: 10px', state: { paddingBottom: '10px', paddingTop: '10px', paddingLeft: '10px', paddingRight: '10px' } },
        { style: 'padding: 10px 0', state: { paddingBottom: '10px', paddingTop: '10px', paddingLeft: '0', paddingRight: '0' } },
        { style: 'padding: 0 10px', state: { paddingBottom: '0', paddingTop: '0', paddingLeft: '10px', paddingRight: '10px' } },
        { style: 'padding-left: 10px', state: { paddingBottom: '', paddingTop: '', paddingLeft: '10px', paddingRight: '' } },
        { style: 'padding-right: 10px', state: { paddingBottom: '', paddingTop: '', paddingLeft: '', paddingRight: '10px' } },
        { style: 'padding-top: 10px', state: { paddingBottom: '', paddingTop: '10px', paddingLeft: '', paddingRight: '' } },
        { style: 'padding-bottom: 10px', state: { paddingBottom: '10px', paddingTop: '', paddingLeft: '', paddingRight: '' } },

    ];

}

interface IGallery {
    style: string,
    state: {
        paddingBottom: string,
        paddingTop: string,
        paddingLeft: string,
        paddingRight: string,
    }
}