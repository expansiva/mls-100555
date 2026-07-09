/// <mls fileReference="_100555_/l2/pluginGit/pluginPullrequest.ts" enhancement="_102027_/l2/enhancementLit" />

import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
import { getMyKeysBranch } from '/_102027_/l2/libCommom.js';

/// **collab_i18n_start**
const message_pt = {
    openPullrequest: 'Pull request Abertos',
    noItens: "Nenhum pull request aberto",
};

const message_en = {
    openPullrequest: 'Open pull requests',
    noItens: 'No open pull requests',
};

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('plugin-git--plugin-pullrequest-100555')
export class PluginPullrequest extends PluginBaseModule {

    private msg = messages['en'];
    private itens: mls.stor.others.IPullRequest[] = [];
    private owner = '';
    private repo = '';
    private branch = '';

    @property() error: string = '';
    @property() autoPrepare: boolean = false;

    //-----COMPONENT---------
    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        this.initInfoProject();
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
        if (this.itens.length <= 0)
            return this.renderNoItens();
        return this.renderListPull();
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

    renderListPull() {
        return html`
            ${this.renderHeader()}
            <ul style="list-style: decimal;">
                ${repeat(this.itens, (
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

        try {
            const prj = mls.actualProject;
            if (prj === mls.stor.LOCALPROJECTNUMBER) return;
            if (!prj)
                throw new Error('Not found project actual');
            const driver = mls.stor.others.getDefaultDriver(prj);
            //this.showLoader(true);
            const ret = await driver.listPullRequests(this.owner, this.repo);
            this.itens = ret;
            this.requestUpdate();
            //this.showLoader(false);
        }
        catch (err: any) {
            this.error = err.message;
            this.requestUpdate();
            //this.showLoader(false);
        }
    }

    async initInfoProject() {
        const prj = mls.actualProject;
        if (!prj || prj === mls.stor.LOCALPROJECTNUMBER)
            return;
        const info = getMyKeysBranch(prj);
        if (!info)
            return;
        this.branch = info.branch;
        this.owner = info.owner;
        this.repo = info.repo;
    }

}
