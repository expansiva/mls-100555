/// <mls fileReference="_100555_/l2/pluginExplore/mlsFileTree2.ts" enhancement="_102027_/l2/enhancementLit"/>

import { html, nothing, TemplateResult } from 'lit';
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
    file: mls.stor.IFileInfo;
}

const ICON_CHEVRON = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="currentColor" d="M5.7 13.7 5 13l4.6-4.6L5 3.7l.7-.7 5.3 5.4-5.3 5.3z"/></svg>`;
const ICON_UNDO = html`<svg xmlns="http://www.w3.org/2000/svg" style="width:13px; pointer-events:none;" viewBox="0 0 512 512"><path d="M125.7 160H176c17.7 0 32 14.3 32 32s-14.3 32-32 32H48c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32s32 14.3 32 32v51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z"/></svg>`;
const ICON_TRASH = html`<svg xmlns="http://www.w3.org/2000/svg" style="width:13px; pointer-events:none;" viewBox="0 0 640 640"><path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z"/></svg>`;
const ICON_FOLDER_CLOSED = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="#dcb67a" d="M14.5 4H7.7l-1-1H1.5l-.5.5v9l.5.5h13l.5-.5v-8l-.5-.5zM14 12H2V4h4.3l1 1H14v7z"/></svg>`;
const ICON_FOLDER_OPEN = html`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="#dcb67a" d="M1.5 13h11l.48-.37 2.63-7-.48-.63H14V4l-.5-.5H7.71l-.86-1L6.5 2h-5l-.5.5v10l.5.5zM2 3h4.29l.86 1 .35.5H13v.5H8.5l-.35.15-.86.85H3.5l-.47.34-1.03 3V3zm10.13 9H2.19l1.67-5H14.4l-2.27 5z"/></svg>`;

@customElement('plugin-explore--mls-file-tree2-100555')
export class MlsFileTree2 extends CollabLitElement {

    @property() position: string | undefined;
    @property() project: string | undefined;
    @property() filter: string = '';
    @property({ type: Object }) files: Record<string, FileInfo> = {};
    @state() private expanded: Set<string> = new Set();
    @state() private selected: string = '';
    @state() private _loading = false;
    @state() private _loadingMsg = '';

    firstUpdated() {
        this.project = this.project ? this.project : (mls.actualProject || 0).toString();
    }

    render() {
        const src = Object.keys(this.files).length > 0 ? this.files : mls.stor.files ?? {};

        if (Object.keys(src).length === 0) {
            this.files = src;
            return html`
                ${this._renderOverlay()}
                <div class="empty-msg">Nenhum arquivo encontrado em mls.stor.files</div>
            `;
        }

        if (this.files !== src) this.files = src;

        const content = this.filter
            ? this.renderFiltered(src)
            : html`<div class="tree-root">${this.buildTree().children.map(c => this.renderNode(c, 0))}</div>`;

        return html`<div style="position:relative;height:100%">${this._renderOverlay()}${content}</div>`;
    }

    private _renderOverlay() {
        if (!this._loading) return nothing;
        return html`
            <style>@keyframes mft2-spin{100%{transform:rotate(360deg)}}</style>
            <div style="position:absolute;inset:0;background:rgba(0,0,0,.55);z-index:99999;display:flex;align-items:center;justify-content:center">
                <div style="background:var(--surface-alt-bg,#252526);border-radius:10px;padding:1.75rem 2.5rem;display:flex;flex-direction:column;align-items:center;gap:1rem;min-width:240px;box-shadow:0 8px 32px rgba(0,0,0,.6)">
                    <div style="width:38px;height:38px;border:4px solid rgba(255,255,255,.15);border-top-color:#4fa3e0;border-radius:50%;animation:mft2-spin .75s linear infinite"></div>
                    <span style="color:var(--text-default,#ccc);font-size:.9rem;text-align:center;white-space:pre-wrap">${this._loadingMsg}</span>
                </div>
            </div>
        `;
    }

    // ------------------------------------------------------------------ filter

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
            return html`<div class="empty-msg">Sem resultados para "<strong>${this.filter}</strong>"</div>`;
        }

        return html`<div class="tree-root">${matches.map(file => {
            const key = mls.stor.getKeyToFile(file);
            const fullName = (file.folder ? file.folder + '/' : '') + file.shortName + file.extension;
            const highlighted = this.highlightText(fullName, term);
            return html`
                <div class="row file ${this.selected === key ? 'selected' : ''}"
                    .myFile=${file}
                    @click=${() => this.selectFile(key, file)}>
                    <span class="twistie hidden"></span>
                    <span class="icon ${this.extClass(file.extension)}"></span>
                    <span class="label" .innerHTML=${highlighted}></span>
                </div>
            `;
        })}</div>`;
    }

    private highlightText(text: string, term: string): string {
        const idx = text.toLowerCase().indexOf(term);
        if (idx < 0) return text;
        return (
            text.slice(0, idx) +
            `<mark class="filter-mark">${text.slice(idx, idx + term.length)}</mark>` +
            text.slice(idx + term.length)
        );
    }

    // ------------------------------------------------------------------ tree render

    private renderIndent(depth: number) {
        return Array.from({ length: depth }, () => html`<span class="indent"></span>`);
    }

    private renderNode(node: TreeNode, depth: number): TemplateResult {
        if (!node.isFolder) return this.renderFile(node, depth);

        const isOpen = this.expanded.has(node.fullPath);

        return html`
            <div class="row folder" @click=${() => this.toggleExpand(node.fullPath)}>
                ${this.renderIndent(depth)}
                <span class="twistie ${isOpen ? 'open' : ''}">${ICON_CHEVRON}</span>
                <span class="icon folder-icon">${isOpen ? ICON_FOLDER_OPEN : ICON_FOLDER_CLOSED}</span>
                <span class="label">${node.name}</span>
                <span class="folder-action folder-action-undo" title="undo all this folder" @click=${(e: MouseEvent) => { e.stopPropagation(); e.preventDefault(); this.undoAllByFolders(node); }}>${ICON_UNDO}</span>
                <span class="folder-action folder-action-del" title="delete all this folder" @click=${(e: MouseEvent) => { e.stopPropagation(); e.preventDefault(); this.delAllByFolders(node); }}>${ICON_TRASH}</span>
            </div>
            ${isOpen ? node.children.map(c => this.renderNode(c, depth + 1)) : nothing}
        `;
    }

    private renderFile(node: TreeNode, depth: number): TemplateResult {
        const file = node.file;
        const isSelected = this.selected === node.fileKey;

        let badges = '';

        const titleLocalStorage = this.getTitleInLocalStorage(file);
        if (titleLocalStorage) {
            badges += `<span title=" ${titleLocalStorage} in localstorage" class="fa fa-location-dot badge badge-storage"></span>`;
        }
        if (file.hasError) {
            badges += `<span title="bug" class="fa fa-bug badge badge-bug"></span>`;
        }
        if (file.isLocalVersionOutdated) {
            badges += `<span title="need conciliation" class="fa fa-unbalanced badge badge-version"></span>`;
        }

        return html`
            <div class="row file ${isSelected ? 'selected' : ''}"
                .myFile=${file}
                @click=${() => this.selectFile(node.fileKey!, file)}>
                ${this.renderIndent(depth)}
                <span class="twistie hidden"></span>
                <span class="icon ${this.extClass(file.extension)}"></span>
                <span class="label ${file.status === 'deleted' ? 'deleted' : ''}">${node.name}</span>
                ${badges ? html`<span class="badges" .innerHTML=${badges}></span>` : nothing}
                <span class="actions">
                    <span class="action" title="Undo" @click=${(e: MouseEvent) => { e.stopPropagation(); this.undoFile(file); }}>${ICON_UNDO}</span>
                    <span class="action" title="Delete" @click=${(e: MouseEvent) => { e.stopPropagation(); this.deleteFile(file); }}>${ICON_TRASH}</span>
                </span>
            </div>
        `;
    }

    private extClass(ext: string): string {
        switch ((ext || '').toLowerCase()) {
            case '.ts': return 'ext-ts';
            case '.js': return 'ext-js';
            case '.json': return 'ext-json';
            case '.html': return 'ext-html';
            case '.less': return 'ext-less';
            case '.css': return 'ext-css';
            case '.md': return 'ext-md';
            default: return 'ext-other';
        }
    }

    // ------------------------------------------------------------------ actions

    private async deleteFile(file: mls.stor.IFileInfo) {
        if (!window.confirm(`Delete: ${file.shortName}${file.extension}?`)) return;
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

    // ------------------------------------------------------------------ tree build

    private buildTree(): TreeNode {
        const root: TreeNode = { name: '', fullPath: '', isFolder: true, children: [], file: {} as mls.stor.IFileInfo };

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

    private toggleExpand(path: string) {
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

    // ------------------------------------------------------------------ folder batch actions

    // Collect all file descendants under a tree node (recurses subfolders).
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

    // ------------------------------------------------------------------ open / events

    private fireEventsDetails(stor: mls.stor.IFileInfo) {
        const key = mls.stor.getKeyToFile(stor);

        const options = {
            shortName: undefined,
            project: undefined,
            htmlText: '<plugin-view--plugin-view-file-100555 nameFile="' + key + '"></plugin-view--plugin-view-file-100555>'
        };

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
            mls.actual[lv as any][this.position as ('right' | 'left')] = file;

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
            };

            if (ext === '.less') {
                const templateLess = await getBaseTemplate({ folder, shortName, project, extension: '.less' }, 'enhancementStyle');
                return createStorFile({ ...param, extension: '.less', source: templateLess }, true, true, false);
            }

            if (ext === '.html') {
                const templateHTML = await getBaseTemplate({ folder, shortName, project, extension: '.html' });
                return createStorFile({ ...param, extension: '.html', source: templateHTML }, true, true, false);
            }

        } else {
            await createModel(stor, true, false);
        }

    }

}
