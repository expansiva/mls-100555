/// <mls fileReference="_100555_/l2/utils/collabDsInputSelectColor.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';
import { CollabLitElement } from '/_102029_/l2/collabLitElement.js';
//import { convertColorToHex } from '/_102027_/l2/libCommom.js';

export function initCollabDsInputSelectColor() { };

@customElement('utils--collab-ds-input-select-color-100555')
export class CollabDsInputSelectColor extends CollabLitElement {

    get value() { return this.configGetValue(); };

    set value(str) { this.configSetValue(str) };

    get valueInput(): string { return this._valueInput; };

    set valueInput(str) { this._valueInput = str };

    get valueSelect(): string { return this._valueSelect; };

    set valueSelect(str) { this._valueSelect = str };

    get valueColor(): string { return this._valueColor; };

    set valueColor(str) { this._valueColor = str || '#000000'}//convertColorToHex(str) || '#000000' };

    public arrayInputSelect: string[] = [];

    public arraySelect: string[] = [];

    @property() _valueInput: string = '';

    @property() _valueSelect: string = '';

    @property() _valueColor: string = '';

    @property() prop: string = '';

    @property() useInput: string = 'true';

    @property() useSelect: string = 'true';

    @property() useColor: string = 'true';

    render() {
        return html`    
            ${this.useInput === 'true' ? this.renderInput() : ''}
            ${this.useSelect === 'true' ? this.renderSelect() : ''}
            ${this.useColor === 'true' ? this.renderColor() : ''}
        `
    }

    renderInput() {
        return html`
            <div>
                <input type="text" .value=${this.onlyNumber(this._valueInput)} @input=${this.changeInput} @wheel=${this.handleWhell}>
                <select @change="${this.allChange}" .value="px">
                    ${repeat(this.arrayInputSelect, ((key: any) => key) as any,
            ((k: any, index: any) => {

                return html`<option value="${k}">${k}</option>`;

            }) as any
        )}
                </select>
            </div>
        `
    }

    renderSelect() {
        return html`
            <select @change="${this.allChange}" .value="px" prop="${this.prop}">
                    ${repeat(this.arraySelect, ((key: any) => key) as any,
            ((k: any, index: any) => {

                return html`<option value="${k}">${k}</option>`;

            }) as any
        )}
            </select>
        `
    }

    renderColor() {
        return html`
            <input type="color" .value="${this._valueColor}" @input="${this.allChange}">
        `
    }

    updated() {

        const sel = this.querySelector('div select') as HTMLSelectElement;
        if (sel) sel.value = this.onlyTxt(this._valueInput);

        const sel2 = this.querySelector('select[prop]') as HTMLSelectElement;
        if (sel2) sel2.value = this.onlyTxt(this._valueSelect);
    }

    //---------IMPLEMENTS-------------

    private configGetValue(): string {

        let ret = '';

        if (this.useInput === 'true' && this._valueInput) ret = this._valueInput;
        else if (this.useInput === 'true') ret = '0px';

        if (this.useSelect === 'true' && this._valueSelect) ret += ' ' + this._valueSelect;
        else if (this.useSelect === 'true') ret = ' none';

        if (this.useColor === 'true' && this._valueColor) ret += ' ' + this._valueColor;
        else if (this.useColor === 'true') ret = ' #ffffff';

        return ret.trim();

    }

    private configSetValue(str: string) {

        if (!str) return;
        const array = str.split(' ');

        if (this.useInput === 'true' && array.length >= 1) {
            this._valueInput = array[0];
            array.splice(0, 1);
        }

        if (this.useSelect === 'true' && array.length >= 1) {
            this._valueSelect = array[0];
            array.splice(0, 1);
        }

        if (this.useColor === 'true' && array.length >= 1) {
            this._valueColor = array[0];
            array.splice(0, 1);
        }

    }

    private onlyNumber(str: string): string {
        const regexNum = /-?\d+(?:\.\d+)?/;
        const res = str.match(regexNum);
        return res ? res[0] : '';
    }

    private onlyTxt(str: string): string {
        const regexStr = /[a-zA-Z]+/;
        const res = str.match(regexStr);
        return res && (res as any)[0] ? ((res as any)[0] as string).replace('.', '') : 'px';
    }

    private handleWhell(wheelEvent: WheelEvent) {
        wheelEvent.preventDefault();
        const input = wheelEvent.target as HTMLInputElement;

        let currentValue = input.value.replace(',', '.');
        if (!currentValue) currentValue = '0';
        let isDecimal = currentValue.includes('.');
        let parsedValue = parseFloat(currentValue);
        let isScrollingUp = wheelEvent.deltaY < 0;
        if (isNaN(parsedValue)) {
            return;
        }


        if (!isDecimal) parsedValue += (wheelEvent.deltaY < 0 ? 1 : -1);
        else {
            let decimalPart = currentValue.split('.')[1] || '';
            let decimalLength = decimalPart.length;

            if (decimalLength > 0) {
                let factor = Math.pow(10, decimalLength);
                if (isScrollingUp) parsedValue = (Math.floor(parsedValue * factor) + 1) / factor; // Incrementa a última casa decimal
                else parsedValue = (Math.floor(parsedValue * factor) - 1) / factor; // Decrementa a última casa decimal

            }
        }

        input.value = parsedValue.toString();
        this.allChange(wheelEvent as any);

    }


    private changeInput(e: InputEvent): void {
        const input = e.target as HTMLInputElement;
        let value = input.value.replace(/[^0-9.,]/g, '');
        let dotCount = (value.match(/\./g) || []).length;
        if (dotCount > 1) value = value.replace(/\.(?=[^\.]*$)/, '');
        value = value.replace(',', '.');
        input.value = value;
        if (value.endsWith('.')) return;
        this.allChange(e)
    }

    private allChange(e: InputEvent): void {

        e.stopPropagation();

        let input = this.querySelector('input[type="text"]') as HTMLInputElement;
        let sel = this.querySelector('select') as HTMLSelectElement;
        let sel2 = this.querySelector('select[prop]') as HTMLSelectElement;
        let color = this.querySelector('input[type="color"]') as HTMLInputElement;

        const ret = [];

        if (this.useInput === 'true') {
            this._valueInput = input.value + sel.value;
            ret.push({ tp: 'input', value: input.value + sel.value });
        }

        if (this.useSelect === 'true') {
            this._valueSelect = sel2.value;
            ret.push({ tp: 'select', value: sel2.value });
        }

        if (this.useColor === 'true') {
            this._valueColor = color.value;
            ret.push({ tp: 'color', value: color.value });
        }

        this.fireEvents(
            {
                key: this.prop,
                value: ret
            }
        );

    }

    private fireEvents(obj: any): void {

        obj.target = this;
        const onChangePropEvento = new CustomEvent('onchange', {
            bubbles: true,
            detail: obj,
        });

        this.dispatchEvent(onChangePropEvento);
    }
}
