/// <mls fileReference="_100555_/l2/pluginExplore/mlsFileTree.ts" enhancement="_102027_/l2/enhancementLit"/>

import { html, css, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { CollabLitElement } from '/_102029_/l2/collabLitElement.js';
import { undoFile, deleteFile, createStorFile, IReqCreateStorFile } from '/_102027_/l2/libStor.js';
import { getBaseTemplate } from '/_102027_/l2/libCommom.js';
import { createModel } from '/_102027_/l2/libModel.js';

interface FileInfo {
    project: number; 
    level: number;
    shortName: string;
    folder: string;
    extension: string;
}

interface TreeNode {
    name: string;
    fullPath: string;
    isFolder: boolean;
    children: TreeNode[];
    fileKey?: string;
    extension?: string;
    file: mls.stor.IFileInfo
}

@customElement('plugin-explore--mls-file-tree-100555')
export class MlsFileTree extends CollabLitElement {

    @property() position: string | undefined;
    @property() project: string | undefined;
    @property() filter: string = '';
    @property({ type: Object }) files: Record<string, FileInfo> = {};
    @state() private expanded: Set<string> = new Set();
    @state() private selected: string = '';
    @state() private _loading = false;
    @state() private _loadingMsg = '';

    firstUpdated() {
        this.project = this.project ? this.project : (mls.actualProject || 0).toString()
    }

    render() {
        const src = Object.keys(this.files).length > 0 ? this.files : mls.stor.files ?? {};

        if (Object.keys(src).length === 0) {
            this.files = src;
            return html`
                ${this._renderOverlay()}
                <div style="padding:8px;color:#888">Nenhum arquivo encontrado em mls.stor.files</div>
            `;
        }

        if (this.files !== src) this.files = src;

        const content = this.filter
            ? this.renderFiltered(src)
            : html`<ul class="tree-root">${this.buildTree().children.map(c => this.renderNode(c, 0))}</ul>`;

        return html`<div style="position:relative;height:100%">${this._renderOverlay()}${content}</div>`;
    }

    private _renderOverlay() {
        if (!this._loading) return nothing;
        return html`
            <style>@keyframes mft-spin{100%{transform:rotate(360deg)}}</style>
            <div style="position:absolute;inset:0;background:rgba(0,0,0,.55);z-index:99999;display:flex;align-items:center;justify-content:center">
                <div style="background:var(--bg-secondary-color,#252526);border-radius:10px;padding:1.75rem 2.5rem;display:flex;flex-direction:column;align-items:center;gap:1rem;min-width:240px;box-shadow:0 8px 32px rgba(0,0,0,.6)">
                    <div style="width:38px;height:38px;border:4px solid rgba(255,255,255,.15);border-top-color:#4fa3e0;border-radius:50%;animation:mft-spin .75s linear infinite"></div>
                    <span style="color:var(--text-primary-color,#ccc);font-size:.9rem;text-align:center;white-space:pre-wrap">${this._loadingMsg}</span>
                </div>
            </div>
        `;
    }

    private renderFiltered(src: Record<string, any>): TemplateResult {
        const project = +(this.project || '0');
        const term = this.filter.toLowerCase();

        const matches = (Object.values(src) as mls.stor.IFileInfo[])
            .filter(f =>
                f.project === project && (
                    f.shortName.toLowerCase().includes(term) ||
                    (f.folder && f.folder.toLowerCase().includes(term)) ||
                    (f.extension && f.extension.toLowerCase().includes(term))
                )
            )
            .sort((a, b) => a.shortName.localeCompare(b.shortName));

        if (matches.length === 0) {
            return html`<div style="padding:8px;color:#888">Sem resultados para "<strong>${this.filter}</strong>"</div>`;
        }

        return html`<ul class="tree-root">${matches.map(file => {
            const key = mls.stor.getKeyToFile(file);
            const fullName = (file.folder ? file.folder + '/' : '') + file.shortName + file.extension;
            const highlighted = this.highlightText(fullName, term);
            return html`
                <li class="test-item ${this.selected === key ? 'selected' : ''}"
                    style="--depth:0"
                    .myFile=${file}
                    @click=${() => this.selectFile(key, file)}>
                    <div class="elContent">
                        <info-item>
                            <span class="spanFileName" .innerHTML="${highlighted}"></span>
                        </info-item>
                    </div>
                </li>
            `;
        })}</ul>`;
    }

    private highlightText(text: string, term: string): string {
        const idx = text.toLowerCase().indexOf(term);
        if (idx < 0) return text;
        return (
            text.slice(0, idx) +
            `<mark style="background:rgba(255,200,0,.4);border-radius:2px;font-weight:600;padding:0 1px">${text.slice(idx, idx + term.length)}</mark>` +
            text.slice(idx + term.length)
        );
    }

    private renderNode(node: TreeNode, depth: number): TemplateResult<1> {
        if (node.isFolder) {
            const isOpen = this.expanded.has(node.fullPath);

            return html`
                <li class="test-item folder" style="--depth: ${depth}" @click=${() => this.toggleFolder(node.fullPath)} >
                    <div class="elContent">
                        <info-item>
                            <span class="arrow ${isOpen ? 'open' : ''}">▶</span>
                            <span class="icon">📁</span>
                            <div style="display:flex; gap:.5rem" .innerHTML="${node.name}"></div>
                        
                        <span style="cursor:pointer;z-index: 99;display: flex; position: absolute; right: 25px;" title="undo all this folder" @click=${(e: MouseEvent) => { e.stopPropagation(); e.preventDefault(); this.undoAllByFolders(node); }}><span class="fa fa-undo" style="pointer-events:none;"></span></span>

                        <span style="cursor:pointer;z-index: 99;display: flex; position: absolute; right: 5px;" title="delete all this folder" @click=${(e: MouseEvent) => { e.stopPropagation(); e.preventDefault(); this.delAllByFolders(node); }}><svg xmlns="http://www.w3.org/2000/svg" style="width:15px; pointer-events:none;" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/></svg></span>
                        </info-item>
                    </div>
                </li>
                ${isOpen ? node.children.map(c => this.renderNode(c, depth + 1)) : nothing}
            `;

        } else {

            return this.renderItem(node, depth);

        }
    }

    renderItem(node: TreeNode, depth: number) {
        const isSelected = this.selected === node.fileKey;

        const file = node.file;
        let auxVersion = '';
        let auxStorage = '';
        let auxBug = '';
        let auxHtml = '';


        const titleLocalStorage = this.getTitleInLocalStorage(file);
        if (titleLocalStorage) {
            auxStorage = `<span title=" ${titleLocalStorage} in localstorage" class="fa fa-location-dot" style="color:lightskyblue; height: 14px; display: flex; justify-content: center; align-items: center;"></span>`
        }

        if (file.hasError) {
            auxBug = `<span title="bug" class="fa fa-bug" style="color:rgb(169, 3, 3); height: 14px; display: flex; justify-content: center; align-items: center;"></span>`
        }

        if (file.isLocalVersionOutdated) {
            auxVersion = `<span title="need conciliation" class="fa fa-unbalanced" style="color:orange; height: 14px; display: flex; justify-content: center; align-items: center;"></span>`
        }


        return html` 
                <li  .myFile=${node.file} class="test-item ${isSelected ? 'selected' : ''}" @click=${() => this.selectFile(node.fileKey!, node.file)} style="--depth: ${depth}" .nameFilter="${node.file.shortName.toLocaleLowerCase()}">
                    <div class="elContent">
                        <info-item>
                            <span class="classClick" @click="${this.clickGroupHidden}">
                                <span class="groupHiddenListIcon" >
                                    <svg xmlns='http://www.w3.org/2000/svg' style='height: 21px;' viewBox='0 0 128 512' ><path style='fill:var(--text-primary-color)' d='M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z' fill='rgb(66,65,65,1)'/></svg>
                                </span>
                            </span>
                            </span>
                            <span class="spanFileName ${node.file.status === 'deleted' ? 'fileDeleted' : ''}">${node.name}</span>
                            <div style="display:flex; gap:.5rem" .innerHTML="${auxStorage + auxBug + auxVersion + auxHtml}"></div>
                        </info-item>
                        <div class="groupHiddenList">
                            <span class="mls-gpbtnslider-item" title="Undo" @click=${(e: any) => { e.stopPropagation(); this.undoFile(node.file) }}><span class="fa fa-undo"></span> Undo</span>
                            <span class="mls-gpbtnslider-item" title="Delete" @click=${(e: any) => { e.stopPropagation(); this.deleteFile(node.file) }}><span class=" fa fa-trash"></span> Delete</span>
                        </div>
                    </div>
                </li>
            `;
    }

    private async deleteFile(file: mls.stor.IFileInfo) {
        await deleteFile(file);
        this.requestUpdate();
    }

    private async undoFile(file: mls.stor.IFileInfo) {
        if (!window.confirm(`Undo: ${file.shortName}?`)) return;
        await undoFile(file);
        this.requestUpdate();
    }

    private getTitleInLocalStorage(file: mls.stor.IFileInfo) {

        const fileLocal = file && file.inLocalStorage && this.verifyDifBaseTemplate(file);
        return fileLocal ? file.extension : '';

    }

    private dataDifBaseTemplate: Record<string, boolean> = {};
    private verifyDifBaseTemplate(file: mls.stor.IFileInfo): boolean {

        const { folder, shortName, project, extension } = file;
        const key = mls.stor.getKeyToFiles(project, 2, shortName, folder, extension);

        if (this.dataDifBaseTemplate[key] === undefined) return file.inLocalStorage;

        return this.dataDifBaseTemplate[key];

    }

    private buildTree(): TreeNode {
        const root: TreeNode = { name: '', fullPath: '', isFolder: true, children: [], file: {} as mls.stor.IFileInfo };

        /*const getOrCreateFolder = (parent: TreeNode, name: string, path: string): TreeNode => {
            console.info(parent, name)
            let node = parent.children.find(c => c.isFolder && c.name === name);
            if (!node) {
                node = { name, fullPath: path, isFolder: true, children: [], file: {} as mls.stor.IFileInfo };
                parent.children.push(node);
            }
            return node;
        };*/

        const getOrCreateFolder = (parent: TreeNode, name: string, path: string): TreeNode => {
            const parts = name.split('/');
            let current = parent;
            let currentPath = '';

            for (const part of parts) {
                currentPath = currentPath ? `${currentPath}/${part}` : part;

                let node = current.children.find(c => c.isFolder && c.name === part);
                if (!node) {
                    node = {
                        name: part,
                        fullPath: currentPath,
                        isFolder: true,
                        children: [],
                        file: {} as mls.stor.IFileInfo
                    };
                    current.children.push(node);
                }
                current = node;
            }

            return current;
        };

        for (const [key, file] of Object.entries(this.files)) {
            if (file.project !== +(this.project || '0') || isNaN(file.level)) continue;

            const segments: string[] = [];
            if (file.level > 0) segments.push(`l${file.level}`);
            if (file.folder) segments.push(file.folder);

            let current = root;
            let pathSoFar = '';
            for (const seg of segments) {
                pathSoFar += '/' + seg;
                current = getOrCreateFolder(current, seg, pathSoFar);
            }

            const fileName = file.shortName + file.extension;
            current.children.push({
                name: fileName,
                fullPath: key,
                isFolder: false,
                children: [],
                fileKey: key,
                extension: file.extension,
                file: file as mls.stor.IFileInfo
            });
        }

        // sort: folders first, then files, alphabetically
        const sortNode = (node: TreeNode) => {
            node.children.sort((a, b) => {
                if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1;
                return a.name.localeCompare(b.name);
            });
            node.children.forEach(sortNode);
        };
        sortNode(root);

        return root;
    }

    private toggleFolder(path: string) {
        const next = new Set(this.expanded);
        next.has(path) ? next.delete(path) : next.add(path);
        this.expanded = next;
    }

    private selectFile(key: string, file: mls.stor.IFileInfo) {
        this.selected = key;
        if (['.ts'].includes(file.extension) && [1, 2].includes(file.level) && mls.actualLevel === file.level) {
            this.fireEvents(file);
        } else {
            this.fireEventsDetails(file);
        }
    }

    private clickGroupHidden(e: MouseEvent) {

        e.stopPropagation();
        const el = e.target as HTMLElement;
        const father = el.closest('div');
        if (!father)
            return;
        const target = father.querySelector('.groupHiddenList');
        if (!target)
            return;
        target.classList.toggle('activegpbtnslider');



    }

    // Collect all file descendants under a tree node (recurses subfolders).
    // Robust against path-parsing edge cases (level groups, nested folders).
    private collectFilesFromNode(node: TreeNode): mls.stor.IFileInfo[] {
        const out: mls.stor.IFileInfo[] = [];
        const walk = (n: TreeNode) => {
            for (const child of n.children) {
                if (child.isFolder) walk(child);
                else if (child.file) out.push(child.file as mls.stor.IFileInfo);
            }
        };
        walk(node);
        return out;
    }

    private async delAllByFolders(node: TreeNode) {

        const files = this.collectFilesFromNode(node);

        console.log('[mlsFileTree] delAllByFolders', {
            folder: node.fullPath,
            project: this.project,
            count: files.length,
            files: files.map((f) => `${f.folder ? f.folder + '/' : ''}${f.shortName}${f.extension}`)
        });

        if (files.length === 0) return;

        const label = node.fullPath || 'root';
        if (!window.confirm(`delete: ${label} (${files.length})?`)) return;

        this._loading = true;
        this._loadingMsg = `Deleting ${label}\n0 / ${files.length}`;
        await this.updateComplete;

        try {
            for (let i = 0; i < files.length; i++) {
                if (!files[i]) continue;
                this._loadingMsg = `Deleting ${label}\n${i + 1} / ${files.length}`;
                await deleteFile(files[i]);
            }
        } finally {
            this._loading = false;
            this._loadingMsg = '';
        }

        this.requestUpdate();
    }

    private async undoAllByFolders(node: TreeNode) {

        const files = this.collectFilesFromNode(node);

        if (files.length === 0) return;

        const label = node.fullPath || 'root';
        if (!window.confirm(`undo: ${label} (${files.length})?`)) return;

        this._loading = true;
        this._loadingMsg = `Undoing ${label}\n0 / ${files.length}`;
        await this.updateComplete;

        try {
            for (let i = 0; i < files.length; i++) {
                if (!files[i]) continue;
                this._loadingMsg = `Undoing ${label}\n${i + 1} / ${files.length}`;
                await undoFile(files[i]);
            }
        } finally {
            this._loading = false;
            this._loadingMsg = '';
        }

        this.requestUpdate();
    }

    private getLevel(str: string) {
        const match = str.match(/\/l(\d+)\//);
        return match ? Number(match[1]) : null;
    }

    private clearPath(str: string) {
        let path = str.replace(/^\/l\d+\//, '/').replace(/\/$/, '');
        if (path.startsWith('/')) path = path.replace(/^\/+/, '')
        return path
    }

    private fireEventsDetails(stor: mls.stor.IFileInfo) {
        const key = mls.stor.getKeyToFile(stor);

        const options = {
            shortName: undefined,
            project: undefined,
            htmlText: '<plugin-view-file-100554 nameFile="' + key + '"></plugin-view-file-100554>'
        }

        mls.events.fire(
            mls.actualLevel as any,
            'PluginDetails' as any,
            JSON.stringify(options),
            0
        );
    }


    private async fireEvents(file: mls.stor.IFileInfo, timeout: number = 0): Promise<void> {

        try {

            const params = {} as mls.events.IFileAction;

            //const files = await createAllModels(file, true);

            if ([1, 2, 3, 4].includes(mls.actualLevel)) await this.createModel(file, '.ts');
            if ([2, 3, 4].includes(mls.actualLevel)) await this.createModel(file, '.less');
            if ([2, 3, 4].includes(mls.actualLevel)) await this.createModel(file, '.html');

            params.action = 'open';
            params.level = file.level;
            params.project = file.project;
            params.shortName = file.shortName;
            params.extension = file.extension;
            params.folder = file.folder;
            params.position = this.position as ('right' | 'left');


            const lv = mls.actualLevel;
            let name = `_${file.project}_${file.shortName}`;
            if (file.folder) name = `_${file.project}_${file.folder}/${file.shortName}`;
            mls.actual[lv as any].setFullName(name);
            mls.actual[lv as any][this.position as ('right' | 'left')] = file


            mls.events.fire([mls.actualLevel], ['FileAction'], JSON.stringify(params), timeout);


        } catch (err: any) {
            console.info(err.message || '[fireEvents]: erro open');

        }
    }

    private async createModel(base: mls.stor.IFileInfo, ext: string) {

        if (ext === '.ts') {
            return await createModel(base, true, false);
        }

        const { project, shortName, folder, level } = base;
        const key = mls.stor.getKeyToFiles(project, base.level, shortName, folder, ext);
        let stor = mls.stor.files[key];

        if (!stor) {

            const param: IReqCreateStorFile = {
                project,
                shortName,
                folder,
                level,
                extension: '.ts',
                source: '',
                status: 'new'
            }

            if (ext === '.less') {
                const templateLess = await getBaseTemplate({ folder, shortName, project, extension: '.less' }, 'enhancementStyle');
                return createStorFile({ ...param, extension: '.less', source: templateLess }, true, true, false)
            }

            if (ext === '.html') {
                const templateHTML = await getBaseTemplate({ folder, shortName, project, extension: '.html' });
                return createStorFile({ ...param, extension: '.html', source: templateHTML }, true, true, false)
            }


        } else {
            await createModel(stor, true, false);
        }


    }




}