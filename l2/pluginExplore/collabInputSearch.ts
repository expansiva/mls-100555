/// <mls fileReference="_100555_/l2/pluginExplore/collabInputSearch.ts" enhancement="_102027_/l2/enhancementLit"/>

import { html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { CollabLitElement } from '/_102029_/l2/collabLitElement.js';

/// **collab_i18n_start**

const message_pt = {
    search: "Procurar...",
}

const message_en = {
    search: 'Search...',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('plugin-explore--collab-input-search-100555')
export class CollabInputSearch extends CollabLitElement {

    private msg: MessageType = messages['en'];

    @property({ type: String }) placeholder = '';
    @property({ type: String }) value = '';
    @state() private focused = false;

    firstUpdated() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        if(!this.placeholder) this.placeholder = this.msg.search
    }

    render() {
        const hasValue = this.value.length > 0;
        const wrapperClass = [
            'wrapper',
            this.focused ? 'focused' : '',
            hasValue ? 'has-value' : '',
        ].filter(Boolean).join(' ');

        return html`
            <div class=${wrapperClass} @click=${() => this.shadowRoot?.querySelector('input')?.focus()}>

                <!-- Search icon -->
                <span class="icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="7"/>
                    <line x1="16.5" y1="16.5" x2="22" y2="22"/>
                </svg>
                </span>

                <!-- Text input -->
                <input
                type="text"
                .value=${this.value}
                placeholder=${this.placeholder}
                aria-label="Search"
                @input=${this._onInput}
                @focus=${this._onFocus}
                @blur=${this._onBlur}
                @keydown=${this._onKeyDown}
                />

                <!-- Clear button -->
                ${hasValue ? html`
                <button class="clear-btn" @click=${this._clear} aria-label="Clear search" title="Clear">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6"  y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
                ` : ''}

            </div>
        `;
    }

    private _onInput(e: Event) {
        this.value = (e.target as HTMLInputElement).value;
        this.dispatchEvent(new CustomEvent('search-input', { detail: this.value, bubbles: true, composed: true }));
    }

    private _onFocus() { this.focused = true; }
    private _onBlur() { this.focused = false; }

    private _clear() {
        this.value = '';
        this.shadowRoot?.querySelector('input')?.focus();
        this.dispatchEvent(new CustomEvent('input', { detail: '', bubbles: true, composed: true }));
        this.dispatchEvent(new CustomEvent('search-clear', { bubbles: true, composed: true }));
    }

    private _onKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') this._clear();
    }
}
