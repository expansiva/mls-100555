/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleFilter.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { getState, setState } from '/_102029_/l2/collabState.js';
import { getMessageKey } from '/_102029_/l2/collabLitElement.js';
import { ICSSState } from '/_100555_/l2/utils/lessCSS.js';

import '/_100555_/l2/utils/collabDsInputSelectColor.js';
import '/_100555_/l2/utils/collabDsInputRange.js';
import '/_100555_/l2/utils/collabDsInputSelectColor.js';
import '/_100555_/l2/utils/collabDsInputRange.js';

/// **collab_i18n_start**
const message_pt = {
    grayscale: 'Escala de Cinza',
    filterBlur: 'Desfoque',
    sepia: 'Sépia',
    saturate: 'Saturação',
    opacity: 'Opacidade',
    brightness: 'Brilho',
    contrast: 'Contraste',
    hueRotate: 'Rotação de Matiz',
    invert: 'Inverter',
    advanced: 'Avançado',
    description: 'Um plugin versátil para gerenciar e aplicar propriedades de filtro CSS. Controle facilmente filtros como desfoque, brilho, contraste e outros para criar elementos de UI visualmente envolventes e dinâmicos com precisão.'
}

const message_en = {
    grayscale: 'Grayscale',
    filterBlur: 'Blur',
    sepia: 'Sepia',
    saturate: 'Saturate',
    opacity: 'Opacity',
    brightness: 'Brightness',
    contrast: 'Contrast',
    hueRotate: 'HueRotate',
    invert: 'Invert',
    advanced: 'Advanced',
    description: 'A versatile plugin for managing and applying CSS filter properties. Easily control filters like blur, brightness, contrast, and more to create visually engaging and dynamic UI elements with precision.'
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const tags = ['filter'];

export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}

@customElement('plugin-style--plugin-style-filter-100555')
export class PluginStyleFilter extends StateLitElement {

    @property() showFull: string = 'true';
    @propertyDataSource() state: ICSSState | undefined;
    @property() position: 'left' | 'right' = 'left';
    @property() filter: string | undefined;

    @property() grayscale: string | undefined;
    @property() filterBlur: string | undefined;
    @property() sepia: string | undefined;
    @property() saturate: string | undefined;
    @property() opacity: string | undefined;
    @property() brightness: string | undefined;
    @property() contrast: string | undefined;
    @property() huerotate: string | undefined;
    @property() invert: string | undefined;

    private msg: MessageType = messages['en'];

    handleIcaStateChange(_key: string, _value: ICSSState) {
        if (_key !== `less.${this.position}` || !_value) return;
        if (_value.emitter === 'helper') return;
        if (!_value.selector || !_value.lessCSS || !_value.lessCSS.lessAST || !_value.lessCSS.lessAST.ast[_value.selector]) return;
        const actualAst = _value.lessCSS.lessAST.ast[_value.selector];
        if (!actualAst) return;
        let hasRuleFilterInAST: boolean = false;
        Object.keys(actualAst).forEach((prop) => {
            if (prop === 'filter') hasRuleFilterInAST = true;
        });
        this.clear();

        if (hasRuleFilterInAST) {
            this._onIcaStateChange();
        }
    }

