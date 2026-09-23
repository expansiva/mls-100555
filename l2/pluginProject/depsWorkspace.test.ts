/// <mls fileReference="_100555_/l2/pluginProject/depsWorkspace.test.ts" enhancement="_blank" />

import assert from 'node:assert/strict';
import test from 'node:test';

import {
    applyWorkspaceDependencies,
    gitHubRepoApiUrl,
    resolveAddDependency,
    saveWorkspaceDependencies,
    type FetchLike,
    type IDependencyRef,
    type IStorFileLike,
} from '/_100555_/l2/pluginProject/depsWorkspace.js';

// The real shape of mls-102050/l5/config.json: workspaceDependencies is an ARRAY, and
// `projects` is the independent release fecho that must come out untouched.
const CONFIG = `${JSON.stringify({
    projectSettings: { driver: 'vm', url: 'https://github.com/main/expansiva/mls-102050' },
    workspaceDependencies: ['102020', '102021'],
    projects: {
        102020: { root: '../mls-102020', type: 'lib' },
        102050: { root: '.', type: 'client' },
    },
    defaultProjectId: '102050',
}, null, 2)}\n`;

/** A fetch that never reaches the network and records what it was asked. */
function stubFetch(status: number, seen: string[] = []): FetchLike {
    return async (url: string) => {
        seen.push(url);
        return { status };
    };
}

function storFile(content: string): IStorFileLike & { written: string[] } {
    return {
        inLocalStorage: true,
        status: 'unchanged',
        written: [],
        async getContent() { return content; },
    };
}

// ---- 1. a forma array sobrevive ----

test('array de entrada vira array de saída, com o id novo no fim e sem duplicata', () => {
    const { content, changed } = applyWorkspaceDependencies(CONFIG, [102020, 102021, 102051, 102051]);
    const workspaceDependencies = JSON.parse(content).workspaceDependencies;

    assert.equal(changed, true);
    assert.ok(Array.isArray(workspaceDependencies), 'projectInit exige Array.isArray');
    assert.deepEqual(workspaceDependencies, ['102020', '102021', '102051']);
});

// ---- 2. a regressão de índice ----

test('o length é o número de dependências, não o maior id', () => {
    const { content } = applyWorkspaceDependencies(CONFIG, [102020, 102021, 102051]);
    const workspaceDependencies = JSON.parse(content).workspaceDependencies;

    // Tratar o array como mapa gravaria wd["102051"] na POSIÇÃO 102051: length 102052,
    // ~1 MB de null. É a regressão que esta asserção existe para pegar.
    assert.equal(workspaceDependencies.length, 3);
});

// ---- 3. o `projects` não é tocado ----

test('o projects sai byte a byte igual ao que entrou', () => {
    const { content } = applyWorkspaceDependencies(CONFIG, [102020, 102051]);

    const antes = JSON.stringify(JSON.parse(CONFIG).projects);
    const depois = JSON.stringify(JSON.parse(content).projects);
    assert.equal(depois, antes);

    // e o arquivo inteiro conserva formato: indentação 2 e a quebra final.
    assert.ok(content.endsWith('\n'));
    assert.equal(content, `${JSON.stringify(JSON.parse(content), null, 2)}\n`);
});

test('remover uma dependência tira só ela, e sem mudança nada é reescrito', () => {
    const removida = applyWorkspaceDependencies(CONFIG, [102020]);
    assert.deepEqual(JSON.parse(removida.content).workspaceDependencies, ['102020']);

    const igual = applyWorkspaceDependencies(CONFIG, [102020, 102021]);
    assert.equal(igual.changed, false);
});

// ---- 4. o mlsDep.json não é escrito ----

test('saveWorkspaceDependencies escreve UM arquivo só — o l5/config.json', async () => {
    const file = storFile(CONFIG);
    const escritos: IStorFileLike[][] = [];

    const gravou = await saveWorkspaceDependencies({
        file,
        deps: [102020, 102021, 102051],
        setContent: async (_f, value) => { file.written.push(value.content); },
        setContents: async (files) => { escritos.push(files); },
        message: 'deps',
    });

    assert.equal(gravou, true);
    assert.equal(file.written.length, 1, 'um único arquivo gravado');
    assert.equal(escritos.length, 1);
    assert.equal(escritos[0].length, 1, 'nenhum mlsDep.json vai junto');
});

// ---- 5. id já presente ----

test('id já presente é recusado, nada é gravado e setContents não é chamado', async () => {
    // a lista de partida espelha o CONFIG: se a recusa preserva a lista, o save é no-op
    const deps: IDependencyRef[] = [
        { id: 102020, name: 'Aura', auth: 'public' },
        { id: 102021, name: 'X', auth: 'public' },
    ];
    const seen: string[] = [];

    const result = await resolveAddDependency({
        newDepId: 102021,
        project: 102050,
        deps,
        getProjectDetails: () => undefined,
        orgName: 'expansiva',
        fetchImpl: stubFetch(200, seen),
    });

    assert.equal(result.status, 'errorAlready');
    assert.equal(result.deps, deps, 'a lista não muda');
    assert.deepEqual(seen, [], 'nem chega a consultar o GitHub');

    const file = storFile(CONFIG);
    const escritos: IStorFileLike[][] = [];
    await saveWorkspaceDependencies({
        file,
        deps: result.deps.map(d => d.id),
        setContent: async (_f, value) => { file.written.push(value.content); },
        setContents: async (files) => { escritos.push(files); },
        message: 'deps',
    });
    assert.deepEqual(escritos, [], 'setContents não é chamado');
});

