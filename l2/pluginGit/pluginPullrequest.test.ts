/// <mls fileReference="_100555_/l2/pluginGit/pluginPullrequest.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify, overrideMls } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginPullrequest } from '/_100555_/l2/pluginGit/pluginPullrequest.js';

import '/_100555_/l2/pluginGit/pluginPullrequest.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-git--plugin-pullrequest-100555';

// Fake project number, different from mls.stor.LOCALPROJECTNUMBER, used only after mount
// (never during firstUpdated) so we never hit the real getMyKeysBranch() dependency.
const FAKE_PROJECT = 999123;

function fakeDriver(itens: any[] = [], errorMessage?: string) {
    return {
        listPullRequests: async (_owner: string, _repo: string) => {
            if (errorMessage) throw new Error(errorMessage);
            return itens;
        },
    } as any;
}

export const tests: IPluginTestCase[] = [

    
];

