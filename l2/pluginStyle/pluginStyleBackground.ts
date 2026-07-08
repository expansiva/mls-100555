/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleBackground.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';
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
    gallery: 'Galeria',
    background: 'Background',
    angle: 'Anglo',
    color: 'Cor',
    transparency: 'Transparencia',
    stop: 'Parar',
    add: 'Add',
    del: 'Del',
    description: 'Um plugin robusto para gerenciar e personalizar propriedades de plano de fundo. Lide facilmente com cores de fundo, imagens, gradientes e padrões para criar designs de UI visualmente atraentes e dinâmicos.'
}

const message_en = {
    gallery: 'Gallery',
    background: 'Background',
    angle: 'Angle',
    color: 'Color',
    transparency: 'Transparency',
    stop: 'Stop',
    add: 'Add',
    del: 'Del',
    description: 'A robust plugin for managing and customizing background properties. Effortlessly handle background colors, images, gradients, and patterns to create visually appealing and dynamic UI designs.'

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const tags = ['background', 'background-image'];
export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}

@customElement('plugin-style--plugin-style-background-100555')
export class PluginCssTokens extends StateLitElement {

    private msg: MessageType = messages['en'];

    @property() showFull: string = 'true';
    @property() position: 'left' | 'right' = 'left';
    @property() info: IMyInfoBackground = { tp: 'background', aux: '', itens: [] };
    @property() css: string = '';
    @propertyDataSource() state: ICSSState | undefined;

    private actualKey: string = 'background';

    handleIcaStateChange(_key: string, _value: ICSSState) {
        if (_key !== `less.${this.position}` || !_value) return;
        if (_value.emitter === 'helper') return;
        if (!_value.selector || !_value.lessCSS || !_value.lessCSS.lessAST || !_value.lessCSS.lessAST.ast[_value.selector]) return;
        const actualAst = _value.lessCSS.lessAST.ast[_value.selector];
        if (!actualAst) return;
        let hasRuleBackgroundInAST: boolean = false;
        this.clear();

        Object.keys(actualAst).forEach((prop) => {
            if (tags.includes(prop)) {
                this.actualKey = prop;
                hasRuleBackgroundInAST = true;
            }
        });

        if (hasRuleBackgroundInAST) {
            this._onIcaStateChange();
        }
    }

    private clear() {
        this.css = '';
        this.info = { tp: 'background', aux: '', itens: [] };
    }

    // private _onIcaStateChange() {
    //     if (!this.state || !this.state.lessCSS || !this.state.value) return;
    //     this.configString(`${this.state.value}`);
    //     // this.configString(`${this.state.key} : ${this.state.value}`);

    // }

    private _onIcaStateChange() {
        if (!this.state || !this.state.lessCSS) return;
        const rule = this.findCSSRuleInIframe(this.state.lessCSS.selector);
        if (!rule) return;
        this.setValues(rule);
    }


    private setValues(rule: CSSStyleRule): void {
        if (rule.style && rule.style.background) {
            this.configString(rule.style.background);
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

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang]
        return html`<div class="container">${this.renderBody()}</div>`;
    }

    renderBody2() {
        return html`

            <div class=${classMap({ showtransparent: true, hidden: this.showFull !== 'true' })}></div>
            <div class=${classMap({ showres: true, hidden: this.showFull !== 'true' })} style="background:${this.css}"></div>
            <div class=${classMap({ showConfigContainer: this.showFull === 'true' })} >
                <div class="showConfig" >
                    <h4 style="text-align:center;margin-bottom:1rem">${this.msg.gallery}</h4>
                    ${this.renderGallery()}
                </div>

                <div class=${classMap({ showConfig: true, hidden: this.showFull !== 'true' })}>
                    ${this.renderConfig()}
                    ${this.renderItens()}
                </div>
            
            
            </div>

        `;
    }

