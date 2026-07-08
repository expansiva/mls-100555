/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleFlex.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { setState, getState } from '/_102029_/l2/collabState.js';
import {  getMessageKey } from '/_102029_/l2/collabLitElement.js';
import { ICSSState } from '/_100555_/l2/utils/lessCSS.js';
import '/_100555_/l2/utils/collabDsInputRange.js';

/// **collab_i18n_start**
const message_pt = {
    flex: 'Flex',
    flexItem: 'Flex item',
    display: 'Display',
    flexDirection: 'Flex direction',
    flexWrap: 'Flex wrap',
    justifyContent: 'Justify content',
    alignItems: 'Align items',
    alignContent: 'Align content',
    alignSelf: 'Align self',
    order: 'Order',
    description: 'Plugin criado para gerenciar e personalizar propriedades de layout flexível em CSS, ajudando a ajustar comportamentos, alinhamentos e distribuições de forma eficiente.'
}

const message_en = {
    flex: 'Flex',
    flexItem: 'Flex item',
    display: 'Display',
    flexDirection: 'Flex direction',
    flexWrap: 'Flex wrap',
    justifyContent: 'Justify content',
    alignItems: 'Align items',
    alignContent: 'Align content',
    alignSelf: 'Align self',
    order: 'Order',
    description: 'Plugin designed to manage and customize flexible layout properties in CSS, enabling efficient adjustments to behavior, alignment, and distribution.'

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const tags = ['flex*', 'gap', 'align-items', 'justify-content', 'flex-direction', 'flex-wrap', 'align-content'];

export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}

@customElement('plugin-style--plugin-style-flex-100555')
export class PluginStyleFlex extends StateLitElement {

    private msg: MessageType = messages['en'];

    @propertyDataSource() state: ICSSState | undefined;
    @property() position: 'left' | 'right' = 'left';

    @property() showFull: string = 'true';

    handleIcaStateChange(_key: string, _value: ICSSState) {
        if (_key !== `less.${this.position}` || !_value) return;
        if (_value.emitter === 'helper') return;
        if (!_value.selector || !_value.lessCSS || !_value.lessCSS.lessAST || !_value.lessCSS.lessAST.ast[_value.selector]) return;
        const actualAst = _value.lessCSS.lessAST.ast[_value.selector];
        if (!actualAst) return;
        let hasRuleFlexInAST: boolean = false;
        Object.keys(actualAst).forEach((prop) => {
            if (prop.startsWith('flex') || tags.includes(prop)) hasRuleFlexInAST = true;
        });
        this.clear();
        if (hasRuleFlexInAST) {
            this._onIcaStateChange();
        }
    }

