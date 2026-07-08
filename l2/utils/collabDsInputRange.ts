/// <mls fileReference="_100555_/l2/utils/collabDsInputRange.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';

export function initCollabDSInputRange() { };

@customElement('utils--collab-ds-input-range-100555')
export class CollabDSInputRange extends StateLitElement {

    public arraySelect: string[] = [];

    @property() useSelect: string = 'true';

    @property() value: string = '';

    @property() valueInput: string = '';

    @property() prop: string = '';

    min: number = 0;

    max: number = 100;

    render() {

        return html`
            ${this.renderSelect()}
            
        `
    }

    renderSelect() {
        return html`
            <div>
                <input type="text" .value="${this.onlyNumber(this.value)}" @input="${this.changeInput}" @wheel=${this.handleWhell}> </input>
                <select @change="${this.changeSelect}" style="${this.useSelect === 'false' ? 'display:none' : ''}">
                    ${repeat(this.arraySelect, ((key: any) => key) as any,
            ((k: any, index: any) => {

                return html`<option value="${k}">${k}</option>`;

            }) as any
        )}
                </select>
            </div>
        `;
    }

    async updated(_changedProperties: Map<PropertyKey, unknown>) {
        if (_changedProperties.has('value')) {
            const sel = this.querySelector('select') as HTMLSelectElement;
            const inpt = this.querySelector('input') as HTMLInputElement;

            if (!sel) return;
            sel.value = this.onlyTxt(this.value);

            setTimeout(() => {
                const newPosition = Math.min(this.cursorPosition, inpt.value.length);
                inpt.setSelectionRange(newPosition, newPosition);
            }, 10);

        }
    }


    //---------IMPLEMENTS-------------


    private cursorPosition: any;

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
        this.allChange(wheelEvent as any, 'input');

    }

    private changeInput(e: InputEvent): void {
        const input = e.target as HTMLInputElement;

        let value = input.value.replace(/[^0-9.,]/g, '');
        let dotCount = (value.match(/\./g) || []).length;
        if (dotCount > 1) value = value.replace(/\.(?=[^\.]*$)/, '');
        value = value.replace(',', '.');
        input.value = value;
        if (value.endsWith('.')) return;
        this.cursorPosition = input.selectionStart;

        this.allChange(e, 'input')
    }

    private changeSelect(e: InputEvent): void {
        this.allChange(e, 'sel')
    }

    private async allChange(e: InputEvent, mode: string) {

        e.stopPropagation();

        let input = this.querySelector('input[type="text"]') as HTMLInputElement;
        let sel = this.querySelector('select') as HTMLSelectElement;
        if (!input || !sel) return;


        this.value = input.value + sel.value;
        await this.updateComplete;
        input.setSelectionRange(input.value.length, input.value.length);
        this.fireEvents(
            {
                key: this.prop,
                value: input.value + sel.value
            }
        );

    }

    private fireEvents(obj: any): void {

        obj.target = this;
        const onChangePropEvento = new CustomEvent('onchange', {
            bubbles: true,
            detail: obj
        });

        this.dispatchEvent(onChangePropEvento);
    }


}
