/// <mls fileReference="_100555_/l2/utils/lessMonaco.ts" enhancement="_blank" />

const _editor = Symbol("ignoredProperty");

/**
 * class to interface with monaco models
 */
export class MonacoDriver {

    [_editor]: monaco.editor.IStandaloneCodeEditor | undefined;

    constructor(editor: monaco.editor.IStandaloneCodeEditor) {
        this[_editor] = editor;
    }

    public getLines = (url: string): string[] => {
        const model = monaco.editor.getModel(monaco.Uri.parse(url));
        if (!model || model.isDisposed()) throw new Error(`invalid model ${url}`);
        const lines: string[] = model.getLinesContent();
        return lines;
    }

    /**
     * Inserts a new line at a specified line number.
     * Returns true if the operation is successful.
     */
    public insertLine = (url: string, lineNr: number, line: string): boolean => {

        const model = monaco.editor.getModel(monaco.Uri.parse(url));
        if (!model || model.isDisposed()) throw new Error(`Invalid model ${url}`);

        const position = new monaco.Position(lineNr, 1);
        model.pushEditOperations(
            [], // Undo stack will automatically handle this.
            [{ range: new monaco.Range(lineNr, 1, lineNr, 1), text: line + '\n', forceMoveMarkers: true }],
            () => null
        );

        if (this[_editor]) {
            this[_editor].setSelection(
                new monaco.Selection(lineNr, 1, lineNr, line.length + 1)
            );
        }

        return true;
    }

    /**
     * Deletes a specified line number.
     * Returns true if the operation is successful.
     */
    public deleteLine = (url: string, lineNr: number): boolean => {
        return this.deleteLines(url, lineNr, 1);
    }

    /**
     * Deletes a specified line numbers.
     * Returns true if the operation is successful.
     */
    public deleteLines = (url: string, startLine: number, countLines: number): boolean => {
        const model = monaco.editor.getModel(monaco.Uri.parse(url));
        if (!model || model.isDisposed()) throw new Error(`Invalid model ${url}`);
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
    public updateLine = (url: string, lineNr: number, columnNr: number, newText: string): boolean => {

        const model = monaco.editor.getModel(monaco.Uri.parse(url));
        if (!model || model.isDisposed()) throw new Error(`Invalid model ${url}`);

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

        if (this[_editor]) {
            this[_editor].setSelection(
                new monaco.Selection(lineNr, 1, lineNr, newEndColumn)
            );
        }

        return true;
    }

    /**
     * Finalizes the current edit operation group, allowing all previous
     * changes to be undone as a single action.
     */
    public finishEdit = (url: string): void => {
        const model = monaco.editor.getModel(monaco.Uri.parse(url));
        if (!model || model.isDisposed()) throw new Error(`Invalid model ${url}`);
        model.pushStackElement(); // Marks the end of a grouped edit
    }

}

