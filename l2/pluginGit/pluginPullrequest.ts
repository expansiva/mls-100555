/// <mls fileReference="_100555_/l2/pluginGit/pluginPullrequest.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
import { listGitProjects, getGitDriver, getGitRepoKeys } from '/_102029_/l2/libGitProject.js';

/// **collab_i18n_start**
const message_pt = {
    openPullrequest: 'Pull request Abertos',
    noItens: "Nenhum pull request aberto",
    loading: 'Carregando pull requests...',
};

const message_en = {
    openPullrequest: 'Open pull requests',
    noItens: 'No open pull requests',
    loading: 'Loading pull requests...',
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

@customElement('plugin-git--plugin-pullrequest-100555')
export class PluginPullrequest extends PluginBaseModule {

    private msg = messages['en'];
    //Pull requests abertos de cada projeto GitHub/GitLab.
    private projects: IProjectPullRequests[] = [];
    private loading = false;

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

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        if (this.error !== '') {
            setTimeout(() => this.error = '', 9900);
            return html`
                ${this.renderHeader()}
                <h4 style="color:red">${this.error}</h4>
            `;
        }
        if (this.loading)
            return html`
                ${this.renderHeader()}
                <h4>${this.msg.loading}</h4>
            `;
        const shown = this.projects.filter((p) => p.itens.length > 0 || p.error);
        if (shown.length <= 0)
            return this.renderNoItens();
        return html`
            ${this.renderHeader()}
            ${repeat(shown, ((p: IProjectPullRequests) => p.project) as any, ((p: IProjectPullRequests) => this.renderProject(p)) as any)}
        `;
    }

    renderHeader() {
        return html`
            <h3>${this.msg.openPullrequest}</h3>
        `;
    }

    renderNoItens() {
        return html`
            ${this.renderHeader()}
            <h4>${this.msg.noItens}</h4>
        `;
    }

    renderProject(p: IProjectPullRequests) {
        return html`
            <h4>${p.project}${p.repo ? ` (${p.repo})` : ''}</h4>
            ${p.error ? html`<p style="color:red">${p.error}</p>` : this.renderListPull(p.itens)}
        `;
    }

    renderListPull(itens: mls.stor.others.IPullRequest[]) {
        return html`
            <ul style="list-style: decimal;">
                ${repeat(itens, (
            (key: mls.stor.others.IPullRequest) => key.id) as any,
            ((k: mls.stor.others.IPullRequest, index: number) => { return this.renderItemListPull(k, index); }) as any)}
            </ul>
        `;
    }

    renderItemListPull(i: mls.stor.others.IPullRequest, index: number) {
        return html`
        <li>
            <a href="${i.url}" style="text-decoration: underline; cursor: pointer;" target="_blank">${i.title} (${i.author.login})</a>
        </li>`;
    }

    //------IMPLEMENTS--------
    async prepare() {
        this.loadListPullRequest();
    }

    async loadListPullRequest() {
        this.loading = true;
        this.requestUpdate();
        try {
            this.projects = await Promise.all(listGitProjects().map((prj) => this.loadProject(prj)));
        }
        catch (err: any) {
            this.error = err.message;
        }
        this.loading = false;
        this.requestUpdate();
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
