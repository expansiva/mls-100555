/// <mls fileReference="_100555_/l2/pluginSiteMonitorDashboard/pluginResponseTime.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, css, svg, TemplateResult } from 'lit';
import { query, property, customElement } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';

export const pluginData: mls.plugin.IPluginData = {
    title: "Response Time",
    getSvg(): TemplateResult {
        return svg`
     <svg svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>
    `;
    }
};

@customElement('plugin-site-monitor-dashboard--plugin-response-time-100555')
export class PluginResponseTime extends PluginBaseModule {

    @property({ type: String }) filter: string = "today";

    @property() chartData: any = {};

    @property({ type: Boolean }) autoPrepare: boolean = false;

    @property({ type: String }) mode: 'simplified' | 'full' = 'simplified';

    @query('.plugin-body') body: HTMLDivElement | undefined;

    async prepare() {

        await import('/_100554_/l2/widgetCollabChart.js');

        this.chartData = {
            "tooltip": {
                "trigger": "axis"
            },
            "xAxis": {
                "type": "category",
                "data": ["2024-09-01", "2024-09-02", "2024-09-03", "2024-09-04", "2024-09-05", "2024-09-06"]
            },
            "yAxis": {
                "type": "value",
                "name": "Response Time (ms)",
                "axisLabel": {
                    "formatter": "{value} ms"
                }
            },
            "series": [
                {
                    "name": "Response Time",
                    "type": "line",
                    "data": [120, 200, 150, 80, 70, 110],
                    "markPoint": {
                        "data": [
                            { "type": "max", "name": "Max" },
                            { "type": "min", "name": "Min" }
                        ]
                    },
                    "markLine": {
                        "data": [{ "type": "average", "name": "Average" }]
                    },
                    "smooth": true
                }
            ],
            "grid": {
                "left": "3%",
                "right": "4%",
                "bottom": "3%",
                "containLabel": true
            }
        };

        if (this.mode === 'full') {
            this.chartData.title = {
                text: "Average Response Time Over Time",
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

    firstUpdated() {
        if (!this.body || !this.autoPrepare) return;
        this.prepare();
    }

    createRenderRoot() {
        return this;
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
