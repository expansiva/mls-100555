/// <mls fileReference="_100555_/l2/pluginArchitecture/pluginQuestionArchitecture.ts" enhancement="_102027_/l2/enhancementLit" /> 

import { html, svg, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
import { loadAgent, executeBeforePrompt } from '/_102027_/l2/aiAgentOrchestration.js';
import { getTemporaryContext } from '/_102027_/l2/aiAgentHelper.js';
import { getThreadByName } from '/_102025_/l2/collabMessagesIndexedDB.js';
import {  getUserId, createThread } from '/_102025_/l2/collabMessagesHelper.js';

/// **collab_i18n_start**
const message_pt = {
    asktheArchitect: 'Perguntar ao Arquiteto',
    consulting: 'Consultando...',
    placeHolder: 'Pergunte algo sobre o sistema... Ex: onde se encontra ...?'
}

const message_en = {
    asktheArchitect: 'Ask the Architect',
    consulting: 'Consulting...',
    placeHolder: 'Ask something about the system... For example: where is... located?'

};

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'pt': message_pt,
    'en': message_en
}
/// **collab_i18n_end**

@customElement('plugin-architecture--plugin-question-architecture-100555')
export class PluginQuestionArchitecture extends PluginBaseModule {

    private msg: MessageType = messages['en'];
    @state() private question: string = '';
    @state() private loading = false;
    @state() private result?: AgentFileResult;
    @state() private error: string = '';

    async updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        const propMode = changedProperties.get('mode');
    }

    render(): TemplateResult {

        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`
        
        <div class="agent-box">
            ${this.renderHeader()}
            <div class="input-area">
                <textarea
                    placeholder="${this.msg.placeHolder}"
                    .value=${this.question}
                    @input=${(e: any) => this.question = e.target.value}
                ></textarea>

                <button @click=${this.askAgent} ?disabled=${this.loading}>
                    ${this.loading ? this.msg.consulting : this.msg.asktheArchitect}
                </button>
            </div>

            ${this.result ? html`
                <div class="result-area">
                    <h3>Arquivos encontrados</h3>
                    <ul>
                        ${this.result.files.map(f => html`
                            <li class="file-item" @click="${this.openFile}">
                                <div class="file-name">${f.file.replace('.defs', '')}</div>
                                <div class="file-desc">${f.description}</div>
                            </li>
                        `)}
                    </ul>
                </div>
            ` : ''} 
        </div>
        `;
    }

    renderHeader(): TemplateResult {
        return html`
            <header>
                <span class="svg-container">${pluginData.getSvg()}</span>
                <span>${pluginData.title}</span>
            </header>
        `;
    }

    //-------IMPLEMENTATION-------

    private async askAgent() {
        if (!this.question.trim()) return;

        this.loading = true;
        this.result = undefined;

        try {


            const json = await this._callAgent('_100554_/l2/agentArchitectMind.ts', this.question, '');
            if (!json) {
                this.result = undefined;
                return;
            }
            const obj = this.findFlexibleNodes(json);
            if (!obj || obj.length < 1 || !obj[0].result) throw new Error("Not found step flexible");
            this.result = obj[0].result;

        } catch (err) {
            console.error(err);
        }

        this.loading = false;
    }

    private async _callAgent(agentName: string, message: string, group: string): Promise<any> {

        let pageName = mls.actual[mls.actualLevel].getFullName();
        if (!pageName) pageName = agentName;

        let thread = await getThreadByName(pageName);
        if (!thread) {
            thread = await createThread(pageName, [], 'company');
        }

        if (!thread) return `Agent "${agentName}" error: Not found thread: ${pageName}`;

        const userId = getUserId();
        const threadId = thread.threadId;
        if (!userId) return `Agent "${agentName}" error: Not found userID`;
        let context;
        try {
            context = getTemporaryContext(threadId, userId, '@@' + agentName + ' ' + message);
        } catch (e: any) {
            this.error = `[pluginAgentPlayground] [getTemporaryContext] Agent "${agentName}" error: ${e.message}\n\n${JSON.stringify(context, null, 2)}`
        }

        try {
            const agent = await loadAgent(agentName);
            if (!agent) throw new Error('Not found agent:' + agentName);
            await executeBeforePrompt(agent, context as any);
            return context;
        } catch (e: any) {
            this.error = `[pluginAgentPlayground] Agent "${agentName}" error: ${e.message}\n\n${JSON.stringify(context, null, 2)}`
            return '';
        }
    }

    private findFlexibleNodes(obj: any): any[] {
        const results: any[] = [];

        function walk(node: any) {
            if (!node || typeof node !== 'object') return;

            // Se achou o flexible
            if (node.type === 'flexible') {
                results.push(node);
            }

            // Continua percorrendo tudo
            for (const key in node) {
                walk(node[key]);
            }
        }

        walk(obj);
        return results;
    }

    private openFile(e: MouseEvent) {
    
        const el = e.target as HTMLElement;
        if (!el) return;

        const li = el.closest('li');
        if (!li) return;

        const span = li.querySelector('.file-name') as HTMLElement;
        if (!span) return;

        const key = span.innerText;

        const f = mls.stor.files[key];
        if (!f) return;

        this.fireEvents('open', f);
    }

    async fireEvents(action: string, file: mls.stor.IFileInfo,  timeout: number = 0) {

        try {

            const params = {} as mls.events.IFileAction;

            await file.getOrCreateModel();

            (params.action as any) = action;
            params.level = file.level;
            params.project = file.project;
            params.shortName = file.shortName;
            params.extension = file.extension;
            params.folder = file.folder;
            params.position = 'left';

            if (['open'].includes(action)) {

                let name = `_${file.project}_${file.shortName}`;
                if (file.folder) name = `_${file.project}_${file.folder}/${file.shortName}`;
                mls.actual[2].setFullName(name);
                mls.actual[2]['left'] = file

            }

            mls.events.fire([mls.actualLevel], ['FileAction'], JSON.stringify(params), timeout);

        } catch (err: any) {

        }

    }

}

type AgentFileResult = {
    files: {
        file: string;
        description: string;
    }[];
};

export const pluginData: mls.plugin.IPluginData = {
    title: "Question architecture",
    getSvg(): TemplateResult {
        return svg`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M96 96C78.3 96 64 110.3 64 128C64 145.7 78.3 160 96 160L544 160C561.7 160 576 145.7 576 128C576 110.3 561.7 96 544 96L96 96zM96 480C78.3 480 64 494.3 64 512C64 529.7 78.3 544 96 544L224 544L224 416C224 363 267 320 320 320C373 320 416 363 416 416L416 544L544 544C561.7 544 576 529.7 576 512C576 494.3 561.7 480 544 480L544 208L96 208L96 480z"/></svg>
    `;
    }
};
