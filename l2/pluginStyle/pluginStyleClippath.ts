/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleClippath.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property, query } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { propertyDataSource } from '/_102029_/l2/collabDecorators.js';
import { getState, setState } from '/_102029_/l2/collabState.js';
import { getMessageKey } from '/_102029_/l2/collabLitElement.js'
import { ICSSState } from '/_100555_/l2/utils/lessCSS.js';

/// **collab_i18n_start**
const message_pt = {
    btnApply: 'Aplicar',
    maker: 'Css clip-path criador',
    description: 'Um plugin versátil para manter e personalizar propriedades de clip-path CSS. Crie facilmente formas complexas e aplique-as a elementos, permitindo designs de UI exclusivos e criativos com precisão.'
}

const message_en = {
    btnApply: 'Apply',
    maker: 'Css clip-path Maker',
    description: 'A versatile plugin for maintaining and customizing CSS clip-path properties. Easily create complex shapes and apply them to elements, enabling unique and creative UI designs with precision.'

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const tags = ['clip-path'];

export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}

@customElement('plugin-style--plugin-style-clippath-100555')
export class PluginStyleClipath extends StateLitElement {

    @propertyDataSource() state: ICSSState | undefined;
    @property() position: 'left' | 'right' = 'left';
    @property() showFull: string = 'false';
    @property() clipPath: string | undefined;

    @query('#svgOverlay') svgOverlay: HTMLElement | undefined;
    @query('#output') output: HTMLTextAreaElement | undefined;
    @query('#image') image: HTMLImageElement | undefined;
    @query('#pointsContainer') pointsContainer: HTMLDivElement | undefined;

    private msg: MessageType = messages['en'];

    handleIcaStateChange(_key: string, _value: ICSSState) {
        if (_key !== `less.${this.position}` || !_value) return;
        if (_value.emitter === 'helper') return;
        if (!_value.selector || !_value.lessCSS || !_value.lessCSS.lessAST || !_value.lessCSS.lessAST.ast[_value.selector]) return;
        const actualAst = _value.lessCSS.lessAST.ast[_value.selector];
        if (!actualAst) return;

        let hasRuleClipPath: boolean = false;
        Object.keys(actualAst).forEach((prop) => {
            if (prop === 'clip-path') hasRuleClipPath = true;
        });
        this.clear();

        if (hasRuleClipPath) {
            this._onIcaStateChange();
        }
    }

