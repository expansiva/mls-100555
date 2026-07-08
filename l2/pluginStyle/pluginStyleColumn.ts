/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleColumn.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property, queryAll } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { getState, setState } from '/_102029_/l2/collabState.js';
import { getMessageKey } from '/_102029_/l2/collabLitElement.js';
import { CollabDsInputSelectColor } from '/_100555_/l2/utils/collabDsInputSelectColor.js';
import { ICSSState } from '/_100555_/l2/utils/lessCSS.js';
import { convertColorToHex } from '/_102027_/l2/libCommom.js';
import '/_100555_/l2/utils/collabDsInputSelectColor.js';
import '/_100555_/l2/utils/collabDsInputRange.js';
import '/_100555_/l2/utils/collabDsInputSelectColor.js';
import '/_100555_/l2/utils/collabDsInputRange.js';

/// **collab_i18n_start**
const message_pt = {
    columnsCount: 'Contagem de coluna',
    columnsWidth: 'Largura das colunas',
    columnsGap: 'Lacuna de colunas',
    columnsRule: 'Regra de Coluna',
    columnSpan: 'Espanço da coluna',
    breakInside: 'Quebre por dentro',
    description: 'Este plugin permite criar e ajustar colunas de texto de forma prática e eficiente. Com ele, é possível definir o número de colunas, o espaçamento entre elas e outros detalhes de formatação, proporcionando um layout organizado e facilitando a leitura.'
}

const message_en = {
    columnsCount: 'Columns Count',
    columnsWidth: 'Columns Width',
    columnsGap: 'Columns Gap',
    columnsRule: 'Columns Rule',
    columnSpan: 'Column Span',
    breakInside: 'Break Inside',
    description: 'This plugin allows for easy and efficient creation and adjustment of text columns. It lets you set the number of columns, spacing between them, and other formatting details, providing an organized layout and enhancing readability.'

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const tags = ['column*', 'break-inside'];

export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}

@customElement('plugin-style--plugin-style-column-100555')
export class PluginStyleColumn extends StateLitElement {

    @property() showFull: string = 'true';
    @propertyDataSource() state: ICSSState | undefined;
    @property() position: 'left' | 'right' = 'left';


    @property() columnCount: string | undefined;
    @property() columnWidth: string | undefined;
    @property() columnGap: string | undefined;
    @property() columnSpan: string | undefined;

    @property() columnRule: string | undefined;
    @property() columnRuleColor: string | undefined;
    @property() columnRuleStyle: string | undefined;
    @property() columnRuleWidth: string | undefined;

    @property() breakInside: string | undefined;

    @queryAll('utils--collab-ds-input-select-color-100555') columnRuleInputs: CollabDsInputSelectColor[] | undefined;

    private msg: MessageType = messages['en'];

    private tpMeasures = ['px', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'ex', 'ch', 'auto'];

