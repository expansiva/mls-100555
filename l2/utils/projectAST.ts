/// <mls fileReference="_100555_/l2/utils/projectAST.ts" enhancement="_102027_/l2/enhancementLit" />

import { createModel } from '/_102027_/l2/libModel.js';
import { collabImport } from '/_102027_/l2/collabImport.js';
import { createNewFile } from "/_100555_/l2/pluginNewFile/pluginNewFileBase.js";

// Adds a new module with the given name to the modules array in the editor content.
export async function addModule(project: number, moduleName: string, forceCreateModel: boolean = false) {

    const shortName = 'project';
    const folder = '';
    const enhancement = '_blank';
    const key = mls.stor.getKeyToFiles(project, 2, shortName, folder, '.ts');
    const storFile = mls.stor.files[key];

    if (!storFile) {
        const ts = `
/// <mls shortName="${shortName}" project="${project}" folder="${folder}" enhancement="_blank" />

export const projectConfig = {
    modules: [{
      name: '${moduleName}',
      path: '${moduleName}',
      auth: 'admin'
    }];
}

`;

        await createNewFile({ project, shortName, folder, position: 'right', enhancement, sourceTS: ts.trim(), sourceHTML: '', sourceLess: '', sourceDefs: '', openPreview: false });

        return { ok: true };

    }

    const modelTS = await getModel(project, forceCreateModel);
    if (!modelTS) return { ok: false, message: "No models found" };
    const model = modelTS.model;

    const moduleProject = await collabImport({
        folder: "",
        project,
        shortName: "project",
        extension: ".ts",
    });

    if (!moduleProject) {
        return { ok: false, message: "Project file not found" };
    }

    if (!moduleProject.projectConfig.modules) {
        return { ok: false, message: "No modules found" };
    }

    const m = moduleProject.projectConfig.modules.find((item: any) => item.name === moduleName);
    if (m) return { ok: true }

    moduleProject.projectConfig.modules.push({
        name: moduleName,
        path: moduleName,
        auth: 'admin'
    });

    const newText = `
    /// <mls shortName="project" project="${project}" enhancement="_blank" groupName="other" />

    export const projectConfig = ${JSON.stringify(moduleProject.projectConfig, null, 2)}

    `
    model.setValue(newText.trim());
    await mls.l2.typescript.compileAndPostProcess(modelTS, false, true);
    return { ok: true };
}

export async function configureMasterFrontEnd(project: number, start: string, build: string, liveView: string) {
    const modelTS = await getModel(project, true);
    if (!modelTS) return { ok: false, message: "No models found" };
    const model = modelTS.model;

    const moduleProject = await collabImport({
        folder: "",
        project,
        shortName: "project",
        extension: ".ts",
    });


    if (!moduleProject) {
        return { ok: false, message: "Project file not found" };
    }

    if (!moduleProject.projectConfig) {
        return { ok: false, message: "No projectConfig found" };
    }

    moduleProject.projectConfig.masterFrontEnd = {
        build,
        start,
        liveView
    }

    const newText = `
    /// <mls shortName="project" project="${project}" enhancement="_blank" groupName="other" />

    export const projectConfig = ${JSON.stringify(moduleProject.projectConfig, null, 2)}

    `
    model.setValue(newText.trim());

    return { ok: true };


}

export async function removeModule(project: number, moduleName: string, forceCreateModel: boolean = false) {

    const modelTS = await getModel(project, forceCreateModel);
    if (!modelTS) return { ok: false, message: "No models found" };
    const model = modelTS.model;

    const moduleProject = await collabImport({ folder: '', project, shortName: 'project', extension: '.ts' });
    if (!moduleProject) return;

    if (!moduleProject.projectConfig.modules) return { ok: false, message: "No modules found" };
    const index = moduleProject.projectConfig.modules.findIndex((mod: any) => mod.name === moduleName)
    if (index === -1) return { ok: false, message: `No module found with name ${moduleName}` };

    moduleProject.projectConfig.modules.splice(index, 1);

    const newText = `
    /// <mls shortName="project" project="${project}" enhancement="_blank" groupName="other" />

    export const projectConfig = ${JSON.stringify(moduleProject.projectConfig, null, 2)}

    `
    model.setValue(newText.trim());
    return { ok: true };
}


async function getModel(project: number, forceCreateModel: boolean = false): Promise<mls.editor.IModelTS | undefined> {
    const shortName = 'project';
    const folder = '';
    const key = mls.stor.getKeyToFiles(project, 2, shortName, folder, '.ts');
    const keyModels = mls.editor.getKeyModel(project, shortName, folder, 2)
    const storFile = mls.stor.files[key];
    if (!storFile) return;
    let models = mls.editor.models[keyModels];
    if (!models || !models.ts && forceCreateModel) {
        const modelTS = await createModel(storFile);
        return modelTS;
    };
    return models.ts;
}