    private clear() {
        this.clipPath = undefined;
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
                if (propertyName === 'clip-path') {
                    const propertyValue = rule.style.getPropertyValue(propertyName);
                    const convertedProp = this.state?.lessCSS?.lessAST.toCamelCaseProperty(propertyName);
                    if (!convertedProp) return;
                    (this as any)[convertedProp] = propertyValue;
                }
            }
        }

        if (this.clipPath) this.initClipPathMaker(this.clipPath);

    }

    render() {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            ${this.renderGallery()}
            ${this.renderPreviewEditable()}
        `;
    }

    renderGallery() {

        return html`
            <div class="gallery">
                ${repeat(this.arrayGallery, ((key: any) => key) as any,
            ((css: any, index: any) => {
                return html`
                            <div class="itemgallery" .gallery=${css.css} .name= ${css.name} @click="${this.handleChangeCss}">
                                <div class="gallery-item" style="${css.css}" .gallery=${css.css}></div>
                                <div .gallery=${css.css}></div>
                            </div>
                        `;
            }) as any
        )}
            </div>
        
        `
    }

    renderPreviewEditable() {
        return html`
        <h3>${this.msg.maker}</h3>
        <div style=${this.showFull === 'false' ? 'display:none' : 'display:flex'} class="previewEditable">
            <div id="previewWrapper">
                <img id="image" src="./l3/_100529_/images/startl7.avif" alt="Preview">
                <div id="pointsContainer"></div>
            </div>
            <textarea style="display:none" id="output" readonly></textarea>
        <div>
        `
    }

    private points: any[] = [];
    private parameters: any[] = [];
    private currentTemplate = '';
    private shapeType: string | undefined;
    private outputRes: string = '';

    private renderClipPath() {
        if (!this.image || !this.output || !this.pointsContainer) return;

        let _this = this;

        const startDrag = (e: MouseEvent): void => {
            const point = e.target as HTMLElement;
            const index = point.dataset.index;
            if (!index) return;

            const onMouseMove = (event: MouseEvent): void => {
                if (!this.image) return;
                const rect = this.image.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 100;
                const y = ((event.clientY - rect.top) / rect.height) * 100;

                if (this.shapeType === 'polygon') {
                    const idx = Number(index);
                    if (isNaN(idx)) return;
                    this.points[idx] = [
                        Math.min(100, Math.max(0, parseFloat(x.toFixed(2)))),
                        Math.min(100, Math.max(0, parseFloat(y.toFixed(2))))
                    ];
                } else if (this.shapeType === 'circle') {
                    const [radius, [cx, cy]] = this.parameters;
                    if (index === 'center') {
                        this.parameters = [radius, [x, y]];
                    } else {
                        const distX = x - cx;
                        const distY = y - cy;
                        const newRadius = Math.sqrt(distX * distX + distY * distY);
                        this.parameters = [Math.min(100, newRadius), [cx, cy]];
                    }
                } else if (this.shapeType === 'ellipse') {
                    const [[rx, ry], [cx, cy]] = this.parameters;
                    if (index === 'x') {
                        const newRx = Math.min(100, Math.abs(x - cx));
                        this.parameters = [[newRx, ry], [cx, cy]];
                    } else if (index === 'y') {
                        const newRy = Math.min(100, Math.abs(y - cy));
                        this.parameters = [[rx, newRy], [cx, cy]];
                    }
                }

                this.renderClipPath();
            };

            function onMouseUp(): void {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                _this.applyChanges.bind(_this)();
                
            }
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        this.shapeType = this.identifyShapeType(this.currentTemplate);
        let clipPath = '';

        if (this.shapeType === 'polygon') {
            const polygonPoints = this.points.map(([x, y]) => `${x}% ${y}%`).join(', ');
            clipPath = `polygon(${polygonPoints})`;
        } else if (this.shapeType === 'circle') {
            const [radius, [cx, cy]] = this.parameters;
            clipPath = `circle(${radius}% at ${cx}% ${cy}%)`;
        } else if (this.shapeType === 'ellipse') {
            const [[rx, ry], [cx, cy]] = this.parameters;
            clipPath = `ellipse(${rx}% ${ry}% at ${cx}% ${cy}%)`;
        }

        this.image.style.clipPath = clipPath;
        this.output.value = clipPath;
        this.outputRes = clipPath;
        this.pointsContainer.innerHTML = '';

        if (this.shapeType === 'polygon') {
            this.points.forEach(([x, y], index) => {
                const point = document.createElement('div');
                point.classList.add('draggable');
                point.style.left = `${x}%`;
                point.style.top = `${y}%`;
                point.dataset.index = index.toString();
                point.addEventListener('mousedown', startDrag);
                this.pointsContainer?.appendChild(point);
            });
        } else if (this.shapeType === 'circle') {
            const [radius, [cx, cy]] = this.parameters;
            const point = document.createElement('div');
            point.classList.add('draggable');
            point.style.left = `${cx}%`;
            point.style.top = `${cy}%`;
            point.dataset.index = 'center';
            point.addEventListener('mousedown', startDrag);
            this.pointsContainer?.appendChild(point);

            const pointRadius = document.createElement('div');
            pointRadius.classList.add('draggable');
            pointRadius.style.left = `${cx + radius}%`;
            pointRadius.style.top = `${cy}%`;
            pointRadius.dataset.index = 'radius';
            pointRadius.addEventListener('mousedown', startDrag);
            this.pointsContainer?.appendChild(pointRadius);

        } else if (this.shapeType === 'ellipse') {

            const [[rx, ry], [cx, cy]] = this.parameters;
            const pointX = document.createElement('div');
            pointX.classList.add('draggable');
            pointX.style.left = `${cx + rx}%`;
            pointX.style.top = `${cy}%`;
            pointX.dataset.index = 'x';
            pointX.addEventListener('mousedown', startDrag);
            this.pointsContainer?.appendChild(pointX);

            const pointY = document.createElement('div');
            pointY.classList.add('draggable');
            pointY.style.left = `${cx}%`;
            pointY.style.top = `${cy + ry}%`;
            pointY.dataset.index = 'y';
            pointY.addEventListener('mousedown', startDrag);
            this.pointsContainer?.appendChild(pointY);
        }
    }

    private applyChanges() {
        this.setState(this.outputRes);
    }


    private timeonChange = -1;
    private handleChangeCss(e: KeyboardEvent) {

        e.stopPropagation();
        let el = e.target as HTMLElement;
        if (!el.classList.contains('itemgallery')) {
            el = el.closest('.itemgallery') as HTMLElement;
        }

        let css = (el as any).gallery;
        let name = (el as any).name;
        if (!el || !css && !name) return;
        css = css.replace('clip-path:', '').trim();

        if (this.timeonChange) window.clearTimeout(this.timeonChange);
        this.timeonChange = window.setTimeout(() => {
            this.setState(css);

        }, 100);
    }

    private setState(css: string) {
        setState(`less.${this.position}.emitter`, 'helper');
        const styles: CSSStyleDeclaration = getState(`less.${this.position}.lessCSS.styles`);
        styles.clipPath = css;
        this.initClipPathMaker(css);
    }

    private initClipPathMaker(css: string) {
        this.currentTemplate = css;
        this.shapeType = this.identifyShapeType(css);
        this.points = this.currentTemplate
            .replace(/polygon\(|\)/g, '')
            .split(', ')
            .map((point) => point.split(' ').map((val) => parseFloat(val)));

        this.setParameters();
        this.renderClipPath();
    }

    private setParameters() {
        this.parameters = [];
        if (this.shapeType === 'ellipse') {
            this.parameters = this.currentTemplate
                .replace('ellipse(', '')
                .replace(')', '')
                .split(' at ')
                .map((part, index) => {
                    if (index === 0) {
                        return part.split(' ').map((val) => parseFloat(val.replace('%', '')));
                    } else {
                        return part.split(' ').map((val) => parseFloat(val.replace('%', '')));
                    }
                });
        }

        if (this.shapeType === 'circle') {
            this.parameters = this.currentTemplate
                .replace('circle(', '')
                .replace(')', '')
                .split(' at ')
                .map((part, index) => {
                    if (index === 0) {
                        return parseFloat(part.replace('%', ''));
                    } else {
                        return part.split(' ').map((val) => parseFloat(val.replace('%', '')));
                    }
                });

        }

    }

    private identifyShapeType(clipPath: string): 'polygon' | 'circle' | 'ellipse' | undefined {
        if (clipPath.startsWith('polygon(')) {
            return 'polygon';
        } else if (clipPath.startsWith('circle(')) {
            return 'circle';
        } else if (clipPath.startsWith('ellipse(')) {
            return 'ellipse';
        }
        return undefined;
    }

    private arrayGallery = [
        { css: 'clip-path: polygon(50% 0%, 0% 100%, 100% 100%);', name: 'triangle' },
        { css: 'clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', name: 'trapezoid' },
        { css: 'clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)', name: 'parallelogram' },
        { css: 'clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', name: 'rhombus' },
        { css: 'clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', name: 'pentagon' },
        { css: 'clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', name: 'hexagon' },
        { css: 'clip-path: polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)', name: 'heptagon' },
        { css: 'clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', name: 'octagon' },
        { css: 'clip-path: polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)', name: 'nonagon' },
        { css: 'clip-path: polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)', name: 'decagon' },
        { css: 'clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)', name: 'bevel' },
        { css: 'clip-path: polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)', name: 'rabbet' },
        { css: 'clip-path: polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)', name: 'left-arrow' },
        { css: 'clip-path: polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)', name: 'right-arrow' },
        { css: 'clip-path: polygon(25% 0%, 100% 1%, 100% 100%, 25% 100%, 0% 50%)', name: 'left-poin' },
        { css: 'clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)', name: 'right-point' },
        { css: 'clip-path: polygon(100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%)', name: 'left-chevron' },
        { css: 'clip-path: polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)', name: 'right-chevron' },
        { css: 'clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', name: 'star' },
        { css: 'clip-path: polygon(10% 25%, 35% 25%, 35% 0%, 65% 0%, 65% 25%, 90% 25%, 90% 50%, 65% 50%, 65% 100%, 35% 100%, 35% 50%, 10% 50%)', name: 'cross' },
        { css: 'clip-path: polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)', name: 'message' },
        { css: 'clip-path: polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%)', name: 'frame' },
        { css: 'clip-path: polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)', name: 'close' },
        { css: 'clip-path: circle(40% at 50% 50%)', name: 'circle' },
        { css: 'clip-path: ellipse(25% 40% at 50% 50%)', name: 'ellipse' },


    ];
}