/// <mls fileReference="_100555_/l2/pluginPreview/pluginPreviewResultJs.ts" enhancement="_102027_/l2/enhancementLit" />

import { html, css, svg, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property, query } from 'lit/decorators.js';
import { PluginBaseModule } from '/_102027_/l2/pluginBaseModule.js';
import { getDependenciesByMFile } from '/_102027_/l2/libCompile.js';
import '/_102027_/l2/collabMonacoEditor.js';

/// **collab_i18n_start**
const message_pt = {
    noItens: 'Nenhum item ICA foi encontrado!'
}

const message_en = {
    noItens: 'No ICA items were found!',
}

type MessageType = typeof message_en;

const messages: { [key: string]: MessageType } = {
    'en': message_en,
    'pt': message_pt
}
/// **collab_i18n_end**

@customElement('plugin-preview--plugin-preview-result-js-100555')
export class PluginPreviewResultJs extends PluginBaseModule {

    private msg: MessageType = messages['en'];
    private _ed1: monaco.editor.IStandaloneCodeEditor | undefined;
    private hasError: boolean = false;
    private results: Results = {
        errors: '',
        prodJS: '',
        configTS: '',
        libTS: '',
        jsonImport: '',
    };


    get confE() { return `l2_left`; }

    @property({ type: String }) msize = '';
    @query('collab-monaco-editor') editor: IHTMLEditorElement | undefined;

    updated(changedProperties: any) {
        if (changedProperties.has('msize')) {
            this.editor?.setAttribute('msize', this.msize);
        }
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
        this.createEditor();
        const actualFile = (mls.actual[2] as any).left;
        if (!actualFile) return;
        const { project, shortName, folder } = actualFile;
        this.setInitialModelProdJS(project, shortName, folder, 'compiling...');
        await this.getCompileResults(project, shortName, folder);
        this.setInitialModelProdJS(project, shortName, folder, this.results.prodJS);

    }

    render() {
        const lang = this.getMessageKey(messages);
        this.msg = messages[lang];
        return html`<collab-monaco-editor></collab-monaco-editor>`
    }

    private createEditor(): void {
        if (!this.editor || this._ed1) return;
        this._ed1 = monaco.editor.create(this.editor, mls.editor.conf[this.confE] as monaco.editor.IEditorOptions);
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            noImplicitAny: true
        });
        this._ed1.updateOptions({ readOnly: true });
        this.editor.mlsEditor = this._ed1;
    }

    private async getCompileResults(project: number, shortName: string, folder:string): Promise<void> {
        const models = mls.editor.getModels(project, shortName, folder, 2);
        //const models = mls.editor.models[`_${project}_${shortName}`]
        if (!models || !models.ts) return;
        if (models.ts.compilerResults && !models.ts.compilerResults.prodJS) models.ts.compilerResults.modelNeedCompile = true;
        await mls.l2.typescript.compile(models.ts);
        const errs = {
            Errors: models.ts.compilerResults?.errors || []
        };

        const libs = monaco.languages.typescript.typescriptDefaults.getExtraLibs();
        const libs2: any = {};
        Object.keys(libs).forEach((key) => {
            libs2[key] = {
                version: libs[key].version
            };
        });

        this.hasError = errs.Errors.length > 0;
        const jsonImp = await getDependenciesByMFile(models);

        this.results = {
            prodJS: models.ts.compilerResults?.prodJS || '',
            errors: JSON.stringify(errs, null, 2),
            configTS: JSON.stringify(monaco.languages.typescript.typescriptDefaults.getCompilerOptions(), null, 2),
            libTS: JSON.stringify(libs2, null, 2),
            jsonImport: JSON.stringify(jsonImp, null, 2),
        };

    }

    private setInitialModelProdJS(project: number, shortName: string, folder:string, src: string) {
        const model1 = this.createOrGetModel(project, shortName, folder, 'javascript', src);
        if (!model1) return;
        if (this._ed1) this._ed1.setModel(model1);
    }

    private getUri(shortFN: string): monaco.Uri {
        return monaco.Uri.parse(`file://server/${shortFN}_results_js.ts`);
    }

    private createOrGetModel(project: number, shortName: string, folder: string, editorType: string, src: string): monaco.editor.ITextModel {
        let name = folder ? `_${project}_${folder}_${shortName}` : `_${project}_${shortName}`;
        const uri = this.getUri(name);
        let modelResultJS = monaco.editor.getModel(uri);
        if (modelResultJS) {
            modelResultJS.setValue(src);
            return modelResultJS;
        }
        modelResultJS = monaco.editor.createModel(src, editorType, uri);
        return modelResultJS;
    }

}

type Results = {
    prodJS: string,
    errors: string;
    libTS: string;
    configTS: string;
    jsonImport: string,
}

interface IHTMLEditorElement extends HTMLElement {
    mlsEditor: monaco.editor.IStandaloneCodeEditor
}