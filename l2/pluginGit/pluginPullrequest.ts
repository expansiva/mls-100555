/// <mls fileReference="_100555_/l2/pluginGit/pluginPullrequest.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property, state } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
import { listGitProjects, getGitDriver, getGitRepoKeys } from '/_102029_/l2/libGitProject.js';

/// **collab_i18n_start**
const message_pt = {
    openPullrequest: 'Pull requests abertos',
    noItens: 'Nenhum pull request aberto',
    noItensHint: 'Os pull requests criados pelo Save aparecem aqui.',
    loading: 'Carregando pull requests...',
    refresh: 'Atualizar',
    openOnGit: 'Abrir no repositório',
    today: 'hoje',
    yesterday: 'ontem',
    daysAgo: 'há [n] dias',
};

const message_en = {
    openPullrequest: 'Open pull requests',
    noItens: 'No open pull requests',
    noItensHint: 'Pull requests created by Save show up here.',
    loading: 'Loading pull requests...',
    refresh: 'Refresh',
    openOnGit: 'Open in repository',
    today: 'today',
    yesterday: 'yesterday',
    daysAgo: '[n] days ago',
};

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

interface IProjectPullRequests {
    project: number;
    repo: string;
    itens: mls.stor.others.IPullRequest[];
    error: string;
}

const ICON_PR = html`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="18" r="2.2"/><path d="M6 8.2v7.6"/><path d="M18 15.8V9a3 3 0 0 0-3-3h-4"/><path d="M13 3.5L10.5 6 13 8.5"/></svg>`;
const ICON_REFRESH = html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></svg>`;
const ICON_EXTERNAL = html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>`;
const ICON_REPO = html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3"/></svg>`;

@customElement('plugin-git--plugin-pullrequest-100555')
export class PluginPullrequest extends PluginBaseModule {

    private msg = messages['en'];
    //Pull requests abertos de cada projeto GitHub/GitLab.
    @state() private projects: IProjectPullRequests[] = [];
    @state() private loading = false;
    private errorTimer = 0;

    @property() error: string = '';
    @property() autoPrepare: boolean = false;

    //-----COMPONENT---------
    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        if (!this.autoPrepare)
            return;
        this.prepare();
    }

    updated(changed: Map<string | number | symbol, unknown>) {
        if (changed.has('error') && this.error) {
            clearTimeout(this.errorTimer);
            this.errorTimer = window.setTimeout(() => this.error = '', 9900);
        }
    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        const shown = this.projects.filter((p) => p.itens.length > 0 || p.error);
        const total = shown.reduce((n, p) => n + p.itens.length, 0);
        return html`
            <div class="pr">
                ${this.renderHeader(total)}
                ${this.error ? html`<div class="pr-error" role="alert">${this.error}</div>` : ''}
                ${this.loading ? this.renderLoading()
                : shown.length <= 0 ? this.renderNoItens()
                    : repeat(shown, (p) => p.project, (p) => this.renderProject(p))}
            </div>
        `;
    }

    renderHeader(total: number) {
        return html`
            <div class="pr-header">
                <span class="pr-header-icon">${ICON_PR}</span>
                <span class="pr-title">${this.msg.openPullrequest}</span>
                ${!this.loading && total ? html`<span class="pr-badge">${total}</span>` : ''}
                <button class="pr-icon-btn" title="${this.msg.refresh}" ?disabled=${this.loading} @click=${() => this.loadListPullRequest()}>
                    <span class="${this.loading ? 'spin' : ''}">${ICON_REFRESH}</span>
                </button>
            </div>
        `;
    }

    renderLoading() {
        return html`
            <div class="pr-loading" aria-label="${this.msg.loading}">
                ${[0, 1, 2].map(() => html`<div class="pr-skeleton"><span></span><span></span></div>`)}
            </div>
        `;
    }

    renderNoItens() {
        return html`
            <div class="pr-empty">
                <div class="pr-empty-title">${this.msg.noItens}</div>
                <div class="pr-empty-hint">${this.msg.noItensHint}</div>
            </div>
        `;
    }

    renderProject(p: IProjectPullRequests) {
        return html`
            <section class="pr-project">
                <div class="pr-project-head">
                    ${ICON_REPO}
                    <span class="pr-project-name" title="${p.repo}">${p.repo || p.project}</span>
                    ${p.repo ? html`<span class="pr-project-num">${p.project}</span>` : ''}
                    ${p.itens.length ? html`<span class="pr-badge">${p.itens.length}</span>` : ''}
                </div>
                ${p.error ? html`<div class="pr-error">${p.error}</div>` : this.renderListPull(p.itens)}
            </section>
        `;
    }

    renderListPull(itens: mls.stor.others.IPullRequest[]) {
        const sorted = [...itens].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        return html`
            <ul class="pr-list">
                ${repeat(sorted, (k) => k.id, (k) => this.renderItemListPull(k))}
            </ul>
        `;
    }

    renderItemListPull(i: mls.stor.others.IPullRequest) {
        const login = i.author?.login || '';
        return html`
            <li>
                <a class="pr-item" href="${i.url}" target="_blank" rel="noopener" title="${this.msg.openOnGit}">
                    <span class="pr-item-icon">${ICON_PR}</span>
                    <span class="pr-item-text">
                        <span class="pr-item-title">${i.title}</span>
                        <span class="pr-item-meta">
                            ${login ? html`<span class="pr-avatar">${login.charAt(0).toUpperCase()}</span>${login}` : ''}
                            ${i.createdAt ? html`<span class="pr-dot">·</span><span title="${new Date(i.createdAt).toLocaleString()}">${this.relativeDate(i.createdAt)}</span>` : ''}
                        </span>
                    </span>
                    <span class="pr-item-ext">${ICON_EXTERNAL}</span>
                </a>
            </li>`;
    }

    private relativeDate(iso: string): string {
        const d = new Date(iso);
        if (isNaN(d.getTime())) return '';
        const days = Math.floor((Date.now() - d.getTime()) / 86400000);
        if (days <= 0) return this.msg.today;
        if (days === 1) return this.msg.yesterday;
        if (days < 30) return this.msg.daysAgo.replace('[n]', String(days));
        return d.toLocaleDateString();
    }

    //------IMPLEMENTS--------
    async prepare() {
        this.loadListPullRequest();
    }

    async loadListPullRequest() {
        this.loading = true;
        try {
            this.projects = await Promise.all(listGitProjects().map((prj) => this.loadProject(prj)));
        }
        catch (err: any) {
            this.error = err.message;
        }
        this.loading = false;
    }

    //Erro de um projeto fica no grupo dele e não esconde os outros.
    private async loadProject(project: number): Promise<IProjectPullRequests> {
        const ret: IProjectPullRequests = { project, repo: '', itens: [], error: '' };
        try {
            const keys = await getGitRepoKeys(project);
            ret.repo = `${keys.owner}/${keys.repo}`;
            const driver = await getGitDriver(project);
            ret.itens = await driver.listPullRequests(keys.owner, keys.repo);
        }
        catch (err: any) {
            ret.error = err.message;
        }
        return ret;
    }

}
