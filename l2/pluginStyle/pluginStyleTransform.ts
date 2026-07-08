/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleTransform.ts" enhancement="_102027_/l2/enhancementLit" />


import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import {  getState, setState } from '/_102029_/l2/collabState.js';
import { getMessageKey } from '/_102029_/l2/collabLitElement.js';
import { ICSSState } from '/_100555_/l2/utils/lessCSS.js';
import '/_100555_/l2/utils/collabDsInputSelectColor.js';
import '/_100555_/l2/utils/collabDsInputRange.js';
import '/_100555_/l2/utils/collabDsInputSelectColor.js';
import '/_100555_/l2/utils/collabDsInputRange.js';

/// **collab_i18n_start**
const message_pt = {
    advanced: 'Avançado',
    scaleX: 'Escala x',
    scaleY: 'Escala y',
    skewX: 'Inclinar x',
    skewY: 'Inclinar y',
    translateX: 'Transladar x',
    translateY: 'Transladar y',
    rotate: 'Rotacionar',
    description: 'Um plugin versátil para manter e aplicar propriedades de transformação CSS. Gerencie facilmente transformações de escala, rotação, inclinação e tradução para criar elementos de UI dinâmicos e interativos com precisão'
}

const message_en = {
    advanced: 'Advanced',
    scaleX: 'Scale x',
    scaleY: 'Scale y',
    skewX: 'Skew x',
    skewY: 'Skew Y',
    translateX: 'Translate x',
    translateY: 'Translate y',
    rotate: 'Rotate',
    description: 'A versatile plugin for maintaining and applying CSS transform properties. Easily manage scale, rotate, skew, and translate transformations to create dynamic and interactive UI elements with precision.'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const tags = ['transform'];

export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}

@customElement('plugin-style--plugin-style-transform-100555')
export class PluginStyleTransform extends StateLitElement {

    @property() showFull: string = 'true';
    @propertyDataSource() state: ICSSState | undefined;
    @property() position: 'left' | 'right' = 'left';
    @property() transform: string | undefined;

    @property() scaleX: string | undefined;
    @property() scaleY: string | undefined;
    @property() rotate: string | undefined;
    @property() translateX: string | undefined;
    @property() translateY: string | undefined;
    @property() skewX: string | undefined;
    @property() skewY: string | undefined;

    @queryAll('utils--collab-ds-input-range-100555') columnRuleInputs: HTMLInputElement[] | undefined;

    private msg: MessageType = messages['en'];

    handleIcaStateChange(_key: string, _value: ICSSState) {
        if (_key !== `less.${this.position}` || !_value) return;
        if (_value.emitter === 'helper') return;
        if (!_value.selector || !_value.lessCSS || !_value.lessCSS.lessAST || !_value.lessCSS.lessAST.ast[_value.selector]) return;
        const actualAst = _value.lessCSS.lessAST.ast[_value.selector];
        if (!actualAst) return;
        let hasRuleTransformInAST: boolean = false;
        Object.keys(actualAst).forEach((prop) => {
            if (prop === 'transform') hasRuleTransformInAST = true;
        });
        this.clear();

        if (hasRuleTransformInAST) {
            this._onIcaStateChange();
        }
    }

    private clear() {
        this.transform = undefined;
        this.scaleX = undefined;
        this.scaleY = undefined;
        this.rotate = undefined;
        this.translateX = undefined;
        this.translateY = undefined;
        this.skewX = undefined;
        this.skewY = undefined;
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

        const auxFilter: any = {
            scaleX: '',
            scaleY: '',
            rotate: '',
            translateX: '',
            translateY: '',
            skewX: '',
            skewY: '',
        }

        const filter = this.transform?.split(')') || [];
        filter.forEach((item) => {

            if (!item) return;
            const prop = item.substring(0, item.indexOf('(')).trim();
            item = item.substring(item.indexOf('('), item.length);
            if (prop.indexOf('scale') >= 0 || prop.indexOf('translate') >= 0 || prop.indexOf('skew') >= 0) {

                item.split(',').forEach((vl, index) => {

                    if (!vl) return;
                    const num = vl.match(/[\.-\d]/g)?.join('');
                    const prefx = index === 0 ? 'X' : 'Y';
                    const hasprefix = prop.endsWith('X') || prop.endsWith('Y')
                    const key = hasprefix ? prop : prop + prefx;
                    if (auxFilter[key] !== undefined) auxFilter[key] = num;

                });

            } else {
                const num = item.match(/[\.-\d]/g)?.join('');
                if (auxFilter[prop] !== undefined) auxFilter[prop] = num;
            }

        });

        this.scaleX = auxFilter.scaleX;
        this.scaleY = auxFilter.scaleY;
        this.rotate = auxFilter.rotate;
        this.translateX = auxFilter.translateX;
        this.translateY = auxFilter.translateY;
        this.skewX = auxFilter.skewX;
        this.skewY = auxFilter.skewY;
    }