    private tpBorder = ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'ridge', 'inset', 'outset', 'hidden', 'inherit', 'initial', 'unset'];

    handleIcaStateChange(_key: string, _value: ICSSState) {
        if (_key !== `less.${this.position}` || !_value) return;
        if (_value.emitter === 'helper') return;
        if (!_value.selector || !_value.lessCSS || !_value.lessCSS.lessAST || !_value.lessCSS.lessAST.ast[_value.selector]) return;
        const actualAst = _value.lessCSS.lessAST.ast[_value.selector];
        if (!actualAst) return;
        let hasRuleColumnInAST: boolean = false;
        Object.keys(actualAst).forEach((prop) => {
            if ((prop.startsWith('column')) || prop === 'break-inside') hasRuleColumnInAST = true;
        });
        this.clear();

        if (hasRuleColumnInAST) {
            this._onIcaStateChange();
        }
    }

    private clear() {
        this.columnCount = undefined;
        this.columnWidth = undefined;
        this.columnGap = undefined;
        this.columnSpan = undefined;
        this.columnRule = undefined;
        this.columnRuleColor = undefined;
        this.columnRuleStyle = undefined;
        this.columnRuleWidth = undefined;
        this.breakInside = undefined;
    }


    private _onIcaStateChange() {
        if (!this.state || !this.state.lessCSS) return;
        const rule = this.findCSSRuleInIframe(this.state.lessCSS.selector);
        if (!rule) return;
        this.setValues(rule);
    }

    private setValues(rule: CSSStyleRule): void {

        const props = ['column-count', 'column-width', 'column-gap', 'column-span', 'column-rule-color', 'column-rule-style', 'column-rule-width', 'break-inside'];

        if (rule.style) {
            for (let i = 0; i < rule.style.length; i++) {
                const propertyName = rule.style[i];
                if (props.includes(propertyName)) {
                    const propertyValue = rule.style.getPropertyValue(propertyName);
                    const convertedProp = this.state?.lessCSS?.lessAST.toCamelCaseProperty(propertyName);
                    if (!convertedProp) return;

                    (this as any)[convertedProp] = propertyValue;
                }
            }
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

    private setColumnRuleValues() {
        const aux: { [key: string]: Function } = {
            'column-rule': (value: string) => { this.columnRule = value },
        }

        this.columnRuleInputs?.forEach((bdInp) => {
            const prop = bdInp.getAttribute('prop');
            if (!prop) return;
            aux[prop](bdInp.value);
        })
    }


    private setState() {
        this.setColumnRuleValues();
        setState(`less.${this.position}.emitter`, 'helper');
        const styles: CSSStyleDeclaration = getState(`less.${this.position}.lessCSS.styles`);
        styles.columnCount = this.columnCount || '';
        styles.columnGap = this.columnGap || '';
        styles.columnSpan = this.columnSpan || '';
        styles.columnWidth = this.columnWidth || '';
        styles.columnRuleColor = this.columnRuleColor || '';
        styles.columnRuleStyle = this.columnRuleStyle || '';
        styles.columnRuleWidth = this.columnRuleWidth || '';
        styles.breakInside = this.breakInside || '';

    }

    private timeonChange = -1;
    private handleChange(e: KeyboardEvent) {
        if (this.timeonChange) window.clearTimeout(this.timeonChange);
        const el = e.detail ? (e.detail as any).target : e.target as HTMLInputElement;
        const prop = el.getAttribute('prop');
        if (!prop) return;
        const convertedProp = this.state?.lessCSS?.lessAST.toCamelCaseProperty(prop);
        if (!convertedProp) return;
        if (this.timeonChange) window.clearTimeout(this.timeonChange);
        this.timeonChange = window.setTimeout(() => {
            if (convertedProp === 'columnRule') {
                this.columnRuleWidth = (el as any).valueInput;
                this.columnRuleColor = (el as any).valueColor;
                this.columnRuleStyle = (el as any).valueSelect;

            } else (this as any)[convertedProp] = el.value;
            this.setState();
        }, 100);

    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
             ${this.showFull === 'true' ?
                html`
                ${this.renderGallery()}
                ${this.renderColumn()}
            ` :
                html`
                ${this.renderGallery()}
            `
            }
        `;
    }

    renderColumn() {
        return html`
            <div>
                <div class="group">
                    <span>${this.msg.columnsCount}</span>
                    <div class="group-edit">
                        <utils--collab-ds-input-range-100555 
                        prop="column-count" 
                        value=${this.columnCount}
                        useSelect="false" 
                        @onchange=${(e: KeyboardEvent) => this.handleChange(e)}
                        ></utils--collab-ds-input-range-100555>
                    </div>

                    <span>${this.msg.columnsWidth}</span>
                    <div class="group-edit">
                        <utils--collab-ds-input-range-100555
                        prop="column-width"
                        value=${this.columnWidth}
                        .arraySelect=${this.tpMeasures}  
                        @onchange=${(e: KeyboardEvent) => this.handleChange(e)}
                        ></utils--collab-ds-input-range-100555>
                    </div>

                    <span>${this.msg.columnsGap}</span>
                    <div class="group-edit">
                        <utils--collab-ds-input-range-100555
                        prop="column-gap" 
                        value=${this.columnGap}
                        .arraySelect=${this.tpMeasures} 
                        @onchange=${(e: KeyboardEvent) => this.handleChange(e)}
                        ></utils--collab-ds-input-range-100555>
                    </div>

                    <span>${this.msg.columnsRule}</span>
                    <div class="group-edit">
                        <utils--collab-ds-input-select-color-100555
                        prop="column-rule" 
                        _valueInput=${this.columnRuleWidth}
                        _valueSelect=${this.columnRuleStyle}
                        _valueColor=${convertColorToHex(this.columnRuleColor || '')}
                        .arrayInputSelect=${this.tpMeasures} 
                        .arraySelect=${this.tpBorder} 
                        @onchange=${(e: KeyboardEvent) => this.handleChange(e)}
                        ></utils--collab-ds-input-select-color-100555>
                    </div>

                    <span>${this.msg.columnSpan}</span>
                    <div class="group-edit">
                        <select 
                            class="group-select"  
                            prop="column-span"
                            .value=${this.columnSpan}
                            @change=${(e: KeyboardEvent) => this.handleChange(e)}
                        >
                                <option value=""></option>
                                <option value="none" ?selected=${this.columnSpan === 'none'}>none </option>
                                <option value="all" ?selected=${this.columnSpan === 'all'} >all</option>
                                <option value="inherit" ?selected=${this.columnSpan === 'inherit'}>inherit</option>
                                <option value="initial" ?selected=${this.columnSpan === 'initial'}>initial</option>
                                <option value="unset" ?selected=${this.columnSpan === 'unset'}>unset</option>
                        </select>   
                    </div>
                    
                    <span>${this.msg.breakInside}</span>
                    <div class="group-edit">
                        <select 
                            class="group-select"  
                            prop="break-inside"      
                            .value=${this.breakInside}
                            @change=${(e: KeyboardEvent) => this.handleChange(e)}
                        >
                            <option value=""></option>
                            <option value="none" ?selected=${this.breakInside === 'none'}>none</option>
                            <option value="auto" ?selected=${this.breakInside === 'auto'}>auto</option>
                            <option value="avoid" ?selected=${this.breakInside === 'avoid'}>avoid</option>
                            <option value="avoid-page" ?selected=${this.breakInside === 'avoid-page'}>avoid-page</option>
                            <option value="avoid-column" ?selected=${this.breakInside === 'avoid-column'}>avoid-column</option>
                            <option value="avoid-region" ?selected=${this.breakInside === 'avoid-region'}>avoid-region</option>
                            <option value="inherit" ?selected=${this.breakInside === 'inherit'}>inherit</option>
                            <option value="initial" ?selected=${this.breakInside === 'initial'}>initial</option>
                            <option value="unset" ?selected=${this.breakInside === 'unset'}>unset</option>
                        </select>   
                    </div>
                </div>
            </div>
        `;
    }

    renderGallery() {

        return html`
            <div class="gallery">
             ${repeat(this.gallery, ((key: string) => key) as any,
            ((galleryItem: IGallery, index: number) => {
                return html`
                        <h5 class="gallery-item" style="${galleryItem.style}" @click=${() => { this.onGalleryClick(galleryItem) }} >Lorem ipsum dolor sit amet, consectetur adipisicing elit,sed do eiusmod tempor incididunt ut labore et dolore.</h5>
                        `;
            }) as any
        )}
            </div>
        
        `
    }

    private async onGalleryClick(item: IGallery) {
        this.breakInside = item.state.breakInside;
        this.columnCount = item.state.columnCount;
        this.columnGap = item.state.columnGap;
        this.columnRuleColor = item.state.columnRuleColor;
        this.columnRuleStyle = item.state.columnRuleStyle;
        this.columnRuleWidth = item.state.columnRuleWidth;
        this.columnSpan = item.state.columnSpan;
        this.columnWidth = item.state.columnWidth;
        await this.updateComplete;
        this.setState();
    }


    private gallery: IGallery[] = [

        {
            style: 'column-count: 2;',
            state: {
                breakInside: '',
                columnCount: '2',
                columnGap: '',
                columnRuleColor: '',
                columnRuleStyle: '',
                columnRuleWidth: '',
                columnSpan: '',
                columnWidth: '',
            }
        },
        {
            style: 'column-count: 3;',
            state: {
                breakInside: '',
                columnCount: '3',
                columnGap: '',
                columnRuleColor: '',
                columnRuleStyle: '',
                columnRuleWidth: '',
                columnSpan: '',
                columnWidth: '',
            }
        },
        {
            style: 'column-count: 2; column-gap: 20px; column-rule-width: 1px; column-rule-style: dashed;',
            state: {
                breakInside: '',
                columnCount: '2',
                columnGap: '20px',
                columnRuleColor: '',
                columnRuleStyle: 'dashed',
                columnRuleWidth: '1px',
                columnSpan: '',
                columnWidth: '',
            }
        }, {
            style: 'column-count: 2; column-rule-width: 1px; column-rule-style: solid;',
            state: {
                breakInside: '',
                columnCount: '2',
                columnGap: '',
                columnRuleColor: '',
                columnRuleStyle: 'solid',
                columnRuleWidth: '1px',
                columnSpan: '',
                columnWidth: '',
            }
        }
    ]


}

interface IGallery {
    style: string,
    state: {
        columnCount: string,
        columnWidth: string,
        columnGap: string,
        columnSpan: string,
        columnRuleColor: string,
        columnRuleStyle: string,
        columnRuleWidth: string,
        breakInside: string,

    }
}