// ---- 6. GitHub responde 404 ----

test('404 no GitHub recusa, não grava e não chama setContents', async () => {
    const deps: IDependencyRef[] = [
        { id: 102020, name: 'Aura', auth: 'public' },
        { id: 102021, name: 'X', auth: 'public' },
    ];
    const seen: string[] = [];

    const result = await resolveAddDependency({
        newDepId: 999999,
        project: 102050,
        deps,
        getProjectDetails: () => undefined,
        orgName: 'expansiva',
        fetchImpl: stubFetch(404, seen),
    });

    assert.equal(result.status, 'errorInvalid');
    assert.equal(result.deps, deps);
    assert.deepEqual(seen, ['https://api.github.com/repos/expansiva/mls-999999']);

    const file = storFile(CONFIG);
    const escritos: IStorFileLike[][] = [];
    await saveWorkspaceDependencies({
        file,
        deps: result.deps.map(d => d.id),
        setContent: async (_f, value) => { file.written.push(value.content); },
        setContents: async (files) => { escritos.push(files); },
        message: 'deps',
    });
    assert.deepEqual(escritos, [], 'setContents não é chamado');
});

// ---- 7. GitHub responde 200 para id que o host não conhece ----

test('200 para id desconhecido do host: aceito, gravado, setContents uma vez com inLocalStorage false', async () => {
    const seen: string[] = [];

    const result = await resolveAddDependency({
        newDepId: 102051,
        project: 102050,
        deps: [{ id: 102020, name: 'Aura', auth: 'public' }],
        getProjectDetails: () => undefined,
        orgName: 'expansiva',
        fetchImpl: stubFetch(200, seen),
    });

    assert.equal(result.status, 'added');
    assert.deepEqual(seen, ['https://api.github.com/repos/expansiva/mls-102051']);
    assert.deepEqual(result.deps[1], { id: 102051, name: 'mls-102051', auth: '', unknown: true });

    const file = storFile(CONFIG);
    const escritos: IStorFileLike[][] = [];
    const gravou = await saveWorkspaceDependencies({
        file,
        deps: result.deps.map(d => d.id),
        setContent: async (_f, value) => { file.written.push(value.content); },
        setContents: async (files) => { escritos.push(files); },
        message: 'deps: 102020 102051',
    });

    assert.equal(gravou, true);
    assert.equal(escritos.length, 1, 'setContents chamado UMA vez');
    assert.equal(escritos[0][0].inLocalStorage, false, 'readFilePayload conta com isto');
    assert.equal(escritos[0][0].status, 'changed');
    assert.deepEqual(JSON.parse(file.written[0]).workspaceDependencies, ['102020', '102051']);
});

// ---- 8. o orgName não é literal no código ----

test('a URL consultada usa o orgName recebido, não um literal', async () => {
    const seen: string[] = [];

    await resolveAddDependency({
        newDepId: 102051,
        project: 102050,
        deps: [],
        getProjectDetails: () => undefined,
        orgName: 'outraOrg',
        fetchImpl: stubFetch(200, seen),
    });

    assert.deepEqual(seen, ['https://api.github.com/repos/outraOrg/mls-102051']);
    assert.ok(!seen[0].includes('expansiva'));

    // a mesma montagem do makeDefaultRepo do resolveDeps: org + mls-<id>
    assert.equal(gitHubRepoApiUrl('expansiva', 102050), 'https://api.github.com/repos/expansiva/mls-102050');
});

// ---- o gate que já existia continua de pé ----

test('os três guards antigos continuam recusando antes de qualquer rede', async () => {
    const seen: string[] = [];
    const base = {
        project: 102050,
        deps: [] as IDependencyRef[],
        getProjectDetails: () => undefined,
        orgName: 'expansiva',
        fetchImpl: stubFetch(200, seen),
    };

    assert.equal((await resolveAddDependency({ ...base, newDepId: null })).status, 'errorNull');
    assert.equal((await resolveAddDependency({ ...base, newDepId: 102050 })).status, 'errorSame');
    assert.deepEqual(seen, [], 'nenhum guard antigo sai para a rede');
});

test('dependência marcada como removida volta pelo mesmo id, sem consultar o GitHub', async () => {
    const seen: string[] = [];

    const result = await resolveAddDependency({
        newDepId: 102021,
        project: 102050,
        deps: [{ id: 102021, name: 'X', auth: 'public', removed: true }],
        getProjectDetails: () => undefined,
        orgName: 'expansiva',
        fetchImpl: stubFetch(404, seen),
    });

    assert.equal(result.status, 'restored');
    assert.equal(result.deps[0].removed, false);
    assert.deepEqual(seen, []);
});

test('quando o host conhece o projeto, o GitHub não é consultado', async () => {
    const seen: string[] = [];

    const result = await resolveAddDependency({
        newDepId: 102025,
        project: 102050,
        deps: [],
        getProjectDetails: (id) => ({ id, name: 'Collab Messages', userAuth: 'public' }),
        orgName: 'expansiva',
        fetchImpl: stubFetch(404, seen),
    });

    assert.equal(result.status, 'added');
    assert.deepEqual(result.deps, [{ id: 102025, name: 'Collab Messages', auth: 'public' }]);
    assert.deepEqual(seen, []);
});