    private clear() {
        this.filter = undefined;
        this.grayscale = undefined;
        this.filterBlur = undefined;
        this.sepia = undefined;
        this.saturate = undefined;
        this.opacity = undefined;
        this.brightness = undefined;
        this.contrast = undefined;
        this.huerotate = undefined;
        this.invert = undefined;
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
                if (propertyName === 'filter') {
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

        const auxFilter: any = {
            grayscale: '',
            blur: '',
            sepia: '',
            saturate: '',
            opacity: '',
            brightness: '',
            contrast: '',
            huerotate: '',
            invert: '',
        }

        const filter = (this.filter || '').split(' ');

        filter.forEach((item) => {
            let prop = item.substring(0, item.indexOf('(')).replace('-', '');
            item = item.substring(item.indexOf('('), item.length);
            const value = item.match(/[\.-\d]/g)?.join('');
            auxFilter[prop] = value;
        });

        this.grayscale = auxFilter.grayscale;
        this.filterBlur = auxFilter.blur;
        this.sepia = auxFilter.sepia;
        this.saturate = auxFilter.saturate;
        this.opacity = auxFilter.opacity;
        this.brightness = auxFilter.brightness;
        this.contrast = auxFilter.contrast;
        this.huerotate = auxFilter.huerotate;
        this.invert = auxFilter.invert;
    }


    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            ${this.showFull === 'true' ?
                html`
                    ${this.renderGallery()}
                    ${this.renderFilter()}

                ` :
                html`
                    ${this.renderGallery()}
                `
            }
        `;

    }

    renderFilter() {
        return html`
            <div class="group">
                <span>${this.msg.grayscale}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555 @onchange=${this.handleChange} prop="grayscale" value=${this.grayscale} useSelect="false"></utils--collab-ds-input-range-100555>
                </div>
                <span>${this.msg.filterBlur}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555 @onchange=${this.handleChange} prop="filterBlur" value=${this.filterBlur} useSelect="false"></utils--collab-ds-input-range-100555>
                </div>
                <span>${this.msg.sepia}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555 @onchange=${this.handleChange} prop="sepia" value=${this.sepia} useSelect="false"></utils--collab-ds-input-range-100555>
                </div>
                <span>${this.msg.saturate}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555 @onchange=${this.handleChange} prop="saturate" value=${this.saturate} useSelect="false"></utils--collab-ds-input-range-100555>
                </div>
                <span>${this.msg.opacity}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555 @onchange=${this.handleChange} prop="opacity" value=${this.opacity} useSelect="false"></utils--collab-ds-input-range-100555>
                </div>
                <span>${this.msg.brightness}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555 @onchange=${this.handleChange} prop="brightness" value=${this.brightness} useSelect="false"></utils--collab-ds-input-range-100555>
                </div>
                <span>${this.msg.contrast}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555 @onchange=${this.handleChange} prop="contrast" value=${this.contrast} useSelect="false"></utils--collab-ds-input-range-100555>
                </div>
                <span>${this.msg.hueRotate}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555 @onchange=${this.handleChange} prop="huerotate" value=${this.huerotate} useSelect="false"></utils--collab-ds-input-range-100555>
                </div>
                <span>${this.msg.invert}</span>
                <div class="group-edit">
                    <utils--collab-ds-input-range-100555 @onchange=${this.handleChange} prop="invert" value=${this.invert} useSelect="false"></utils--collab-ds-input-range-100555>
                </div>
            </div>
        `;
    }

    renderGallery() {
        return html`
            <div class="gallery">
                ${repeat(this.gallery, ((key: any) => key) as any,
            ((galleryItem: IGallery, index: number) => {
                return html`<img height="70px" width="70px" src="./l3/_100529_/images/startl7.avif" style="${galleryItem.style}" @click=${() => { this.onGalleryClick(galleryItem) }}></img>`;
            }) as any
        )}
            </div>
        
        `
    }

    private mountValue(): void {

        let value = '';
        value += this.grayscale ? 'grayscale(' + this.grayscale + '%) ' : '';
        value += this.filterBlur ? 'blur(' + this.filterBlur + 'px) ' : '';
        value += this.sepia ? 'sepia(' + this.sepia + ') ' : '';
        value += this.saturate ? 'saturate(' + this.saturate + ') ' : '';
        value += this.opacity ? 'opacity(' + this.opacity + ') ' : '';
        value += this.brightness ? 'brightness(' + this.brightness + '%) ' : '';
        value += this.contrast ? 'contrast(' + this.contrast + '%) ' : '';
        value += this.huerotate ? 'hue-rotate(' + this.huerotate + 'deg) ' : '';
        value += this.invert ? 'invert(' + this.invert + '%) ' : '';
        this.filter = value.trim();
        this.setState();

    }

    private setState() {
        setState(`less.${this.position}.emitter`, 'helper');
        const styles: CSSStyleDeclaration = getState(`less.${this.position}.lessCSS.styles`);
        styles.filter = this.filter || '';
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


    private async onGalleryClick(item: IGallery) {
        this.filter = item.state.filter;
        this.setValues2();
        await this.updateComplete;
        this.setState();
    }

    private gallery: IGallery[] = [
        {
            style: 'filter: brightness(40%) sepia(1) hue-rotate(-42deg) saturate(6);',
            state: {
                filter: 'brightness(40%) sepia(1) hue-rotate(-42deg) saturate(6)'
            }
        },
        {
            style: 'filter: brightness(20%) sepia(1) hue-rotate(180deg) saturate(5);',
            state: {
                filter: 'brightness(20%) sepia(1) hue-rotate(180deg) saturate(5)'
            }
        },
        {
            style: 'filter: brightness(20%) sepia(1) hue-rotate(310deg) saturate(5);',
            state: {
                filter: 'brightness(20%) sepia(1) hue-rotate(310deg) saturate(5)'
            }
        },
        {
            style: 'filter: brightness(70%) sepia(1) hue-rotate(360deg) saturate(6);',
            state: {
                filter: 'brightness(70%) sepia(1) hue-rotate(360deg) saturate(6)'
            }
        },
        {
            style: 'filter: brightness(40%) sepia(1) hue-rotate(-40deg);',
            state: {
                filter: 'brightness(40%) sepia(1) hue-rotate(-40deg);'
            }
        },
        {
            style: 'filter: blur(2px);',
            state: {
                filter: 'blur(2px)'
            }
        },
        {
            style: 'filter: invert(100%) sepia(2);',
            state: {
                filter: 'invert(100%) sepia(2)'
            }
        },
    ];

}

interface IGallery {
    style: string,
    state: {
        filter: string,
    }
}
