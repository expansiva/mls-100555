/// <mls fileReference="_100555_/l2/pluginSiteMonitorDashboard/pluginActiveUsers.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, css, svg, TemplateResult } from 'lit';
import { query, property, customElement } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';

export const pluginData: mls.plugin.IPluginData = {
    title: "Active Users",
    getSvg(): TemplateResult {
        return svg`
     <svg svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"/></svg>
    `;
    }
};

@customElement('plugin-site-monitor-dashboard--plugin-active-users-100555')
export class PluginActiveUsers extends PluginBaseModule {

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
                "boundaryGap": false,
                "data": ["12:00", "12:05", "12:10", "12:15", "12:20", "12:25", "12:30"]
            },
            "yAxis": {
                "type": "value",
                "name": "Number of Users"
            },
            "series": [
                {
                    "name": "Anonymous Users",
                    "type": "line",
                    "data": [120, 132, 101, 134, 90, 230, 210],
                    "markPoint": {
                        "data": [
                            { "type": "max", "name": "Max" },
                            { "type": "min", "name": "Min" }
                        ]
                    },
                    "markLine": {
                        "data": [{ "type": "average", "name": "Average" }]
                    }
                },
                {
                    "name": "Logged-In Users",
                    "type": "line",
                    "data": [220, 182, 191, 234, 290, 330, 310],
                    "markPoint": {
                        "data": [
                            { "type": "max", "name": "Max" },
                            { "type": "min", "name": "Min" }
                        ]
                    },
                    "markLine": {
                        "data": [{ "type": "average", "name": "Average" }]
                    }
                }
            ],
        };

        if (this.mode === 'full') {
            this.chartData.title = {
                text: "Active Users",
            };

            this.chartData.legend = {
                data: ["Anonymous Users", "Logged-In Users"]
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

        if (this.body) {
            this.body.innerHTML = `<widget-collab-chart-100554 renderer="svg" data="${escapeHTML(data)}"></widget-collab-chart-100554>`;
        }

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