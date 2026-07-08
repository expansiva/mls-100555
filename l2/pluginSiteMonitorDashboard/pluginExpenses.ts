/// <mls fileReference="_100555_/l2/pluginSiteMonitorDashboard/pluginExpenses.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, css, svg, TemplateResult } from 'lit';
import { query, property, customElement } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';

export const pluginData: mls.plugin.IPluginData = {
    title: "Expenses",
    getSvg(): TemplateResult {
        return svg`
     <svg svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 64zm64 320l-64 0 0-64c35.3 0 64 28.7 64 64zM64 192l0-64 64 0c0 35.3-28.7 64-64 64zM448 384c0-35.3 28.7-64 64-64l0 64-64 0zm64-192c-35.3 0-64-28.7-64-64l64 0 0 64zM288 160a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>
    `;
    }
};

@customElement('plugin-site-monitor-dashboard--plugin-expenses-100555')
export class PluginExpenses extends PluginBaseModule {

    @property({ type: String }) filter: string = "today";

    @property() chartData: any = {};

    @property({ type: Boolean }) autoPrepare: boolean = false;

    @property({ type: String }) mode: 'simplified' | 'full' = 'simplified';

    @query('.plugin-body') body: HTMLDivElement | undefined;

    async prepare() {

        await import('/_100554_/l2/widgetCollabChart.js');

        this.chartData = {
            tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b}: ${c} ({d}%)"
            },
            series: [
                {
                    name: "Expenses",
                    type: "pie",
                    radius: "50%",
                    data: [
                        { "value": 300, "name": "CDN" },
                        { "value": 250, "name": "EC2" },
                        { "value": 200, "name": "Database" },
                        { "value": 100, "name": "Domain" },
                        { "value": 70, "name": "Others" }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)"
                        }
                    }
                }
            ],
        };

        if (this.mode === 'full') {
            this.chartData.title = {
                text: "Expense Breakdown",
                subtext: "Total Expenses: $920",
                left: "center"
            };

            this.chartData.legend = {
                orient: "vertical",
                left: "left",
                data: ["CDN", "EC2", "Database", "Domain", "Others"]
            };
        }

        await this.updateComplete;
        const data = JSON.stringify(this.chartData);
        function escapeHTML(str: string) {
            return str
                .replace(/&/g, "&amp;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
        }

        if (this.body) this.body.innerHTML = `<widget-collab-chart-100554 renderer="svg" data="${escapeHTML(data)}"></widget-collab-chart-100554>`;

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
