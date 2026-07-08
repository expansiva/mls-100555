/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectRunTest.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, css, svg, TemplateResult, LitElement } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, query, property } from 'lit/decorators.js';
import { forceServiceInstance } from '/_102027_/l2/libCommom.js'
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
import { ICANTest, ICANIntegration, TsTestAst } from '/_100555_/l2/utils/tsTestAST.js';
import { CollabPageElement } from '/_102027_/l2/collabPageElement.js';
import { collab_fileTest } from '/_100555_/l2/utils/collabIcons.js';

import '/_100554_/l2/collabResultTest.js';

/// **collab_i18n_start**
const message_pt = {
    title: 'Executar testes',
    info: 'Este plugin executa automaticamente todos os testes disponíveis para a todas as páginas com teste no projeto.',
    page: 'Página'
}

const message_en = {
    title: 'Run Tests',
    info: 'This plugin automatically runs all available tests for all pages with tests in the project.',
    page: 'Page'

}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

export const pluginData: mls.plugin.IPluginData = {
    title: "Run Tests",
    getSvg(): TemplateResult {
        return collab_fileTest;
    }
};

@customElement('plugin-project--plugin-project-run-test-100555')
export class PluginProjectRunTest extends PluginBaseModule {

    private msg: MessageType = messages['en'];

    @query('collab-result-container-100554') collabResultContainer: HTMLElement | undefined;


    @property() progress: number = 0;
    @property() totalTest: number = 0;
    @property() totalTestPass: number = 0;
    @property() totalTestFailed: number = 0;

    @property() startTime: number = 0;
    @property() endTime: number = 0;

    @property() actualAllPagesTests = 0;
    @property() filesWithTest: string[] = []

    render(): TemplateResult {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];

