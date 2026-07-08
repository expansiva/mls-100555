/// <mls fileReference="_100555_/l2/pluginTester/pluginPluginRunTest.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, svg, TemplateResult } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
import { sortByEnvironment, IPluginTestCase } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { collabImport } from '/_102027_/l2/collabImport.js';
import { collab_fileTest } from '/_100554_/l2/collabIcons.js';

/// **collab_i18n_start**
const message_pt = {
    title: 'Executar testes de plugins',
    info: 'Clique em executar para procurar e rodar os testes de todos os arquivos plugin*.test.ts do projeto atual.',
    run: 'Executar testes',
    running: 'Executando...',
    noProject: 'Nenhum projeto aberto.',
    noTests: 'nenhum teste declarado',
    importError: 'falha ao importar',
    caseSummary: (passed: number, failed: number) => `${passed} passou, ${failed} falhou`,
    summary: (files: number, passed: number, failed: number, noTests: number) =>
        `${files} arquivo(s) — ${passed} passou, ${failed} falhou, ${noTests} sem testes`,
};

const message_en = {
    title: 'Run plugin tests',
    info: 'Click run to find and execute the tests declared in every plugin*.test.ts file in the current project.',
    run: 'Run tests',
    running: 'Running...',
    noProject: 'No project open.',
    noTests: 'no tests declared',
    importError: 'failed to import',
    caseSummary: (passed: number, failed: number) => `${passed} passed, ${failed} failed`,
    summary: (files: number, passed: number, failed: number, noTests: number) =>
        `${files} file(s) — ${passed} passed, ${failed} failed, ${noTests} without tests`,
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

interface ITestCaseResult {
    functionName: string;
    env: string;
    index: number;
    status: 'pass' | 'fail';
    message: string;
}

interface ITestFileResult {
    file: string;
    status: 'ok' | 'import-error' | 'no-tests';
    error?: string;
    cases: ITestCaseResult[];
}

@customElement('plugin-tester--plugin-plugin-run-test-100555')
export class PluginPluginRunTest extends PluginBaseModule {

    private msg: MessageType = messages['en'];

    @property({ type: Boolean }) running = false;
    @property({ type: Boolean }) hasRun = false;
    @property({ type: Number }) totalFiles = 0;
    @property({ type: Number }) totalPassed = 0;
    @property({ type: Number }) totalFailed = 0;
    @property({ type: Number }) totalNoTests = 0;
    @property({ attribute: false }) results: ITestFileResult[] = [];

    createRenderRoot() {
        return this;
    }

    render(): TemplateResult {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`
            <div class="plugin-container">
                <header>
                    <div class="title-group">
                        <span class="icon">${pluginData.getSvg()}</span>
                        <h2>${pluginData.title}</h2>
                    </div>
                    <button
                        class="play-button ${this.running ? 'running' : ''}"
                        ?disabled=${this.running}
                        @click=${this.runAll}
                        title=${this.running ? this.msg.running : this.msg.run}
                        aria-label=${this.running ? this.msg.running : this.msg.run}
                    >
                        ${this.running ? this.renderSpinnerIcon() : this.renderPlayIcon()}
                    </button>
                </header>

                <div class="terminal">
                    ${!this.hasRun && this.results.length === 0
                        ? html`<div class="terminal-placeholder">${this.msg.info}</div>`
                        : ''}
                    ${this.results.map((result) => this.renderFileResult(result))}
                    ${this.hasRun ? html`
                        <div class="terminal-summary ${this.totalFailed > 0 ? 'fail' : 'pass'}">
                            ${this.msg.summary(this.totalFiles, this.totalPassed, this.totalFailed, this.totalNoTests)}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    private renderPlayIcon(): TemplateResult {
        return svg`<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    }

    private renderSpinnerIcon(): TemplateResult {
        return svg`
            <svg viewBox="0 0 24 24" width="16" height="16" class="spinner">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="40 100"/>
            </svg>
        `;
    }

    private renderFileResult(result: ITestFileResult): TemplateResult {
        if (result.status === 'import-error') {
            return html`
                <details class="file-result fail" open>
                    <summary>
                        <span class="status-icon">✗</span>
                        <span class="file-name">${result.file}</span>
                        <span class="file-meta">${this.msg.importError}</span>
                    </summary>
                    <div class="case-list">
                        <div class="case-error">${result.error}</div>
                    </div>
                </details>
            `;
        }

        if (result.status === 'no-tests') {
            return html`
                <details class="file-result empty">
                    <summary>
                        <span class="status-icon">…</span>
                        <span class="file-name">${result.file}</span>
                        <span class="file-meta">${this.msg.noTests}</span>
                    </summary>
                </details>
            `;
        }

        const passed = result.cases.filter((c) => c.status === 'pass').length;
        const failed = result.cases.filter((c) => c.status === 'fail').length;

        return html`
            <details class="file-result ${failed > 0 ? 'fail' : 'pass'}">
                <summary>
                    <span class="status-icon">${failed > 0 ? '✗' : '✓'}</span>
                    <span class="file-name">${result.file}</span>
                    <span class="file-meta">${this.msg.caseSummary(passed, failed)}</span>
                </summary>
                <div class="case-list">
                    ${result.cases.map((c) => html`
                        <div class="case-line ${c.status}">
                            <span class="case-status">${c.status === 'pass' ? '✓' : '✗'}</span>
                            <span class="case-name">${c.functionName}</span>
                            ${c.index >= 0 ? html`<span class="case-index">#${c.index}</span>` : ''}
                            <span class="case-env">${c.env}</span>
                            ${c.status === 'fail' ? html`<div class="case-error">${c.message}</div>` : ''}
                        </div>
                    `)}
                </div>
            </details>
        `;
    }

    async runAll() {
        if (this.running) return;
        this.running = true;
        this.hasRun = false;
        this.results = [];
        this.totalFiles = 0;
        this.totalPassed = 0;
        this.totalFailed = 0;
        this.totalNoTests = 0;

        const project = mls.actualProject;
        if (!project) {
            console.error(`[PluginPluginRunTest] ${this.msg.noProject}`);
            this.running = false;
            return;
        }

        const files = this.findTestFiles(project);
        console.group(`%c[PluginPluginRunTest] Found ${files.length} plugin*.test.ts file(s) in project ${project}`, 'font-weight:bold');

        for (const file of files) {
            const result = await this.runFile(file);
            this.results = [...this.results, result];
            this.logToConsole(result);
        }

        this.totalFiles = this.results.length;
        this.totalPassed = this.results.reduce((acc, r) => acc + r.cases.filter((c) => c.status === 'pass').length, 0);
        this.totalFailed = this.results.reduce((acc, r) => acc + r.cases.filter((c) => c.status === 'fail').length, 0);
        this.totalNoTests = this.results.filter((r) => r.status === 'no-tests').length;
        this.hasRun = true;

        const color = this.totalFailed > 0 ? 'color:#e06c75;font-weight:bold' : 'color:#98c379;font-weight:bold';
        console.info(`%c[PluginPluginRunTest] ${this.msg.summary(this.totalFiles, this.totalPassed, this.totalFailed, this.totalNoTests)}`, color);
        console.groupEnd();

        this.running = false;
    }

    private findTestFiles(project: number): mls.stor.IFileInfo[] {
        return Object.keys(mls.stor.files)
            .map((key) => mls.stor.files[key])
            .filter((file) => file && file.project === project && file.extension === '.test.ts' && file.shortName.startsWith('plugin'));
    }

    private async runFile(file: mls.stor.IFileInfo): Promise<ITestFileResult> {
        const fileName = file.folder ? `${file.folder}/${file.shortName}.test.ts` : `${file.shortName}.test.ts`;

        let module: any;
        try {
            module = await collabImport({
                project: file.project,
                shortName: file.shortName,
                folder: file.folder,
                extension: '.test.ts',
            });
        } catch (err: any) {
            return { file: fileName, status: 'import-error', error: err?.message ?? String(err), cases: [] };
        }

        const declaredTests: IPluginTestCase[] = Array.isArray(module.tests)
            ? module.tests.map((t: any) => ({ env: 'browser', ...t }))
            : [];

        if (declaredTests.length === 0) {
            return { file: fileName, status: 'no-tests', cases: [] };
        }

        const orderedTests = sortByEnvironment(declaredTests);
        const cases: ITestCaseResult[] = [];

        for (const test of orderedTests) {
            const fn = module[test.functionName];

            if (typeof fn !== 'function') {
                cases.push({
                    functionName: test.functionName,
                    env: test.env,
                    index: -1,
                    status: 'fail',
                    message: `Function '${test.functionName}' is not exported by the module.`,
                });
                continue;
            }

            const params = Array.isArray(test.params) && test.params.length > 0 ? test.params : [{}];

            for (let i = 0; i < params.length; i++) {
                try {
                    const result = await fn(params[i]);
                    cases.push({
                        functionName: test.functionName,
                        env: test.env,
                        index: i,
                        status: 'pass',
                        message: typeof result === 'string' ? result : JSON.stringify(result),
                    });
                } catch (err: any) {
                    cases.push({
                        functionName: test.functionName,
                        env: test.env,
                        index: i,
                        status: 'fail',
                        message: err?.message ?? String(err),
                    });
                }
            }
        }

        return { file: fileName, status: 'ok', cases };
    }

    private logToConsole(result: ITestFileResult) {
        if (result.status === 'import-error') {
            console.error(`✗ ${result.file} — ${this.msg.importError}: ${result.error}`);
            return;
        }

        if (result.status === 'no-tests') {
            console.info(`… ${result.file} — ${this.msg.noTests}`);
            return;
        }

        const passed = result.cases.filter((c) => c.status === 'pass').length;
        const failed = result.cases.filter((c) => c.status === 'fail').length;
        const color = failed > 0 ? 'color:#e06c75' : 'color:#98c379';

        console.groupCollapsed(`%c${failed > 0 ? '✗' : '✓'} ${result.file} — ${passed} passed, ${failed} failed`, color);
        console.table(result.cases.map((c) => ({
            test: c.functionName,
            case: c.index,
            env: c.env,
            status: c.status,
            detail: c.message,
        })));
        console.groupEnd();
    }

}