    private setValues(rule: CSSStyleRule) {

        if (rule.style) {
            for (let i = 0; i < rule.style.length; i++) {
                const propertyName = rule.style[i];
                if (propertyName === 'transform') {
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
        if (this.scaleX || this.scaleY) value += 'scale(' + (this.scaleX ? this.scaleX : '1') + (this.scaleY ? ', ' + this.scaleY : '') + ') ';
        if (this.rotate) value += this.rotate ? 'rotate(' + this.rotate + 'deg) ' : '';
        if (this.translateX || this.translateY) value += 'translate(' + (this.translateX ? this.translateX + 'px' : '0px') + (this.translateY ? ', ' + this.translateY : ', 0') + 'px) ';
        if (this.skewX || this.skewY) value += 'skew(' + (this.skewX ? this.skewX + 'deg' : '0deg') + (this.skewY ? ', ' + this.skewY : ', 0') + 'deg) ';
        this.transform = value.trim();
        this.setState();
    }

    private setState() {
        setState(`less.${this.position}.emitter`, 'helper');
        const styles: CSSStyleDeclaration = getState(`less.${this.position}.lessCSS.styles`);
        styles.transform = this.transform || '';
    }

    private timeonChangeProp = -1;

    private handleChange(e: KeyboardEvent) {
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
                    ${this.renderTransform()}

                ` :
                html`
                    ${this.renderGallery()}
                `
            }
        `;

    }

    renderTransform() {
        return html`
            <div class="group">
                <span>${this.msg.scaleX}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555 @onchange=${this.handleChange} prop="scaleX" value=${this.scaleX} useSelect="false"></utils--collab-ds-input-range-100555>
                </div>
                <span>${this.msg.scaleY}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555 @onchange=${this.handleChange} prop="scaleY" value=${this.scaleY} useSelect="false"></utils--collab-ds-input-range-100555>
                </div>
                <span>${this.msg.skewX}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555 @onchange=${this.handleChange} prop="skewX" value=${this.skewX} useSelect="false"></utils--collab-ds-input-range-100555>
                </div>
                <span>${this.msg.skewY}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555 @onchange=${this.handleChange} prop="skewY" value=${this.skewY} useSelect="false"></utils--collab-ds-input-range-100555>
                </div>
                <span>${this.msg.translateX}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555 @onchange=${this.handleChange} prop="translateX" value=${this.translateX} useSelect="false"></utils--collab-ds-input-range-100555>
                </div>
                <span>${this.msg.translateY}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555 @onchange=${this.handleChange} prop="translateY" value=${this.translateY} useSelect="false"></utils--collab-ds-input-range-100555>
                </div>
                <span>${this.msg.rotate}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555 @onchange=${this.handleChange} prop="rotate" value=${this.rotate} useSelect="false"></utils--collab-ds-input-range-100555>
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
        this.transform = item.state.transform;
        this.setValues2();
        await this.updateComplete;
        this.setState();
    }

    private gallery: IGallery[] = [
        {
            state: { transform: 'scale(1.5)' },
            style: 'transform: scale(1.5);'
        },
        {
            state: { transform: 'rotate(90deg)' },
            style: 'transform: rotate(90deg);'
        },
        {
            state: { transform: 'rotate(181deg)' },
            style: 'transform: rotate(181deg);'
        },
        {
            state: { transform: 'rotate(270deg)' },
            style: 'transform: rotate(270deg);'
        },
        {
            state: { transform: 'skew(50deg)' },
            style: 'transform: skew(50deg);'
        },
        {
            state: { transform: 'skew(50deg, -50deg)' },
            style: 'transform: skew(50deg, -50deg);'
        },
        {
            state: { transform: 'skew(-50deg, 0deg)' },
            style: 'transform: skew(-50deg, 0deg);'
        },
        {
            state: { transform: 'skew(-50deg, 50deg)' },
            style: 'transform: skew(-50deg, 50deg);'
        },
        {
            state: { transform: 'translateX(20px)' },
            style: 'transform: translateX(20px);'
        },
        {
            state: { transform: 'scale(0.75)' },
            style: 'transform: scale(0.75);'
        },
        {
            state: { transform: 'scaleX(1.2)' },
            style: 'transform: scaleX(1.2);'
        },
        {
            state: { transform: 'scaleX(1.8)' },
            style: 'transform: scaleX(1.8);'
        },
        {
            state: { transform: 'rotate(45deg)' },
            style: 'transform: rotate(45deg);'
        },
        {
            state: { transform: 'rotate(-45deg)' },
            style: 'transform: rotate(-45deg);'
        },
        {
            state: { transform: 'skewX(30deg)' },
            style: 'transform: skewX(30deg);'
        },
        {
            state: { transform: 'skewY(-15deg)' },
            style: 'transform: skewY(-15deg);'
        },

    ];

}

interface IGallery {
    style: string,
    state: {
        transform: string,
    }
}