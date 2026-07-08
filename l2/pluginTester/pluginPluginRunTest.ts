/// <mls fileReference="_100555_/l2/pluginTester/pluginPluginRunTest.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, TemplateResult } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
import { ordenarPorAmbiente, IPluginTestCase } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { collab_fileTest } from '/_100554_/l2/collabIcons.js';

/// **collab_i18n_start**
const message_pt = {
    title: 'Executar testes de plugins',
    info: 'Procura todos os arquivos plugin*.test.ts do projeto atual e executa os testes declarados, mostrando o resultado no console.',
    run: 'Executar',
    running: 'Executando...',
    noProject: 'Nenhum projeto aberto.',
    summary: (arquivos: number, passou: number, falhou: number, semTestes: number) =>
        `${arquivos} arquivo(s) — ${passou} passou, ${falhou} falhou, ${semTestes} sem testes`,
};

const message_en = {
    title: 'Run plugin tests',
    info: 'Finds every plugin*.test.ts file in the current project and runs its declared tests, logging the result to the console.',
    run: 'Run',
    running: 'Running...',
    noProject: 'No project open.',
    summary: (arquivos: number, passou: number, falhou: number, semTestes: number) =>
        `${arquivos} file(s) — ${passou} passed, ${falhou} failed, ${semTestes} without tests`,
};

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const pluginData: mls.plugin.IPluginData = {
    title: "Plugin Run Test",
    getSvg(): TemplateResult {
        return collab_fileTest;
    }
};

interface IResultadoCaso {
    functionName: string;
    env: string;
    indice: number;
    status: 'pass' | 'fail';
    mensagem: string;
}

interface IResultadoArquivo {
    arquivo: string;
    status: 'ok' | 'erro-import' | 'sem-testes';
    erro?: string;
    casos: IResultadoCaso[];
}

@customElement('plugin-tester--plugin-plugin-run-test-100555')
export class PluginPluginRunTest extends PluginBaseModule {

    private msg: MessageType = messages['en'];

    @property({ type: Boolean }) rodando = false;
    @property({ type: Number }) totalArquivos = 0;
    @property({ type: Number }) totalPassou = 0;
    @property({ type: Number }) totalFalhou = 0;
    @property({ type: Number }) totalSemTestes = 0;
    @property({ type: Boolean }) jaRodou = false;

    createRenderRoot() {
        return this;
    }

