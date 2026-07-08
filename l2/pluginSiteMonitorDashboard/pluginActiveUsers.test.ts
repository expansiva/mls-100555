/// <mls fileReference="_100555_/l2/pluginSiteMonitorDashboard/pluginActiveUsers.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, comparar, query, montarEVerificar } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData, PluginActiveUsers } from '/_100555_/l2/pluginSiteMonitorDashboard/pluginActiveUsers.js';

const TAG = 'plugin-site-monitor-dashboard--plugin-active-users-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: precisam de DOM/customElements reais ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registrado: true, renderizou: true } },
    ]},

    { functionName: 'testPrepare', env: 'browser', params: [
        { input: { mode: 'full' },
          expected: { temTitulo: true, temLegenda: true, corpoTemWidget: true } },
        { input: { mode: 'simplified' },
          expected: { temTitulo: false, temLegenda: false, corpoTemWidget: true } },
    ]},

    { functionName: 'testHandleChange', env: 'browser', params: [
        { input: { valorSelecionado: 'week' }, expected: { filter: 'week' } },
        { input: { valorSelecionado: 'all' }, expected: { filter: 'all' } },
    ]},

    { functionName: 'testRenderRespeitaScope', env: 'browser', params: [
        { input: { scope: 'dashboard' }, expected: { renderizouContainer: true } },
        { input: { scope: 'detail' }, expected: { renderizouContainer: false } },
    ]},

    // ---- vscode: lógica pura, não toca em DOM ----
    // Atenção: pluginActiveUsers.ts registra o customElement no escopo do módulo (@customElement),
    // então importar este arquivo fora do browser exige um stub de `customElements` no runner de vscode.
    // A asserção em si (pluginData.title/getSvg) não usa DOM nenhum.

    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'Active Users', svgContemTagSvg: true } },
    ]},
];

export async function testSmoke(caso: { expected: any }): Promise<string> {
    try {
        const resultado = await montarEVerificar(TAG, { scope: 'dashboard' });
        comparar(resultado, caso.expected);
        return JSON.stringify(resultado);
    } finally {
        cleanup();
    }
}

export async function testPrepare(caso: { input: { mode: 'simplified' | 'full' }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginActiveUsers>(TAG, { scope: 'dashboard', mode: caso.input.mode });
        await el.prepare();
        const resultado = {
            temTitulo: !!el.chartData.title,
            temLegenda: !!el.chartData.legend,
            corpoTemWidget: !!query(el, 'widget-collab-chart-100554'),
        };
        comparar(resultado, caso.expected);
        return JSON.stringify(resultado);
    } finally {
        cleanup();
    }
}

export async function testHandleChange(caso: { input: { valorSelecionado: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginActiveUsers>(TAG, { scope: 'dashboard' });
        el.handleChange({ target: { value: caso.input.valorSelecionado } } as unknown as MouseEvent);
        const resultado = { filter: el.filter };
        comparar(resultado, caso.expected);
        return JSON.stringify(resultado);
    } finally {
        cleanup();
    }
}

export async function testRenderRespeitaScope(caso: { input: { scope: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginActiveUsers>(TAG, { scope: caso.input.scope as any });
        const resultado = { renderizouContainer: !!query(el, '.plugin-container') };
        comparar(resultado, caso.expected);
        return JSON.stringify(resultado);
    } finally {
        cleanup();
    }
}

export async function testPluginData(caso: { expected: any }): Promise<string> {
    const svg = pluginData.getSvg() as any;
    const svgTexto = Array.isArray(svg?.strings) ? svg.strings.join('') : String(svg);
    const resultado = {
        title: pluginData.title,
        svgContemTagSvg: svgTexto.includes('<svg'),
    };
    comparar(resultado, caso.expected);
    return JSON.stringify(resultado);
}
