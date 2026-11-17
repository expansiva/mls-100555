/// <mls fileReference="_100555_/l2/pluginNewFile/pluginNewFileTemplates.test.ts" enhancement="_blank" />

import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MLS_BASE = path.resolve(HERE, '../../..');
const CALL = /getTemplateImport\(\s*(\d+)\s*,\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]*)['"]\s*\)/g;

function modelFiles(): string[] {
    return readdirSync(HERE)
        .filter((name) => /^pluginNewFile.*\.ts$/.test(name))
        .filter((name) => !name.endsWith('.test.ts') && !name.endsWith('.defs.ts'))
        .sort();
}

function sourceFromCall(project: string, shortName: string, folder: string): string {
    const rel = folder ? path.join(folder, `${shortName}.ts`) : `${shortName}.ts`;
    return path.join(MLS_BASE, `mls-${project}`, 'l2', rel);
}

test('pluginNewFile* templates: getTemplateImport aponta para arquivo que existe', () => {
    const missing: string[] = [];
    for (const file of modelFiles()) {
        const text = readFileSync(path.join(HERE, file), 'utf8');
        for (const match of text.matchAll(CALL)) {
            const project = match[1];
            const shortName = match[2];
            const folder = match[3];
            const src = sourceFromCall(project, shortName, folder);
            if (!existsSync(src)) {
                const generated = folder
                    ? `/_${project}_/l2/${folder}/${shortName}.js`
                    : `/_${project}_/l2/${shortName}.js`;
                missing.push(`${file}: ${generated}`);
            }
        }
    }
    assert.equal(missing.length, 0, missing.join('\n'));
});

test('modelo de agente importa IAgentAsync, IAgentMeta e finishClarification de 102027', () => {
    const text = readFileSync(path.join(HERE, 'pluginNewFileAgent.ts'), 'utf8');
    const calls = [...text.matchAll(CALL)].map((m) => ({
        project: m[1],
        shortName: m[2],
        folder: m[3],
    }));
    const base = calls.filter((c) => c.shortName === 'aiAgentBase');
    const orch = calls.filter((c) => c.shortName === 'aiAgentOrchestration');
    assert.equal(base.length, 3);
    assert.equal(orch.length, 1);
    for (const c of [...base, ...orch]) {
        assert.equal(c.project, '102027');
        assert.equal(c.folder, '');
    }

    const baseSrc = readFileSync(path.join(MLS_BASE, 'mls-102027', 'l2', 'aiAgentBase.ts'), 'utf8');
    const orchSrc = readFileSync(path.join(MLS_BASE, 'mls-102027', 'l2', 'aiAgentOrchestration.ts'), 'utf8');
    assert.match(baseSrc, /export type IAgentAsync\b/);
    assert.match(baseSrc, /export type IAgentMeta\b/);
    assert.match(orchSrc, /export async function finishClarification\b/);
});