    render(): TemplateResult {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            <div class="plugin-container">
                <header>
                    <div>${pluginData.getSvg()}</div>
                    <h2>${pluginData.title}</h2>
                </header>
                <small>${this.msg.info}</small>
                <div class="actions">
                    <button ?disabled=${this.rodando} @click=${this.runAll}>
                        ${this.rodando ? this.msg.running : this.msg.run}
                    </button>
                </div>
                ${this.jaRodou ? html`
                    <small class="summary">
                        ${this.msg.summary(this.totalArquivos, this.totalPassou, this.totalFalhou, this.totalSemTestes)}
                    </small>
                ` : ''}
            </div>
        `;
    }

    async runAll() {
        if (this.rodando) return;
        this.rodando = true;

        const project = mls.actualProject;
        if (!project) {
            console.error(`[pluginPluginRunTest] ${this.msg.noProject}`);
            this.rodando = false;
            return;
        }

        const arquivos = this.buscarArquivosDeTeste(project);

        console.group(`%c[pluginPluginRunTest] ${arquivos.length} arquivo(s) plugin*.test.ts encontrados no projeto ${project}`, 'font-weight:bold');

        const resultados: IResultadoArquivo[] = [];
        for (const arquivo of arquivos) {
            const resultado = await this.executarArquivo(arquivo);
            resultados.push(resultado);
            this.logResultadoArquivo(resultado);
        }

        this.totalArquivos = resultados.length;
        this.totalPassou = resultados.reduce((acc, r) => acc + r.casos.filter(c => c.status === 'pass').length, 0);
        this.totalFalhou = resultados.reduce((acc, r) => acc + r.casos.filter(c => c.status === 'fail').length, 0);
        this.totalSemTestes = resultados.filter(r => r.status === 'sem-testes').length;
        this.jaRodou = true;

        const cor = this.totalFalhou > 0 ? 'color:#c0392b;font-weight:bold' : 'color:#27ae60;font-weight:bold';
        console.info(`%c[pluginPluginRunTest] ${this.msg.summary(this.totalArquivos, this.totalPassou, this.totalFalhou, this.totalSemTestes)}`, cor);
        console.groupEnd();

        this.rodando = false;
    }

    private buscarArquivosDeTeste(project: number): mls.stor.IFileInfo[] {
        return Object.keys(mls.stor.files)
            .map((key) => mls.stor.files[key])
            .filter((file) => file && file.project === project && file.extension === '.test.ts' && file.shortName.startsWith('plugin'));
    }

    private async executarArquivo(file: mls.stor.IFileInfo): Promise<IResultadoArquivo> {
        const nomeArquivo = file.folder ? `${file.folder}/${file.shortName}.test.ts` : `${file.shortName}.test.ts`;

        const suffix = `.test.js?cacheBuster=${Date.now()}`;
        const caminho = file.folder
            ? `/_${file.project}_/l2/${file.folder}_${file.shortName}${suffix}`
            : `/_${file.project}_/l2/${file.shortName}${suffix}`;

        let module: any;
        try {
            module = await import(caminho);
        } catch (err: any) {
            return { arquivo: nomeArquivo, status: 'erro-import', erro: err?.message ?? String(err), casos: [] };
        }

        const declarados: IPluginTestCase[] = Array.isArray(module.tests)
            ? module.tests.map((t: any) => ({ env: 'browser', ...t }))
            : [];

        if (declarados.length === 0) {
            return { arquivo: nomeArquivo, status: 'sem-testes', casos: [] };
        }

        const ordenados = ordenarPorAmbiente(declarados);
        const casos: IResultadoCaso[] = [];

        for (const teste of ordenados) {
            const fn = module[teste.functionName];

            if (typeof fn !== 'function') {
                casos.push({
                    functionName: teste.functionName,
                    env: teste.env,
                    indice: -1,
                    status: 'fail',
                    mensagem: `Função '${teste.functionName}' não exportada pelo módulo.`,
                });
                continue;
            }

            const params = Array.isArray(teste.params) && teste.params.length > 0 ? teste.params : [{}];

            for (let i = 0; i < params.length; i++) {
                try {
                    const resultado = await fn(params[i]);
                    casos.push({
                        functionName: teste.functionName,
                        env: teste.env,
                        indice: i,
                        status: 'pass',
                        mensagem: typeof resultado === 'string' ? resultado : JSON.stringify(resultado),
                    });
                } catch (err: any) {
                    casos.push({
                        functionName: teste.functionName,
                        env: teste.env,
                        indice: i,
                        status: 'fail',
                        mensagem: err?.message ?? String(err),
                    });
                }
            }
        }

        return { arquivo: nomeArquivo, status: 'ok', casos };
    }

    private logResultadoArquivo(resultado: IResultadoArquivo) {
        if (resultado.status === 'erro-import') {
            console.error(`✗ ${resultado.arquivo} — falha ao importar: ${resultado.erro}`);
            return;
        }

        if (resultado.status === 'sem-testes') {
            console.info(`… ${resultado.arquivo} — nenhum teste declarado`);
            return;
        }

        const passou = resultado.casos.filter(c => c.status === 'pass').length;
        const falhou = resultado.casos.filter(c => c.status === 'fail').length;
        const cor = falhou > 0 ? 'color:#c0392b' : 'color:#27ae60';

        console.groupCollapsed(`%c${falhou > 0 ? '✗' : '✓'} ${resultado.arquivo} — ${passou} passou, ${falhou} falhou`, cor);
        console.table(resultado.casos.map((c) => ({
            teste: c.functionName,
            caso: c.indice,
            env: c.env,
            status: c.status,
            detalhe: c.mensagem,
        })));
        console.groupEnd();
    }

}
