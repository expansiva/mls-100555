/// <mls fileReference="_100555_/l2/pluginNewFile/pluginNewFileBase.ts" enhancement="_102027_/l2/enhancementLit" />
import { openService, isNameValid } from '/_102027_/l2/libCommom.js'
import { createAllFiles, IReqCreateAllFiles } from '/_102027_/l2/libStor.js';

export interface IDetails {
    title: string,
    description: string,
    tags: string[]
}

export function changeClassName(source: string, project: number, shortname: string): string {
    const newClassName = shortname.charAt(0).toUpperCase() + shortname.substring(1, shortname.length) + project.toString();
    const outputString = source.replace(/\[className\]/g, newClassName);
    return outputString;
}

export function changeWidget(source: string, project: number, shortname: string): string {
    const newWidget = `_${project.toString()}_${shortname}`;
    const outputString = source.replace(/\[widgetName\]/g, newWidget);
    return outputString;
}

export function changeShortName(source: string, shortname: string): string {
    const outputString = source.replace(/\[shortName\]/g, shortname);
    return outputString;
}


export function changeTagName(source: string, tagName: string): string {
    const outputString = source.replace(/\[tagName\]/g, tagName);
    return outputString;
}

export function changeProject(source: string, project: number): string {
    const outputString = source.replace(/\[project\]/g, project.toString());
    return outputString;
}

export function changeFolder(source: string, folder: string): string {
    const outputString = source.replace(/\[folder\]/g, folder);
    return outputString;
}

export function changeStateName(source: string, stateName: string): string {
    const outputString = source.replace(/\[stateName\]/g, stateName);
    return outputString;
}

export function getTemplateImport(projectBase: number, shortName: string, folder: string) {
    return folder ? `/_${projectBase}_/l2/${folder}/${shortName}.js` : `/_${projectBase}_/l2/${shortName}.js`;
}

export interface IRequestNewFile {
    project: number,
    position: 'left' | 'right',
    shortName: string,
    folder?:string,
    enhancement: string,
    sourceTS: string,
    sourceHTML?: string,
    sourceLess?: string,
    sourceTest?: string,
    sourceDefs?: string,
    openPreview: boolean
}

export async function createNewFile(args: IRequestNewFile) {

    const param = {
        shortName: args.shortName,
        project: args.project,
        folder: args.folder || '',
        enhancement: args.enhancement || '_blank',
        level: 2,
        tsSource: args.sourceTS

    } as IReqCreateAllFiles;

    if (!isNameValid(args.project, args.shortName, args.folder || '', 2, '.ts')) throw new Error(`[createNewFile] Invalid name: _${args.project}_${args.folder ? args.folder + '/' + args.shortName : args.shortName}`);

    if (args.sourceHTML) param.htmlSource = args.sourceHTML;
    if (args.sourceLess) param.lessSource = args.sourceLess;
    if (args.sourceTest) param.testSource = args.sourceTest;
    if (args.sourceDefs) param.defsSource = args.sourceDefs;

    const files = await createAllFiles(param, true, true);

    if (files && files.ts && !(files.ts instanceof Error)) {
        const models = mls.editor.getModels(files.ts.project, files.ts.shortName, files.ts.folder);
        if (models && models.ts) mls.editor.forceModelUpdate(models.ts.model);
    }
    

    if (args.openPreview && files.ts && !(files.ts instanceof Error)) {

        fireEvents(files.ts, { position: args.position, openPreview: args.openPreview }, 0);
        saveLocalHistory(param.project, 2, param.shortName, '.ts', param.folder);

    }

    
}

function fireEvents(file: mls.stor.IFileInfo, info: any, timeout: number = 0): void {

    const params = {} as mls.events.IFileAction;

    params.action = 'open';
    params.level = file.level;
    params.project = file.project;
    params.shortName = file.shortName;
    params.extension = file.extension;
    params.folder = file.folder;
    params.position = info.position as ('right' | 'left');

    if (info && info.shortName) {
        params.newshortName = info.shortName;
        params.newProject = info.project;
        params.newfolder = file.folder;
    }

    const lv = mls.actualLevel == 1 ? 1 : file.level;

    mls.actual[lv as any].setFullName(`_${file.project}_${file.shortName}`);
    (mls.actual[lv as any] as any)[info.position as any] = {
        project: file.project,
        shortName: file.shortName,
        extension: file.extension,
        folder: file.folder,
    } as any;



    if (mls.actualLevel == 1) {
        mls.events.fire([1], ['FileAction'], JSON.stringify(params), timeout);
        if (info.position === 'left' && info.openPreview) openService('_100554_servicePreviewL1', 'right', 1);
    } else {
        mls.events.fire([(+(file.level as any) as any)], ['FileAction'], JSON.stringify(params), timeout);
        if (info.position === 'left' && info.openPreview) openService('_100554_servicePreview', 'right', 2);
    }


}

/*export async function createNewFile(args:IRequestNewFile) {

    const params = {} as mls.events.IFileAction;

    params.action = 'new' as typeof params.action;
    params.level = 2;
    params.project = args.project;
    params.newProject = args.project;
    params.shortName = args.shortName;
    params.newshortName = args.shortName;
    params.folder = '';
    params.newfolder = '';
    params.newEnhancement = args.enhancement || '_blank';
    params.extension = '.ts';
    params.newTSSource = args.sourceTS;
    if (args.sourceHTML) params.newHtmlSource = args.sourceHTML;
    if (args.sourceLess) (params as any).newLessSource = args.sourceLess;
    if (args.sourceTest) (params as any).newTsTestSource = args.sourceTest;
    if (args.sourceDefs) (params as any).newTsDefsSource = args.sourceDefs;


    (params as any).openPreview = args.openPreview
    params.position = args.position;

    mls.actual[2].setFullName('_' + params.project + '_' + params.shortName);
    (mls.actual[2] as any)[args.position] = {
        project: params.project,
        shortName: params.shortName
    };

    if (mls.actualLevel == 1) {
        await mls.events.fire([1], ['FileAction'], JSON.stringify(params), 0);
        if (args.position === 'left' && args.openPreview) openService('_100554_servicePreviewL1', 'right', 1);
    } else {
        await mls.events.fire([2], ['FileAction'], JSON.stringify(params), 0);
        if (args.position === 'left' && args.openPreview) openService('_100554_servicePreview', 'right', 2);
    }

    saveLocalHistory(params.project, 2, params.shortName, params.extension, params.folder);

}*/

function saveLocalHistory(project: number, level: number, shortName: string, extension: string, folder: string): void {

    const info = localStorage.getItem('mlsInfoHistoryL' + level);
    const res: any[] = info ? JSON.parse(info) : [];
    let idx = -1;
    res.forEach((i: any, index) => {
        if (i.project !== project || i.shortName !== shortName) return;
        idx = index;
    });

    if (idx >= 0) res.splice(idx, 1);
    res.unshift({ project, shortName, extension, folder });
    if (res.length > 10) res.length = 10;
    localStorage.setItem('mlsInfoHistoryL' + level, JSON.stringify(res));

}