        return html`

            <div>
                <h1>${this.msg.title}</h1>
                <small>${this.msg.info}</small>
                <div class="actions">
                    <button @click=${this.exec}>${this.msg.title}</button>
                </div>
            </div>


            <div class="progress-container">
				<div class="progress-bar" style="width: ${this.progress}%;"></div>
			</div>
            <collab-result-container-100554>
            
            </collab-result-container-100554>
        `;
    }

    firstUpdated(_changedProperties: Map<PropertyKey, unknown>) {
        super.firstUpdated(_changedProperties)
        this.init();
    }

    updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties);
        if (changedProperties.has('actualAllPagesTests')) {
            this.calcProgress(this.totalTest, this.actualAllPagesTests);
        }
    }

    private async init() {
        try {
            const project = mls.actualProject;
            if (!project) return;
            this.clear();
            this.filesWithTest = await this.getStorFilesWithTest(project);
        } catch (err: any) {
            console.info(err);
        }

    }

    private async exec() {
        this.clear();
        this.startTime = performance.now();

        console.info("[DEBUG] Start:", new Date().toISOString());

        const modelsStart = performance.now();
        const models = await this.createModelsIfNeeded(this.filesWithTest);
        console.info(`[DEBUG] createModelsIfNeeded took ${(performance.now() - modelsStart).toFixed(2)}ms`);

        const testsStart = performance.now();
        const tests = await this.getTestsByFile(models);
        console.info(`[DEBUG] getTestsByFile took ${(performance.now() - testsStart).toFixed(2)}ms`);

        this.totalTest = this.countTotalTests(tests);

        const forceServiceStart = performance.now();
        await forceServiceInstance(5, '_100554_servicePreview');
        console.info(`[DEBUG] forceServiceInstance took ${(performance.now() - forceServiceStart).toFixed(2)}ms`);

        const runTestsStart = performance.now();
        await this.runAllTests(tests);
        console.info(`[DEBUG] runAllTests took ${(performance.now() - runTestsStart).toFixed(2)}ms`);

        this.endTime = performance.now();

        console.info("[DEBUG] End:", new Date().toISOString());

        this.onFinishTest();
    }

    private clear() {
        if (this.collabResultContainer) this.collabResultContainer.innerHTML = '';
        this.progress = 0;
        this.actualAllPagesTests = 0;
        this.totalTest = 0;
        this.totalTestPass = 0;
        this.totalTestFailed = 0;
        this.startTime = 0;
        this.endTime = 0;
    }

    private countTotalTests(tests: ITests) {
        let total = 0
        Object.keys(tests).forEach((test) => {
            tests[test].tests.forEach((testData) => {
                let lengthTest = testData.params.length;
                total += lengthTest;
            });
        });
        return total;
    }

    private calcProgress(total: number, actual: number) {
        if (total <= 0) return;
        const part = 100 / total;
        const percent = actual * part;
        this.progress = percent;
    }

    private async createModelsIfNeeded(files: string[]) {
        await forceServiceInstance(2, '_100554_serviceSource');
        const instance = mls.services['100554_serviceSource_left'];
        if (!instance) throw new Error('Invalid instance for service source');
        if (!instance.createModels || typeof instance.createModels !== 'function') throw new Error(`Invalid function createModels`);

        const rc: mls.editor.IModelBase[] = []

        for await (let key of files) {
            const storFile = mls.stor.files[key];
            if (!storFile) continue;
            await instance.createModels(storFile);

            const keyModel = mls.editor.getKeyModel(storFile.project, storFile.shortName, storFile.folder, storFile.level);
            if (mls.editor.models[keyModel] && mls.editor.models[keyModel].test) rc.push(mls.editor.models[keyModel].test as mls.editor.IModelBase)

        }

        return rc;
    }

    private async getTestsByFile(models: mls.editor.IModelTest[]) {

        const rc: ITests = {}

        for await (let modelTest of models) {

            const ast = new TsTestAst(modelTest, monaco.editor.create(document.createElement('div')));
            if (!ast) continue;

            const tests = ast.getTests();
            if (tests && tests.length > 0) rc[`_${modelTest.storFile.project}_${modelTest.storFile.shortName}`] = {
                tests,
                ast,
                storFile: modelTest.storFile
            }
        }

        return rc;
    }

    private async getStorFilesWithTest(project: number) {

        const filesWithTest = Object.keys(mls.stor.files).filter((key: string) => {
            const file = mls.stor.files[key];
            return file.project === project && file.extension === '.test.ts';
        }).map((item) => item.replace('.test.ts', '.ts'));

        return filesWithTest;
    }

    private addTestResultItem(container: HTMLDivElement, title: string, status: string) {

        if (!this.collabResultContainer) return;
        const item = document.createElement('collab-result-test-100554');
        item.setAttribute('testName', title);
        item.setAttribute('status', status);
        container.appendChild(item);
        return item;
    }

    private createPageContainer(pageName: string) {
        const el = document.createElement('div');

        const testProgress = document.createElement('small');
        testProgress.className = 'test-progress';

        const icon = document.createElement('i');
        icon.className = 'icon fa-solid fa-spinner'

        const span = document.createElement('h3');

        const containerTest = document.createElement('div');
        containerTest.className = 'container-test';

        const details = document.createElement('details');
        details.open = false;
        const summary = document.createElement('summary');
        const summaryContent = document.createElement('div')
        summaryContent.className = 'summary-title'

        span.innerHTML = `${this.msg.page}: ${pageName}`;
        span.style.display = 'inline-block';

        const result = document.createElement('small')
        result.className = 'test-result';


        details.appendChild(summary);
        details.appendChild(containerTest);
        summaryContent.appendChild(span);
        summaryContent.appendChild(testProgress);
        summaryContent.appendChild(icon);

        summaryContent.appendChild(result);
        summary.appendChild(summaryContent);
        el.appendChild(details);

        return el;
    }

    private async runTest(actualData: ICANTest, index: number, ast: TsTestAst, containerTestDiv: HTMLDivElement) {

        const testItem = this.addTestResultItem(containerTestDiv, actualData.functionName + `(${index})`, 'running');
        if (!testItem) return;
        try {
            const result = await ast.runTest(actualData.functionName, index);
            testItem.setAttribute('resultStatus', 'pass');
            testItem.setAttribute('result', result);
        } catch (err: any) {
            testItem.setAttribute('resultStatus', 'failed');
            testItem.setAttribute('result', err.message);
            throw new Error();
        } finally {
            testItem.setAttribute('status', 'finished');
        }
    }

    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async runAllTests(allTests: ITests) {

        this.actualAllPagesTests = 0;

        for (let key of Object.keys(allTests)) {

            const testData = allTests[key];
            const container = this.createPageContainer(testData.storFile.shortName);
            this.collabResultContainer?.appendChild(container);
            const containerTestDiv = container.querySelector('.container-test') as HTMLDivElement;
            const iconLoader = container.querySelector('.icon') as HTMLElement;
            const testProgress = container.querySelector('.test-progress') as HTMLElement;
            const result = container.querySelector('.test-result') as HTMLElement;

            this.fireEvents(testData.storFile);
            await this.waitForPreviewLoaded();
            const iframe = window.preview.iframe;
            if (iframe) await this.waitForLitComponentsInIframe(iframe);
            // await this.delay(5000);

            let totalTest = testData.tests.reduce((acc, item) => acc + item.params.length, 0);
            let success = 0;
            let failed = 0;
            let totalTestExecuted = 0;

            testProgress.innerHTML = `(0/${totalTest})`;
            for (let i = 0; i < testData.tests.length; i++) {
                const data = testData.tests[i];

                for (let j = 0; j < data.params.length; j++) {
                    if (!data.functionName) continue;
                    try {
                        await this.runTest(data, j, testData.ast, containerTestDiv);
                        this.totalTestPass++;
                        success++;
                    } catch (error) {
                        this.totalTestFailed++;
                        failed++;
                        continue;
                    } finally {
                        totalTestExecuted++;
                        this.actualAllPagesTests++;
                        testProgress.innerHTML = `(${totalTestExecuted}/${totalTest})`;

                    }
                }

            }

            iconLoader.remove();

            const resume = this.createResume(totalTest, success, failed);
            result.appendChild(resume);

        }
    }

    private createResume(totalTest: number, success: number, failed: number) {
        const resume = document.createElement('span');
        resume.innerHTML = `${totalTest} tests executed — ${success > 0 ? '<i class="success fa fa-check"></i>' : ''} ${success} passed, ${failed > 0 ? '<i class="failed fa fa-times"></i>' : ''} ${failed} failed.`
        return resume;
    }

    private createResumeFinal(totalTest: number, success: number, failed: number, start: number, end: number) {

        const executionTimeMs = end - start;
        const executionTime = executionTimeMs >= 1000
            ? `${(executionTimeMs / 1000).toFixed(2)}s`
            : `${executionTimeMs.toFixed(2)}ms`;

        const avgTestTime = (totalTest > 0) ? (executionTimeMs / totalTest).toFixed(2) : 'N/A';
        const failRate = (totalTest > 0) ? ((failed / totalTest) * 100).toFixed(1) : '0';

        const message = `
    <b>Result:</b> ${totalTest} tests executed — 
    ${success > 0 ? '<i class="success fa fa-check"></i>' : ''} <b>${success} passed</b>, 
    ${failed > 0 ? '<i class="failed fa fa-times"></i>' : ''} <b>${failed} failed.</b> 
    <br><b>Execution Time:</b> ${executionTime} 
    <br><b>Average Time per Test:</b> ${avgTestTime} ms
    <br><b>Failure Rate:</b> ${failRate}% 
`;

        const resume = document.createElement('span');
        resume.className = 'final-resume';
        resume.innerHTML = message;
        return resume;
    }

    private waitForPreviewLoaded(): Promise<void> {
        return new Promise((resolve) => {
            window.addEventListener('preview-loaded', (e) => { resolve() }, { once: true });
        });
    }

    private async waitForLitComponentsInIframe(iframe: HTMLIFrameElement): Promise<void> {
        return new Promise((resolve) => {
            const iframeDoc = iframe.contentWindow?.document;
            if (!iframeDoc) return resolve();

            const checkLitComponents = async () => {

                const elements = Array.from(iframeDoc.querySelectorAll('*'))
                    .filter(el => el.tagName.includes('-')) as HTMLElement[];

                if (elements.length === 0) {
                    resolve();
                    return;
                }

                const litElementsWithOutRegister = elements.filter(el =>
                    iframe.contentWindow?.customElements.get(el.tagName.toLowerCase()) === undefined) as CollabPageElement[];

                await Promise.all(litElementsWithOutRegister.map(async (el) => {
                    await iframe.contentWindow?.customElements.whenDefined(el.tagName.toLowerCase());
                }));

                const litElements2 = elements.filter(el => 'updateComplete' in el && 'initPage' in el) as CollabPageElement[];
                await Promise.all(litElements2.map(el => el.updateComplete));
                await Promise.all(litElements2.map(el => el.initPageComplete));
                resolve();

            };

            checkLitComponents();
        });
    }


    private fireEvents(file: mls.stor.IFileInfo): void {
        const params = {} as mls.events.IFileAction;
        (params.action as any) = 'openBackground';
        params.level = file.level;
        params.project = file.project;
        params.shortName = file.shortName;
        params.extension = file.extension;
        params.folder = file.folder;
        params.position = 'left';

        mls.actual[2].setFullName(`_${file.project}_${file.shortName}`);
        (mls.actual[2] as any).left = {
            project: file.project,
            shortName: file.shortName,
            extension: file.extension,
            folder: file.folder,
        } as any;

        mls.events.fire([5], ['FileAction'], JSON.stringify(params), 0);
    }

    private onFinishTest() {


        const resume = this.createResumeFinal(this.totalTest, this.totalTestPass, this.totalTestFailed, this.startTime, this.endTime);
        this.collabResultContainer?.appendChild(resume);

        (mls.actual[2] as any).left = undefined;
        window.preview.iframe?.remove();
        window.preview.iframe = undefined;
    }

}

interface ITests {
    [key: string]: ITestsParams
}

interface ITestsParams {
    tests: ICANTest[],
    ast: TsTestAst,
    storFile: mls.stor.IFileInfo
}