    renderBody() {
        return this.renderBody2()


        // return html`

        // ${this.showFull === 'true' ?
        //         html`
        //         ${this.renderBody2()}
        //     ` :
        //         html`
        //         ${this.renderGallery()}
        //     `
        //     }
        // `;
    }

    renderConfig() {

        if (this.info.tp === 'background') {
            return html`
                <div class="showConfigItem">
                    <div class="active" style="border: 1px solid #d0cccc; font-size: 80%; padding: 0.2rem; border-radius: 5px; text-align:center; cursor:pointer">${this.msg.background}</div>
                </div>
            `
        } else if (this.info.tp !== '') {

            return html`
                <div class="showConfigItem" style="display: flex;flex-direction:row; margin-bottom:10px">
                    <div class="${this.info.tp === 'linear-gradient' ? 'active' : ''}" style="border: 1px solid #d0cccc; font-size: 80%; padding: 0.2rem; border-top-left-radius: 5px; border-bottom-left-radius: 5px; border-right:0px;  text-align:center; cursor:pointer" @click="${() => this.changeType('linear-gradient')}">Linear-gradient</div>
                    <div class="${this.info.tp === 'radial-gradient' ? 'active' : ''}" style="border: 1px solid #d0cccc; font-size: 80%; padding: 0.2rem; border-top-right-radius: 5px; border-bottom-right-radius: 5px;  text-align:center; cursor:pointer" @click="${() => this.changeType('radial-gradient')}">Radial-gradient</div>
                </div>
                ${this.renderAux()}
            `

        } else {
            return html``;
        }

    }

    renderAux() {

        if (this.info.tp !== 'linear-gradient') return html``;

        return html`
            <div class="showConfigItem" style="flex-direction:row;  margin-bottom:10px">
                <span style=text-align:center;font-size:80%; color:#6d6d6d;">${this.msg.angle}:</span>
                <input type="number" style="text-align:center;font-size:80%; color:#6d6d6d; " .value=${this.onlyNumber(this.info.aux)} prop="aux" @input="${(e: InputEvent) => this.onChangeAux('aux')}"/>
            </div>
        `

    }

    renderItens() {
        return html`
            <div class="showConfigItem">
                <div style="display:flex; gap:.5rem; font-size:80%; color:#6d6d6d;margin-bottom:.5rem">
                    <div style="text-align:center; ">${this.msg.color}/${this.msg.transparency}/${this.msg.stop}/</div> 
                    <div style="text-align:center; cursor:pointer" @click="${this.add}">${this.msg.add}</div>
                </div>  
                ${repeat(this.info.itens, ((key: any) => key.value) as any,
            ((i: any, index: any) => {
                return html`
                        <div style="display:flex; gap:.5rem;margin-bottom:.5rem" index="${index}" class="groupEdit">
                            <input type="color" .value="${i.value}"  prop="color" index="${index}" @change="${(e: InputEvent) => this.onChangeProp(index)}"/> 
                            <input type="range" min="0" max="100" .value="${i.transp}" prop="transp" index="${index}" @input="${(e: InputEvent) => this.onChangeProp(index)}"/> 
                            <input type="number"  min="0" max="100" .value="${i.stop}" prop="stop" index="${index}" @input="${(e: InputEvent) => this.onChangeProp(index)}"></input>
                            <div style="text-align:center;font-size:80%; color:#6d6d6d;cursor:pointer" @click="${(e: any) => this.del(index)}">${this.msg.del}</div>
                        </div>    
                    `;
            }) as any
        )}
            </div>
        `
    }

    renderGallery() {
        return html`
            <div style="display:flex; gap:.5rem; flex-wrap:wrap">
            ${repeat(this.arrayGallery, ((key: any) => key) as any,
            ((css: any, index: any) => {
                return html`<div style="width:40px; border-radius:5px; height:30px; cursor:pointer;${css}" @click="${this.clickGallery}" .gallery=${css}></div>`;
            }) as any
        )}
            </div>
        `;
    }

    //-------------IMPLEMENTS--------------

