/// <mls fileReference="_100555_/l2/pluginEditL3/pluginEditStyleAST.ts" enhancement="_102027_/l2/enhancementLit" />

type Block = { start: number; end: number };

export class LessAST {

    private model: monaco.editor.ITextModel;
    public selected: string | null = null;
    public blocks: Map<string, Block> = new Map();
    public rules: Record<string, string> | null | undefined;

    constructor(model: monaco.editor.ITextModel) {
        this.model = model;
        this.reparse();
    }

    // ====== API pública ======
    public select(selector: string) {
        this.reparse();
        const blk = this.blocks.get(selector);
        if (!blk) return null;

        this.selected = selector;
        this.rules = this.getRules(selector);
        return true;
    }

    public setRule(property: string, value: string): void {
        if (!this.selected) throw new Error("Nenhum seletor selecionado.");
        this.reparse();

        const blk = this.blocks.get(this.selected);
        if (!blk) throw new Error(`Seletor '${this.selected}' não encontrado.`);

        const lines = this.model.getValue().split(/\r?\n/);
        const propRegex = new RegExp(`^\\s*${this.escape(property)}\\s*:\\s*(.*?);?\\s*$`);

        let propLineIdx: number | null = null;

        for (let i = blk.start + 1; i < blk.end; i++) {
            const noComments = this.stripComments(lines[i]);
            if (propRegex.test(noComments)) {
                propLineIdx = i;
                break;
            }
        }

        // 🔥 se valor vazio → remover propriedade
        if (!value || value.trim() === "") {
            if (propLineIdx !== null) {
                lines.splice(propLineIdx, 1);
                this.model.setValue(lines.join("\n"));
            }
            return;
        }

        const indentMatch = lines[blk.start].match(/^(\s*)/);
        const indent = (indentMatch ? indentMatch[1] : "") + "    ";

        const newLine = `${indent}${property}: ${value};`;

        if (propLineIdx !== null) {
            // substitui
            lines[propLineIdx] = newLine;
        } else {
            // adiciona
            lines.splice(blk.start + 1, 0, newLine);
        }

        this.model.setValue(lines.join("\n"));
    }

    public setRule_old(property: string, value: string): void {
        if (!this.selected) throw new Error("Nenhum seletor selecionado.");
        this.reparse();
        const blk = this.blocks.get(this.selected);
        if (!blk) throw new Error(`Seletor '${this.selected}' não encontrado.`);

        const lines = this.model.getValue().split(/\r?\n/);
        const propRegex = new RegExp(`^\\s*${this.escape(property)}\\s*:\\s*(.*?);?\\s*$`);

        let propLineIdx: number | null = null;
        for (let i = blk.start + 1; i < blk.end; i++) {
            const noComments = this.stripComments(lines[i]);
            if (propRegex.test(noComments)) {
                propLineIdx = i;
                break;
            }
        }

        const indentMatch = lines[blk.start].match(/^(\s*)/);
        const indent = (indentMatch ? indentMatch[1] : "") + "    "; // 4 espaços

        const newLine = `${indent}${property}: ${value};`;

        if (propLineIdx !== null) {
            // Substitui a regra existente
            lines[propLineIdx] = newLine;
        } else {
            // Adiciona logo após a abertura {
            lines.splice(blk.start + 1, 0, newLine);
        }

        this.model.setValue(lines.join("\n"));
    }

    public addSelector(selector: string, rules: Record<string, string> = {}): void {
        // garante o caminho aninhado (parent -> child -> ...)
        this.ensureSelectorPath(selector);
        // seleciona e aplica regras
        if (this.select(selector)) {
            for (const [k, v] of Object.entries(rules)) this.setRule(k, v);
        }
    }

    public removeSelector(selector: string): void {
        this.reparse();
        const blk = this.blocks.get(selector);
        if (!blk) return;

        const lines = this.model.getValue().split(/\r?\n/);
        lines.splice(blk.start, blk.end - blk.start + 1);
        this.model.setValue(lines.join("\n"));

        if (this.selected === selector) this.selected = null;
    }

    public getRules(selector: string): Record<string, string> {
        this.reparse();
        const blk = this.blocks.get(selector);
        const out: Record<string, string> = {};
        if (!blk) return out;

        const lines = this.model.getValue().split(/\r?\n/);

        let depth = 0;
        for (let i = blk.start + 1; i < blk.end; i++) {
            const stripped = this.stripComments(lines[i]).trim();
            if (!stripped) continue;

            // Ajusta profundidade
            if (stripped.endsWith("{")) {
                depth++;
                continue;
            }
            if (stripped === "}") {
                depth--;
                continue;
            }

            // Só considera regras no nível 0 (dentro do bloco principal, mas não aninhado)
            if (depth === 0) {
                const m = stripped.match(/^([a-zA-Z-]+)\s*:\s*(.+?);?$/);
                if (m) out[m[1]] = m[2];
            }
        }
        return out;
    }

