/// <mls fileReference="_100555_/l2/pluginSiteMonitorDashboard/pluginSiteMonitorDashboardErrors.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, css, svg, TemplateResult } from 'lit';
import { query, property } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/plugins/pluginBaseModule.js';

export const pluginData: mls.plugin.IPluginData = {
    title: "Errors",
    getSvg(): TemplateResult {
        return svg`
     <svg svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>
    `;
    }
};

export class PluginSiteMonitorDashboardErrors extends PluginBaseModule {

    @property({ type: String }) filter: string = "today";

    @property() chartData = {};

    @property({ type: Boolean }) autoPrepare: boolean = false;

    @query('.plugin-body') body: HTMLDivElement | undefined;

    async prepare() {

        await import('/_100554_/l2/widgetCollabChart.js');

        const dataByFilter: any = {
            today: [
                ['400', 3],
                ['401', 3],
                ['402', 0],
                ['403', 2],
                ['404', 3],
                ['405', 8],
                ['409', 3],
            ],
            week: [
                ['400', 14],
                ['401', 13],
                ['402', 16],
                ['403', 12],
                ['404', 13],
                ['405', 13],
                ['409', 13],
            ],
            mounth: [
                ['400', 43],
                ['401', 83],
                ['402', 86],
                ['403', 72],
                ['404', 43],
                ['405', 83],
                ['409', 43],
            ],
            all: [
                ['400', 143],
                ['401', 183],
                ['402', 186],
                ['403', 172],
                ['404', 143],
                ['405', 183],
                ['409', 143],
            ],
        }
        this.chartData = {

            legend: {},
            tooltip: {},
            dataset: {
                source: dataByFilter[this.filter || 'today']
            },
            xAxis: { type: 'category' },
            yAxis: {},
            series: [{
                type: 'bar',
                itemStyle: {
                    color: (p: any) => {
                        const colorList = ["#f68a55"];
                        return colorList[p.dataIndex];
                    }
                }
            }],
        }
        await this.updateComplete;
        if (this.body) this.body.innerHTML = `<widget-collab-chart-100554 renderer="svg" data=${JSON.stringify(this.chartData)}></widget-collab-chart-100554>`;

    }

    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        if (!this.body || !this.autoPrepare) return;
        this.prepare();
    }

    render(): TemplateResult {
        this.style.display = 'block';
        this.style.width = '100%';
        this.style.height = '100%';
        if (this.scope !== "dashboard") return html``;
        return html`
            <div class="plugin-container">
                ${this.renderHeader()}
                ${this.renderBody()}
            </div>
        `;
    }

    renderHeader(): TemplateResult {
        return html`
            <header>
                <div>
                    <div>${pluginData.getSvg()}</div>
                    <h2>${pluginData.title}</h2>
                </div>
                <select @change=${this.handleChange}>
                    <option value="today">Today</option>
                    <option value="week">Week</option>
                    <option value="mounth">Last 30 days</option>
                    <option value="all">All Time</option>
                </select>
            </header>
        `;
    }

    renderBody(): TemplateResult {
        return html`<div class="plugin-body"></div>`;
    }

    handleChange(e: MouseEvent) {
        const target = e.target as HTMLSelectElement;
        const value = target.value;
        this.filter = value;
        this.prepare();
    }

}

if (!customElements.get('plugin-site-monitor-dashboard-errors-100555')) {
    customElements.define('plugin-site-monitor-dashboard-errors-100555', PluginSiteMonitorDashboardErrors);
}
