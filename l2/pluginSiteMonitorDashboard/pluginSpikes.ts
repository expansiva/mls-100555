/// <mls fileReference="_100555_/l2/pluginSiteMonitorDashboard/pluginSpikes.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, css, svg, TemplateResult } from 'lit';
import { query, property, customElement } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/plugins/pluginBaseModule.js';

export const pluginData: mls.plugin.IPluginData = {
    title: "Spikes",
    getSvg(): TemplateResult {
        return svg`
     <svg svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 116.8c0-15.8 20.5-22 29.3-8.9L192 256l0-139.2c0-15.8 20.5-22 29.3-8.9L320 256l0-139.2c0-15.8 20.5-22 29.3-8.9L448 256l0-139.2c0-15.8 20.5-22 29.3-8.9L606.8 302.2c14.2 21.3-1.1 49.7-26.6 49.7L512 352l-64 0-64 0-64 0-64 0-64 0L64 352l0-235.2zM32 384l576 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/></svg>
    `;
    }
};

@customElement('plugin-site-monitor-dashboard--plugin-spikes-100555')
export class PluginSpikes extends PluginBaseModule {

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
            "legend": {
                "data": ["Number of Requests"]
            },
            "xAxis": {
                "type": "category",
                "boundaryGap": false,
                "data": ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
            },
            "yAxis": {
                "type": "value",
                "name": "Number of Requests"
            },
            "series": [
                {
                    "name": "Number of Requests",
                    "type": "line",
                    "data": [50, 45, 60, 80, 120, 140, 200, 300, 250, 230, 210, 180, 170, 150, 130, 100, 90, 160, 220, 260, 300, 320, 340, 280],
                    "markPoint": {
                        "data": [
                            { "type": "max", "name": "Max Traffic" },
                            { "type": "min", "name": "Min Traffic" }
                        ]
                    },
                    "markLine": {
                        "data": [
                            { "type": "average", "name": "Average Traffic" }
                        ]
                    },
                    "smooth": true,
                    "lineStyle": {
                        "width": 2
                    }
                }
            ],
        };

        if (this.mode === 'full') {
            this.chartData.title = {
                text: "Hourly Traffic Spikes"
            }
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
