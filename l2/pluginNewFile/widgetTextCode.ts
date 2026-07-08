/// <mls fileReference="_100555_/l2/pluginNewFile/widgetTextCode.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { CollabLitElement } from '/_102029_/l2/collabLitElement.js';

@customElement('plugin-new-file--widget-text-code-100555')
export class WidgetTextCode extends CollabLitElement {

  @property({ type: String }) config: string | undefined;

  @property({ type: String, reflect: true, attribute: true }) language = 'typescript';

  @property({ type: Array }) languages = [];

  @property({ type: String, reflect: true }) text = '';

  @query('.code') codeBlock: HTMLElement | undefined;
  @query('select') select: HTMLSelectElement | undefined;

  updated(changedProperties: Map<string | number | symbol, unknown>) {

    if (changedProperties.has('language')) {
      if (!(window as any).hljsLoaded) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
        script.onload = () => {
          (window as any).hljsLoaded = true;
          this.setCode();
        };
        document.head.appendChild(script);
      } else {
        this.setCode();
      }
    }

    if (changedProperties.has('text')) {
      if (!this.codeBlock) return;
      this.waitForLoadIfNeeded(() => {
        this.setCode();
      });
    }

    if (changedProperties.has('languages')) {
      if (this.select) this.select.value = this.language;
    }

  }

  private waitForLoadIfNeeded(callback: () => void, timeout: number = 10000, interval: number = 100) {
    let elapsedTime = 0;
    const checkVariable = () => {
      if ((window as any).hljsLoaded) {
        callback();
      } else if (elapsedTime < timeout) {
        elapsedTime += interval;
        setTimeout(checkVariable, interval);
      } else {
        console.error(`Error on load highlight.js. please try again`);
      }
    };
    checkVariable();
  }

  private unescapeHtml(str: string): string {
    const map: Record<string, string> = {
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#039;': "'",
      '&amp;': '&',
    };

    let result = str;
    let changed = true;
    while (changed) {
      changed = false;
      result = result.replace(/&(lt|gt|quot|#039|amp);/g, (match) => {
        changed = true;
        return map[match] ?? match;
      });
    }

    return result;
  }

  setCode() {

    if (!this.codeBlock) return;
    this.codeBlock.innerHTML = '';
    this.codeBlock.removeAttribute('data-highlighted');
    this.codeBlock.classList.add('language-' + this.language);
    const that = this;
    this.waitForLoadIfNeeded(() => {
      if (!that.codeBlock) return;
      (window as any).hljs.configure({ ignoreUnescapedHTML: true });
      if (!that.languages || that.languages.length === 0) that.languages = (window as any).hljs.listLanguages();
      const res = (window as any).hljs.highlight(this.unescapeHtml(this.text), { language: that.language });
      that.codeBlock.removeAttribute("data-highlighted");
      (window as any).hljs.highlightElement(that.codeBlock, { language: that.language });
      that.codeBlock.innerHTML = res.value;
    });

  }

  firstUpdated() {
    this.setCode();
  }

  render() {
    return html`
       <pre>
            <code class="code" spellcheck="false"></code>
       </pre>
    `;
  }


  private onChangeText(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    const val = target.textContent;

    const that = this;

    function setCursorToEnd(el: HTMLElement) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      if (!selection) return;
      selection.removeAllRanges();
      selection.addRange(range);
    }

    this.waitForLoadIfNeeded(() => {
      if (!that.codeBlock) return;
      const res = (window as any).hljs.highlight(val, { language: that.language });
      that.codeBlock.removeAttribute("data-highlighted");
      (window as any).hljs.highlightElement(that.codeBlock, { language: that.language });
      that.codeBlock.innerHTML = res.value;
      setCursorToEnd(that.codeBlock);
    });
  }

}