    private clickGallery(e: MouseEvent): void {

        const el = e.target as any;
        if (!el) return;
        const css = el['gallery'];
        this.actualKey = 'background';
        this.configString(css);
        this.mountMyValue();
    }

    private onlyNumber(str: string): string {
        const regexNum = /(\d+(?:\.\d+)?)/;
        const res = str.match(regexNum);
        return res && (res as any)[0] ? (res as any)[0] as string : '';
    }

    private changeType(tp: string): void {

        if (this.info.tp === tp) return;

        if (tp === 'linear-gradient') {
            this.info.tp = 'linear-gradient';
            this.info.aux = '90deg';
        } else if (tp === 'radial-gradient') {
            this.info.tp = 'radial-gradient';
            this.info.aux = 'circle';
        }

        this.mountMyValue();

    }

    private add(): void {

        this.info.itens.push({ value: '#000000', transp: '100', stop: '100' })
        if (this.info.itens.length >= 2 && this.info.tp === 'background') {
            this.info.tp = 'linear-gradient';
            this.info.aux = '84deg';
        }

        this.mountMyValue();
    }

    private del(index: number): void {

        this.info.itens.splice(index, 1);
        if (this.info.itens.length <= 1 && this.info.tp !== 'background') {
            this.info.tp = 'background';
            this.info.aux = '';
        }
        this.mountMyValue();
    }

    private configString(str: string): void {

        this.css = str;

        this.info = { tp: '', aux: '', itens: [] };

        if (str.indexOf('linear-gradient') >= 0) {
            this.info.tp = 'linear-gradient';
        } else if (str.indexOf('radial-gradient') >= 0) {
            this.info.tp = 'radial-gradient';
        } else {
            this.info.tp = 'background';
        }

        if (this.info.tp === 'background') {

            let cl = str.split(':')[1] || str;
            if (cl.indexOf('rgb') >= 0) cl = this.rgbaToHex(cl).vl;
            this.info.itens = [{ value: cl, transp: '100', stop: '' }]
        } else {

            let ar: string[] = [];

            str = str.substring(str.indexOf('('));
            str = this.changeStr(str);

            ar = str.split(',');
            const auxCount = 100 / (ar.length - 1);
            ar.forEach((i, idx) => {

                if (idx === 0) {
                    this.info.aux = i;
                    return;
                }


                if (i.indexOf('#') >= 0 || i.indexOf('abgr') >= 0 || i.indexOf('bgr') >= 0) {

                    let vl = '';
                    let start = (auxCount * idx) + '';
                    const a2 = i.trim().split(' ');
                    if (a2.length > 0) vl = a2[0].replace('abgr', 'rgba').replace('bgr', 'rgb').replace(/;/g, ',');

                    if (a2.length > 1) start = a2[1].replace('%', '');

                    if (vl === '') return;

                    let vlI = { vl: vl, transp: '100' };

                    if (vl.indexOf('rgb') >= 0) {
                        vlI = this.rgbaToHex(vl);
                    }

                    if (!this.info.itens) this.info.itens = [{ value: vlI.vl, transp: vlI.transp, stop: start }]
                    else this.info.itens.push({ value: vlI.vl, transp: vlI.transp, stop: start });
                }

            });

        }

    }