    private clear() {
        this.setValues();
    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
            ${this.renderGallery()}
            <div style=" ${this.showFull === 'true' ? 'display:block;' : 'display:none;'}">
                ${this.renderFlex()}
                ${this.renderFlexItem()}
            </div>    
        `;
    }

    renderFlex() {
        return html`
            <h5 class="helper-group-title" >${this.msg.flex}</h5>
            <div class="group">
            
                <span>${this.msg.display}</span>
                  <div class="group-edit">
                    <select prop="display" @change="${this.handleChangeCss}">
                        <option value=""></option>
                        <option value="flex">Flex</option>
                        <option value="inline-flex">Inline Flex</option>
                    </select>
                </div>

                <span>${this.msg.flexDirection}</span>
                <div class="group-edit">
                    <select class="group-select" prop="flex-direction" @change="${this.handleChangeCss}">
                        <option value=""></option>
                        <option value="row">Row</option>
                        <option value="row-reverse">Row Reverse</option>
                        <option value="column">Column</option>
                        <option value="column-reverse">Column Reverse</option>
                    </select>   
                </div>

                <span>${this.msg.flexWrap}</span>
                <div class="group-edit">
                    <select class="group-select" prop="flex-wrap" @change="${this.handleChangeCss}">
                        <option value=""></option>
                        <option value="nowrap">Nowrap</option>
                        <option value="wrap">Wrap</option>
                        <option value="wrap-reverse">Wrap Reverse</option>
                    </select>  
                </div>

                <span>${this.msg.justifyContent}</span>
                <div class="group-edit">
                    <select class="group-select" prop="justify-content" @change="${this.handleChangeCss}">
                        <option value=""></option>
                        <option value="flex-start">Flex start</option>
                        <option value="flex-end">Flex end</option>
                        <option value="center">Center</option>
                        <option value="space-between">Space between</option>
                        <option value="space-around">Space around</option>
                    </select>  
                </div>

                <span>${this.msg.alignItems}</span>
                <div class="group-edit">
                    <select class="group-select" prop="align-items" @change="${this.handleChangeCss}">
                        <option value=""></option>
                        <option value="flex-start">Flex start</option>
                        <option value="flex-end">Flex end</option>
                        <option value="center">Center</option>
                        <option value="baseline">Baseline</option>
                        <option value="stretch">Stretch</option>
                    </select>  
                </div>

                <span>${this.msg.alignContent}</span>
                <div class="group-edit">
                    <select class="group-select" prop="align-content" @change="${this.handleChangeCss}">
                        <option value=""></option>
                        <option value="flex-start">Flex start</option>
                        <option value="flex-end">Flex end</option>
                        <option value="center">Center</option>
                        <option value="space-between">Space between</option>
                        <option value="space-around">Space around</option>
                        <option value="stretch">Stretch</option>
                    </select>  
                </div>
            </div>
        `
    }


    renderFlexItem() {
        return html`
            <h5 class="helper-group-title" >${this.msg.flexItem}</h5>
            <div class="group">

                <span>${this.msg.alignSelf}</span>
                <div class="group-edit">
                    <select class="group-select" prop="align-self">
                        <option value=""></option>
                        <option value="auto">auto</option>
                        <option value="flex-start">Flex start</option>
                        <option value="flex-end">Flex end</option>
                        <option value="center">Center</option>
                        <option value="baseline">Baseline</option>
                        <option value="stretch">Stretch</option>
                    </select>
                </div>

                <span>${this.msg.order}</span>
                <div class="group-edit">
                    <select class="group-select" prop="order">
                        <option value=""></option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        
                    </select>   
                </div>
            </div>
        `
    }

    renderGallery() {
        return html`
        
            <div class="gallery" >
                ${repeat(this.arrayGallery.slice(0, 4), ((key: any) => key) as any,
            ((css: any, index: any) => {

                return html`<div class="itemgallery gallery-item-1" style="${css}" @click="${this.handleChangeGalleryCss}" .gallery=${css}>
                            <span style="background: #363636; padding: 0.5rem; margin: 0.25rem;" .gallery=${css}></span>
                            <span style="background: #363636; padding: 0.5rem; margin: 0.25rem;" .gallery=${css}></span>
                            <span style="background: #363636; padding: 0.5rem; margin: 0.25rem;" .gallery=${css}></span>
                        </div>`;
            }) as any
        )}
            </div>
            <div  class="gallery">
                ${repeat(this.arrayGallery.slice(4, 8), ((key: any) => key) as any,
            ((css: any, index: any) => {

                return html`<div class="itemgallery gallery-item-2" @click="${this.handleChangeGalleryCss}" style="${css}" .gallery=${css}>
                    <span style="background: #363636; padding: 0.5rem; margin: 0.25rem;" .gallery=${css}></span>
                    <span style="background: #363636; padding: 0.5rem; margin: 0.25rem;" .gallery=${css}></span>
                    <span style="background: #363636; padding: 0.5rem; margin: 0.25rem;" .gallery=${css}></span>
                </div>`;
            }) as any
        )}
            </div>
        
        `
    }


    private _onIcaStateChange() {
        if (!this.state || !this.state.lessCSS) return;
        this.setValues();
    }

    private setValues(): void {

        const json: any = this.state?.lessCSS?.lessAST.ast[this.state?.selector || ''];
        if (!json) return;

        const all = this.querySelectorAll('*[prop]');
        Array.from(all).forEach((i: any) => {
            const prop = i.getAttribute('prop');
            if (!json[prop]) {
                i.value = '';
                return;
            }
            const v = json[prop].value;
            i.value = v;
        });

    }

    private timeonChange = -1;
    private handleChangeCss(e: KeyboardEvent) {

        e.stopPropagation();
        let el = e.target as any;
        let prop = el.getAttribute('prop') || '';
        if (this.timeonChange) window.clearTimeout(this.timeonChange);
        this.timeonChange = window.setTimeout(() => {
            this.setState(prop, el.value);

        }, 100);
    }

    private handleChangeGalleryCss(e: KeyboardEvent) {

        e.stopPropagation();
        let el = e.target as HTMLElement;
        if (!el.classList.contains('itemgallery')) {
            el = el.closest('.itemgallery') as HTMLElement;
        }

        let css: string = (el as any).gallery;
        if (!el || !css) return;

        if (this.timeonChange) window.clearTimeout(this.timeonChange);
        this.timeonChange = window.setTimeout(() => {

            const allItens = css.split(';');
            allItens.forEach((i) => {

                const [prop, v] = i.split(':');
                if (!prop.trim() || !v.trim()) return;
                this.setState(prop.trim(), v.trim());
            })

        }, 100);
    }

    private setState(prop: string, css: string) {
        prop = this.state?.lessCSS?.lessAST.toCamelCaseProperty(prop) || '';
        setState(`less.${this.position}.emitter`, 'helper');
        const styles = getState(`less.${this.position}.lessCSS.styles`);
        styles[prop] = css;
    }

    private arrayGallery = [
        'display: flex;flex-direction: row; justify-content: flex-start;',
        'display: flex; flex-direction: row; justify-content: flex-end;',
        'display: flex; flex-direction: row; justify-content: center;',
        'display: flex; flex-direction: row; justify-content: space-between;',
        'display: flex;flex-direction: column; justify-content: flex-start;',
        'display: flex;flex-direction: column; justify-content: flex-end;',
        'display: flex;flex-direction: column; justify-content: center;',
        'display: flex;flex-direction: column; justify-content: space-between;'
    ];

}