    public exportSelectorGroupStrict(baseSelector: string): string {
        this.reparse();
        baseSelector = baseSelector.trim();
        if (!baseSelector) return "";

        const parts = baseSelector.split(/\s+/);

        // Se não tiver pai (ex.: "h2"), exporta só o bloco simples
        if (parts.length < 2) {
            if (!this.blocks.has(baseSelector)) return "";
            const rules = this.getRules(baseSelector);
            const props = Object.entries(rules)
                .map(([k, v]) => `\t${k}: ${v};`)
                .join("\n");
            return `${baseSelector} {\n${props}\n}`;
        }

        const parent = parts.slice(0, -1).join(" ");
        const leaf = parts[parts.length - 1];

        const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const allowedLeafPattern = new RegExp(
            `^${escapeRegExp(leaf)}(?:` +
            `:{1,2}[^\\s>+~]+|` +   // :hover, ::after, etc.
            `\\[[^\\]]+\\]|` +      // [disabled], [data-x="y"]
            `[.#][^\\s>+~]+` +      // .class, #id
            `)*$`
        );

        // Seleciona apenas blocos que:
        // 1) começam com "parent "
        // 2) e cujo resto bate com padrão permitido
        const matches: Array<{ selector: string; start: number }> = [];
        for (const [selector, blk] of this.blocks) {
            if (!selector.startsWith(parent + " ")) continue;
            const relative = selector.slice(parent.length + 1);
            if (!allowedLeafPattern.test(relative)) continue;
            matches.push({ selector, start: blk.start });
        }

        // Ordena pela ordem no arquivo
        matches.sort((a, b) => a.start - b.start);

        // Monta o LESS agrupado
        const out: string[] = [];
        out.push(`${parent} {`);
        for (const { selector } of matches) {
            const relative = selector.slice(parent.length + 1);
            out.push(`\t${relative} {`);
            const rules = this.getRules(selector);
            for (const [prop, val] of Object.entries(rules)) {
                out.push(`\t\t${prop}: ${val};`);
            }
            out.push(`\t}`);
        }
        out.push(`}`);

        return out.join("\n");
    }

    // ====== Internos ======
    private reparse(): void {
        this.blocks.clear();
        const lines = this.model.getValue().split(/\r?\n/);
        const stack: Array<{ selector: string; start: number }> = [];
        const path: string[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = this.stripComments(lines[i]);

            const open = line.match(/^\s*(.+?)\s*\{\s*$/);
            if (open) {
                const sel = open[1].trim();
                path.push(sel);
                const full = path.join(" ");
                stack.push({ selector: full, start: i });
                this.blocks.set(full, { start: i, end: i });
                continue;
            }

            if (/^\s*}\s*$/.test(line)) {
                const last = stack.pop();
                if (last) {
                    const blk = this.blocks.get(last.selector);
                    if (blk) this.blocks.set(last.selector, { start: blk.start, end: i });
                    path.pop();
                }
            }
        }
    }

    private ensureSelectorPath(selector: string): void {
        this.reparse();
        const parts = selector.trim().split(/\s+/);
        if (!parts.length) return;

        let parentParts: string[] = [];
        let lines = this.model.getValue().split(/\r?\n/);

        for (let i = 0; i < parts.length; i++) {
            const curPath = [...parentParts, parts[i]].join(" ");
            if (!this.blocks.has(curPath)) {
                // onde inserir?
                let insertAt = lines.length;
                if (parentParts.length > 0) {
                    const parentBlk = this.blocks.get(parentParts.join(" "));
                    insertAt = parentBlk ? parentBlk.end : lines.length;
                }
                const indent = "\t".repeat(i);
                const blockLines = [`${indent}${parts[i]} {`, `${indent}}`];
                lines.splice(insertAt, 0, ...blockLines);
                this.model.setValue(lines.join("\n"));
                // reparse para atualizar offsets e continuar
                this.reparse();
                lines = this.model.getValue().split(/\r?\n/);
            }
            parentParts.push(parts[i]);
        }
    }

    private stripComments(s: string): string {
        return s.replace(/(?<!:)\/\/.*|\/\*[\s\S]*?\*\//g, "");
    }
    private escape(s: string): string {
        return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
}