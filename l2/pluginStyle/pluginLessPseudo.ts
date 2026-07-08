/// <mls fileReference="_100555_/l2/pluginStyle/pluginLessPseudo.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { getMessageKey } from '/_102029_/l2/collabLitElement.js';

/// **collab_i18n_start**
const message_pt = {
    description: 'Este plugin fornece informações detalhadas sobre pseudo-classes e pseudo-elementos do CSS, incluindo descrições claras e exemplos práticos. Ele é ideal para desenvolvedores que desejam melhorar sua compreensão de seletores CSS e otimizar seu fluxo de trabalho. Com uma interface intuitiva, o plugin ajuda a localizar e aplicar estilos de forma eficiente.',
    title1: 'Pseudo-classes',
    title2: 'Pseudo-elementos',
    hover: 'Aplica estilo quando o usuário passa o mouse sobre um elemento.',
    focus: 'Aplica estilo quando um elemento está em foco, como um campo de texto selecionado.',
    active: 'Aplica estilo a elementos ativados, como quando se clica em um botão.',
    firstChild: 'Aplica estilo ao primeiro filho de um elemento pai.',
    lastChild: 'Aplica estilo ao último filho de um elemento pai.',
    nthChild: 'Aplica estilo ao enésimo filho de um elemento pai.',
    nthOfType: 'Aplica estilo ao enésimo elemento do mesmo tipo (tag) dentro do pai.',
    firstOfType: 'Aplica estilo ao primeiro elemento do mesmo tipo no pai.',
    lastOfType: 'Aplica estilo ao último elemento do mesmo tipo no pai.',
    not: 'Aplica estilo a elementos que não correspondem ao seletor especificado.',
    checked: 'Aplica estilo a elementos marcados, como checkboxes e radio buttons.',
    disabled: 'Aplica estilo a elementos desativados.',
    enabled: 'Aplica estilo a elementos ativados.',
    empty: 'Aplica estilo a elementos que não têm filhos (nem texto nem outros elementos).',
    root: 'Aplica estilo ao elemento raiz do documento, geralmente <html>.',
    target: 'Aplica estilo ao elemento que é alvo de um link com hash (#).',
    before: 'Insere conteúdo antes do conteúdo principal de um elemento.',
    after: 'Insere conteúdo após o conteúdo principal de um elemento.',
    firstLine: 'Aplica estilo à primeira linha de texto de um elemento.',
    firstLetter: 'Aplica estilo à primeira letra de um elemento.',
    placeholder: 'Aplica estilo ao texto de placeholder em campos de entrada.',
    selection: 'Aplica estilo à parte do texto selecionada pelo usuário.',
    marker: 'Aplica estilo ao marcador de listas (<li>).',
};

const message_en = {
    description: "This plugin provides detailed information about CSS pseudo-classes and pseudo-elements, including clear descriptions and practical examples. It's perfect for developers looking to enhance their understanding of CSS selectors and streamline their workflow. With an intuitive interface, the plugin helps you quickly find and apply styles efficiently",
    title1: 'Pseudo-class',
    title2: 'Pseudo-elements',
    hover: 'Applies styles when the user hovers over an element.',
    focus: 'Applies styles when an element is focused, like a selected text field.',
    active: 'Applies styles to elements that are activated, such as when clicking a button.',
    firstChild: 'Applies styles to the first child of a parent element.',
    lastChild: 'Applies styles to the last child of a parent element.',
    nthChild: 'Applies styles to the nth child of a parent element.',
    nthOfType: 'Applies styles to the nth element of the same type (tag) within the parent.',
    firstOfType: 'Applies styles to the first element of the same type within the parent.',
    lastOfType: 'Applies styles to the last element of the same type within the parent.',
    not: 'Applies styles to elements that do not match the specified selector.',
    checked: 'Applies styles to checked elements, such as checkboxes and radio buttons.',
    disabled: 'Applies styles to disabled elements.',
    enabled: 'Applies styles to enabled elements.',
    empty: 'Applies styles to elements with no children (neither text nor other elements).',
    root: 'Applies styles to the root element of the document, usually <html>.',
    target: 'Applies styles to the element targeted by a hash link (#).',
    before: 'Inserts content before the main content of an element.',
    after: 'Inserts content after the main content of an element.',
    firstLine: 'Applies styles to the first line of text in an element.',
    firstLetter: 'Applies styles to the first letter of an element.',
    placeholder: 'Applies styles to placeholder text in input fields.',
    selection: 'Applies styles to the portion of text selected by the user.',
    marker: 'Applies styles to the marker of list items (<li>).',
};

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**


export const tags = ['pseudo:*'];

export function getDescription() {
    const lang = getMessageKey(messages);
    return messages[lang].description;
}

@customElement('plugin-style--plugin-less-pseudo-100555')
export class PluginLessPseudo extends StateLitElement {
    private msg: MessageType = messages['en'];

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
        <div>
            <h2>${this.msg.title1}</h2>
            <ul>    
                <li><b>:focus => </b> ${this.msg.focus}</li>
                <li><b>:active => </b> ${this.msg.active}</li>
                <li><b>:firstChild => </b> ${this.msg.firstChild}</li>
                <li><b>:lastChild => </b> ${this.msg.lastChild}</li>
                <li><b>:nthChild => </b> ${this.msg.nthChild}</li>
                <li><b>:nthOfType => </b> ${this.msg.nthOfType}</li>
                <li><b>:firstOfType => </b> ${this.msg.firstOfType}</li>
                <li><b>:lastOfType => </b> ${this.msg.lastOfType}</li>
                <li><b>:not => </b> ${this.msg.not}</li>
                <li><b>:checked => </b> ${this.msg.checked}</li>
                <li><b>:disabled => </b> ${this.msg.disabled}</li>
                <li><b>:enabled => </b> ${this.msg.enabled}</li>
                <li><b>:empty => </b> ${this.msg.empty}</li>
                <li><b>:root => </b> ${this.msg.root}</li>
                <li><b>:target => </b> ${this.msg.target}</li>
            </ul>

            <h2>${this.msg.title2}</h2>
            <ul>    
                <li><b>::before => </b> ${this.msg.before}</li>  
                <li><b>::after => </b> ${this.msg.after}</li>    
                <li><b>::firstLine => </b> ${this.msg.firstLine}</li>    
                <li><b>::firstLetter => </b> ${this.msg.firstLetter}</li>    
                <li><b>::placeholder => </b> ${this.msg.placeholder}</li>    
                <li><b>::selection => </b> ${this.msg.selection}</li>    
                <li><b>::marker => </b> ${this.msg.marker}</li>    

                
            </ul>¨
        </div>`;
    }

}