    private rgbaToHex(rgbaString: string): { vl: string, transp: string } {
        const match = rgbaString.match(/(\d+(?:\.\d+)?)/g);

        if (!match) {
            return { vl: '', transp: '' };
        }

        const r = parseInt(match[0], 10);
        const g = parseInt(match[1], 10);
        const b = parseInt(match[2], 10);
        const a = match[3] ? (+match[3] * 100).toString() : '100';

        // Converte os componentes RGB para hexadecimal
        const toHex = (component: number) => {
            const hex = component.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        // Converte os componentes para hexadecimal
        const hexR = toHex(r);
        const hexG = toHex(g);
        const hexB = toHex(b);

        const hexColor = `#${hexR}${hexG}${hexB}`;

        return { vl: hexColor, transp: a };
    }

    private hexToRgba(hex: string, alpha = 1): string {
        // Remove o '#' se estiver presente
        hex = hex.replace(/^#/, '');

        // Converte para r, g, b
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        // Retorna a string RGBA
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    private changeStr(s: string): string {

        if (s.indexOf('rgba') >= 0 || s.indexOf('rgb') >= 0) {

            let tp = s.indexOf('rgba') >= 0 ? 'rgba' : 'rgb';
            let tpR = s.indexOf('rgba') >= 0 ? 'abgr' : 'bgr';
            let newst = '';
            let oldstr = '';
            let st = s.indexOf(tp);
            let ste = -1;

            st = s.substr(st).indexOf('(') + st;
            ste = s.substr(st).indexOf(')') + st;
            newst = s.slice(st, ste);
            oldstr = newst;
            newst = newst.replace(/ ,/g, ',').replace(/, /g, ',').replace(/,/g, ';');
            s = s.replace(oldstr, newst).replace(tp, tpR)

            return this.changeStr(s);

        } else {

            if (s.indexOf('(') === 0) s = s.substr(1);
            if (s.lastIndexOf(')') === s.length - 1) s = s.substring(0, s.length - 1);
            if (s.lastIndexOf(');') === s.length - 2) s = s.substring(0, s.lastIndexOf(');'));
            return s;

        }

    }

    private timeonChangeProp = -1;
    private onChangeProp(index: string) {
        window.clearTimeout(this.timeonChangeProp);
        this.timeonChangeProp = window.setTimeout(() => {
            const el = this.querySelector('.groupEdit[index="' + index + '"]')
            if (!el) return;
            this.changeValues(el as HTMLDivElement, index);
        }, 500);
    }

    private onChangeAux(prop: string) {
        window.clearTimeout(this.timeonChangeProp);
        this.timeonChangeProp = window.setTimeout(() => {

            const el = this.querySelector('*[prop="' + prop + '"]') as HTMLInputElement;
            this.info.aux = el.value + 'deg';
            this.mountMyValue();

        }, 500);
    }

    private changeValues(el: HTMLDivElement, idx: string): void {

        const elC = el.querySelector('input[prop="color"]') as HTMLInputElement;
        const elT = el.querySelector('input[prop="transp"]') as HTMLInputElement;
        const elS = el.querySelector('input[prop="stop"]') as HTMLInputElement;

        if (!elC || !elT || !elS || !this.info.itens[idx as any]) return;

        this.info.itens[idx as any].value = elC.value;
        this.info.itens[idx as any].transp = elT.value;
        this.info.itens[idx as any].stop = elS.value;
        this.info.itens.sort((a: any, b: any) => a.stop - b.stop);
        this.mountMyValue();

    }

    private mountMyValue(): void {

        let text = '';

        if (this.info.tp === 'background' && this.info.itens.length > 0) {
            text = this.hexToRgba(this.info.itens[0].value, +this.info.itens[0].transp / 100);
        } else if (this.info.itens.length > 0) {
            text = `${this.info.tp.trim()}(${this.info.aux.trim()},`
            this.info.itens.forEach((i, idx) => {
                const aux = idx === this.info.itens.length - 1 ? '' : ',';
                text = text + ` ${this.hexToRgba(i.value, +i.transp / 100)} ${i.stop}%${aux}`
            });

            text = text + ')';

        }

        this.css = text;
        this.info = Object.assign({}, this.info);
        this.setState();

    }

    private setState() {
        setState(`less.${this.position}.emitter`, 'helper');
        const styles: CSSStyleDeclaration = getState(`less.${this.position}.lessCSS.styles`);
        styles[this.actualKey as any] = this.css || '';
    }

    private arrayGallery = [
        'background: radial-gradient(circle, rgb(2, 0, 36) 36%, rgb(60, 70, 193) 66%);',
        'background: linear-gradient(342deg, rgba(34, 193, 195, 0.76) 50%, rgba(45, 253, 121, 0.24) 100%);',
        'background: radial-gradient(circle, rgb(63, 94, 251) 0%, rgb(252, 70, 107) 100%);',
        'background: linear-gradient(342deg, rgb(131, 58, 180) 0%, rgb(253, 29, 29) 50%, rgb(252, 176, 69) 100%);',
        'background: radial-gradient(circle, rgb(238, 174, 202) 0%, rgb(148, 187, 233) 100%);',
        'background: linear-gradient(135deg, rgba(30, 87, 153,1) 0%, rgba(41, 137, 216,1) 50%, rgba(32, 124, 202,1) 51%, rgba(125, 185, 232,1) 100%)',
        'background: linear-gradient(135deg, rgba(76, 76, 76,1) 0%, rgba(89, 89, 89,1) 12%, rgba(102, 102, 102,1) 25%, rgba(71, 71, 71,1) 39%, rgba(44, 44, 44,1) 50%, rgba(0, 0, 0,1) 51%, rgba(17, 17, 17,1) 60%, rgba(43, 43, 43) 76%, rgba(28, 28, 28,1) 91%, rgba(19, 19, 19,1) 100%)',
        'background: linear-gradient(135deg, rgba(243, 197, 189,1) 0%, rgba(232, 108, 87,1) 50%, rgba(234, 40, 3,1) 51%, rgba(255, 102, 0,1) 75%, rgba(199, 34, 0,1) 100%)',
        'background: linear-gradient(90deg, rgba(2, 0, 36,1) 0%, rgba(9, 9, 121,1) 35%, rgba(0, 212, 255,1) 100%)',
        'background: linear-gradient(0deg, rgba(34, 193, 195,1) 0%, rgba(253, 187, 45,1) 100%)',
        'background: linear-gradient(90deg, rgba(131, 58, 180,1) 0%, rgba(253, 29, 29,1) 50%, rgba(252, 176, 69,1) 100%)',
        'background: linear-gradient(310deg, rgba(5, 25, 55, 1) 0%, rgba(0, 77, 122,1) 20%, rgba(0, 135, 147, 1) 40%, rgba(0, 191 ,114, 1) 60%, rgba(168, 235 ,18, 1) 80%)',
        'background: linear-gradient(270deg, rgba(112, 225, 245, 1), rgba(255, 209, 148, 1))',
        'background: linear-gradient(90deg, rgba(85, 98, 112, 1), rgba(255, 107, 107, 1))',
        'background: linear-gradient(90deg, rgba(120, 2, 6,1), rgba(6, 17, 97,1))',
        'background: linear-gradient(120deg, rgba(45, 195, 195,1), rgba(158, 17, 17,1))',
        'background: linear-gradient(90deg, rgba(255, 78, 80,1), rgba(249, 212, 35,1))',
        'background: linear-gradient(90deg, rgba(255,239,0,1) 0%, rgba(127,164,8,1) 35%, rgba(0,212,255,1) 100%)',
        'background: rgba(240, 236, 227,1)',
        'background: rgba(223, 211, 195, 1)',
        'background: rgba(199, 177, 152,1)',
        'background: rgba(221, 221, 221,1)',
        'background: rgba(243, 225, 225, 1)',
        'background: rgba(249, 249, 249, 1)',
        'background: rgba(252, 247, 187, 1)',
        'background: rgba(255, 236, 199, 1)',
        'background: rgba(181, 144, 202, 1)',
        'background: rgba(166, 177, 225, 1)',
        'background: rgba(229, 138, 138, 1)',
        'background: rgba(212, 235, 208, 1)',
        'background: rgba(186, 223, 219, 1)',
        'background: rgba(255, 241, 172, 1)',
        'background: rgba(249, 188, 221, 1)',
        'background: rgba(56, 81, 112, 1)',
        'background: rgba(238, 238, 238, 1)',

    ];

}


interface IMyInfoBackground {
    tp: string,
    aux: string,
    itens: { value: string, transp: string, stop: string }[]
}
