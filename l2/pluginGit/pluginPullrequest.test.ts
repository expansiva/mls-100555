/// <mls fileReference="_100555_/l2/pluginGit/pluginPullrequest.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify, overrideMls } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginPullrequest } from '/_100555_/l2/pluginGit/pluginPullrequest.js';

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

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testRenderNoItens', env: 'browser', params: [
        { expected: { header: 'Open pull requests', body: 'No open pull requests' } },
    ]},

    { functionName: 'testInitInfoProjectLocalGuard', env: 'browser', params: [
        { expected: { branch: '', owner: '', repo: '' } },
    ]},

    { functionName: 'testLoadListPullRequestLocalGuard', env: 'browser', params: [
        { expected: { itensLength: 0 } },
    ]},

    { functionName: 'testLoadListPullRequestSuccess', env: 'browser', params: [
        { input: { itens: [
            { id: '1', title: 'Add dark mode', url: 'https://github.com/acme/repo/pull/1', body: '', state: 'open', mergedAt: '', closedAt: '', createdAt: '2026-01-01', author: { login: 'alice' } },
            { id: '2', title: 'Fix crash', url: 'https://github.com/acme/repo/pull/2', body: '', state: 'open', mergedAt: '', closedAt: '', createdAt: '2026-01-02', author: { login: 'bob' } },
        ] },
          expected: { itensLength: 2, listText: 'Add dark mode (alice) Fix crash (bob)' } },
    ]},

    { functionName: 'testLoadListPullRequestError', env: 'browser', params: [
        { input: { errorMessage: 'boom' }, expected: { error: 'boom', showsErrorInRed: true } },
    ]},
];

export async function testSmoke(testCase: { expected: any }): Promise<string> {
    try {
        // Keep firstUpdated's initInfoProject()/loadListPullRequest() as a no-op (LOCALPROJECTNUMBER guard).
        overrideMls({ actualProject: mls.stor.LOCALPROJECTNUMBER });
        const result = await mountAndVerify(TAG, { scope: 'dashboard' });
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testRenderNoItens(testCase: { expected: any }): Promise<string> {
    try {
        overrideMls({ actualProject: mls.stor.LOCALPROJECTNUMBER });
        const el = await mount<PluginPullrequest>(TAG, { scope: 'dashboard' });
        const result = {
            header: query(el, 'h3')?.textContent?.trim(),
            body: query(el, 'h4')?.textContent?.trim(),
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

// initInfoProject() is fired (unawaited) from firstUpdated(); when the actual project is the
// local project number it must return immediately, leaving branch/owner/repo untouched ('').
export async function testInitInfoProjectLocalGuard(testCase: { expected: any }): Promise<string> {
    try {
        overrideMls({ actualProject: mls.stor.LOCALPROJECTNUMBER });
        const el = await mount<PluginPullrequest>(TAG, { scope: 'dashboard' });
        await el.initInfoProject();
        const result = { branch: (el as any).branch, owner: (el as any).owner, repo: (el as any).repo };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

// loadListPullRequest() also guards on LOCALPROJECTNUMBER and returns before ever touching the driver.
export async function testLoadListPullRequestLocalGuard(testCase: { expected: any }): Promise<string> {
    try {
        overrideMls({ actualProject: mls.stor.LOCALPROJECTNUMBER });
        const el = await mount<PluginPullrequest>(TAG, { scope: 'dashboard' });
        await el.loadListPullRequest();
        const result = { itensLength: (el as any).itens.length };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testLoadListPullRequestSuccess(testCase: { input: { itens: any[] }; expected: any }): Promise<string> {
    try {
        // Mount while still "local" so firstUpdated's implicit initInfoProject()/loadListPullRequest() stay no-ops.
        overrideMls({ actualProject: mls.stor.LOCALPROJECTNUMBER });
        const el = await mount<PluginPullrequest>(TAG, { scope: 'dashboard' });

        // Now switch to a "real" project + mocked driver, and call loadListPullRequest() directly
        // (firstUpdated already ran, so this never re-triggers the getMyKeysBranch() dependency).
        overrideMls({
            actualProject: FAKE_PROJECT,
            stor: { ...mls.stor, others: { ...mls.stor.others, getDefaultDriver: () => fakeDriver(testCase.input.itens) } },
        });

        await el.loadListPullRequest();
        const items = query(el, 'ul')?.querySelectorAll('li') ?? [];
        const listText = Array.from(items).map((li) => li.textContent?.replace(/\s+/g, ' ').trim()).join(' ');
        const result = { itensLength: (el as any).itens.length, listText };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

// render() has a side effect while an error is set: it schedules `this.error = ''` via setTimeout(9900ms).
// That's a real quirk (a supposedly-pure render() mutating state) — documented here, not fixed.
export async function testLoadListPullRequestError(testCase: { input: { errorMessage: string }; expected: any }): Promise<string> {
    try {
        overrideMls({ actualProject: mls.stor.LOCALPROJECTNUMBER });
        const el = await mount<PluginPullrequest>(TAG, { scope: 'dashboard' });

        overrideMls({
            actualProject: FAKE_PROJECT,
            stor: { ...mls.stor, others: { ...mls.stor.others, getDefaultDriver: () => fakeDriver([], testCase.input.errorMessage) } },
        });

        await el.loadListPullRequest();
        const errorHeader = query(el, 'h4') as HTMLElement | null;
        const result = {
            error: (el as any).error,
            showsErrorInRed: !!errorHeader && errorHeader.style.color === 'red' && errorHeader.textContent?.trim() === testCase.input.errorMessage,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}
