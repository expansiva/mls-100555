/// <mls fileReference="_100555_/l2/utils/tsTestMonaco.ts" enhancement="_102027_/l2/enhancementLit" />

const _editor = Symbol("ignoredProperty");


/**
 * class to interface with monaco models
 */
export class MonacoDriver {

    [_editor]: monaco.editor.IStandaloneCodeEditor | undefined;

    constructor(editor: monaco.editor.IStandaloneCodeEditor) {
        this[_editor] = editor;
    }

    public getLines(model: monaco.editor.ITextModel): string[] {
        const lines: string[] = model.getLinesContent();
        return lines;
    }

    public replaceLines(model: monaco.editor.ITextModel, lineNrInit: number, lineNrInitEnd: number, newContent: string): boolean {
        if (lineNrInit < 1 || lineNrInitEnd < lineNrInit || lineNrInitEnd > model.getLineCount()) {
            console.warn('Invalid line range.');
            return false;
        }

        const startColumn = 1;
        const endColumn = model.getLineContent(lineNrInitEnd).length + 1;
        const range = new monaco.Range(lineNrInit, startColumn, lineNrInitEnd, endColumn);
        const text = newContent.endsWith('\n') ? newContent : `${newContent}\n`;
        model.pushEditOperations([], [{ range, text, forceMoveMarkers: true }], () => null);
        return true;
    }


    /**
     * Inserts a new line at a specified line number.
     * Returns true if the operation is successful.
     */
    public insertLine(model: monaco.editor.ITextModel, lineNr: number, line: string): boolean {
        model.pushEditOperations(
            [], // Undo stack will automatically handle this.
            [{ range: new monaco.Range(lineNr, 1, lineNr, 1), text: line + '\n', forceMoveMarkers: true }],
            () => null
        );
        return true;
    }

    /**
     * Deletes a specified line number.
     * Returns true if the operation is successful.
     */
    public deleteLine(model: monaco.editor.ITextModel, lineNr: number): boolean {
        return this.deleteLines(model, lineNr, 1);
    }

    /**
     * Deletes a specified line numbers.
     * Returns true if the operation is successful.
     */
    public deleteLines(model: monaco.editor.ITextModel, startLine: number, countLines: number): boolean {
        model.pushEditOperations(
            [],
            [{ range: new monaco.Range(startLine, 1, startLine + countLines, 1), text: '', forceMoveMarkers: true }],
            () => null
        );
        return true;
    }

    /**
     * Updates a specified line at a particular column.
     * Returns true if the operation is successful.
     */
    public updateLine(model: monaco.editor.ITextModel, lineNr: number, columnNr: number, newText: string): boolean {

        const lineContent = model.getLineContent(lineNr);
        const startColumn = columnNr;
        const endColumn = lineContent.length + 1;;

        model.pushEditOperations(
            [],
            [{
                range: new monaco.Range(lineNr, startColumn, lineNr, endColumn),
                text: newText,
                forceMoveMarkers: true
            }],
            () => null
        );

        const newLineContent = model.getLineContent(lineNr);
        const newEndColumn = newLineContent.length + 1;;

        // if (this[_editor]) {
        //     this[_editor].setSelection(
        //         new monaco.Selection(lineNr, 1, lineNr, newEndColumn)
        //     );
        // }

        return true;
    }

    /**
     * Moves the editor's cursor to the specified lines, selects the text between them, 
     * and scrolls the editor to bring the selection into view.
     *
     * @param {monaco.editor.ITextModel} model - The text model associated with the editor.
     * @param {number} start - The starting line number for the selection.
     * @param {number} end - The ending line number for the selection.
     *
     * @returns {void}
     */
    public goTo(model: monaco.editor.ITextModel, start: number, end: number): void {
        const endContent = model.getLineContent(end);
        const newEndColumn = endContent.length + 1;
        if (this[_editor]) {
            const selection = new monaco.Selection(start, 1, end, newEndColumn);
            this[_editor].setSelection(selection);
            this[_editor].revealRangeInCenter(selection);
        }
    }

    /**
     * Finalizes the current edit operation group, allowing all previous
     * changes to be undone as a single action.
     */
    public finishEdit = (model: monaco.editor.ITextModel): void => {
        model.pushStackElement(); // Marks the end of a grouped edit
    }

}

