/// <mls fileReference="_100555_/l2/pluginStyle/pluginLessPseudo.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginLessPseudo, tags, getDescription } from '/_100555_/l2/pluginStyle/pluginLessPseudo.js';

const TAG = 'plugin-style--plugin-less-pseudo-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // pluginLessPseudo has no state/props - it's a static reference card (pseudo-classes + pseudo-elements)
    // whose only real behavior is rendering the i18n text. Checks a couple of representative entries.
    { functionName: 'testRendersReferenceList', env: 'browser', params: [
        { expected: { hasFocusEntry: true, hasBeforeEntry: true, pseudoClassCount: 15, pseudoElementCount: 7 } },
    ]},

    // getDescription() reads document.documentElement.lang, so it needs a real DOM - kept in 'browser'.
    { functionName: 'testPluginInfo', env: 'browser', params: [
        { expected: { tags: ['pseudo:*'], descriptionIsString: true } },
    ]},
];

export async function testSmoke(testCase: { expected: any }): Promise<string> {
    try {
        const result = await mountAndVerify(TAG);
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testRendersReferenceList(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginLessPseudo>(TAG);
        const text = el.textContent || '';
        const result = {
            hasFocusEntry: text.includes(':focus'),
            hasBeforeEntry: text.includes('::before'),
            pseudoClassCount: el.querySelectorAll('ul')[0]?.querySelectorAll('li').length ?? 0,
            pseudoElementCount: el.querySelectorAll('ul')[1]?.querySelectorAll('li').length ?? 0,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testPluginInfo(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginLessPseudo>(TAG);
        const result = {
            tags,
            descriptionIsString: typeof getDescription() === 'string',
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}
