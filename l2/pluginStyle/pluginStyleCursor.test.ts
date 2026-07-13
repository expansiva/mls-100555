/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleCursor.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { getState, setState } from '/_102029_/l2/collabState.js';
// Note: the source file exports its component as `PluginStyleClipath` - the exact same class name
// used by pluginStyleClippath.ts (an apparent copy-paste artifact in the source; not fixed here).
// It is aliased on import so this test file reads unambiguously.
import { PluginStyleClipath as PluginStyleCursor, tags, getDescription } from '/_100555_/l2/pluginStyle/pluginStyleCursor.js';

const TAG = 'plugin-style--plugin-style-cursor-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // Cursor has no per-side gallery `state` object and no lock toggle like Padding/Column - it is a
    // flat list of cursor keywords. handleChangeCss() strips the `cursor:` prefix from the clicked
    // item's `.gallery` string and, after a 100ms debounce, writes it straight into
    // `less.<position>.lessCSS.styles.cursor`. There is no local @property mirroring the current
    // cursor value (unlike paddingTop/columnCount/clipPath), so the only observable effect is the
    // state write itself.
    { functionName: 'testApplyCursor', env: 'browser', params: [
        { input: { presetCss: 'cursor: pointer', presetName: 'pointer' },
          expected: { cursor: 'pointer' } },
        { input: { presetCss: 'cursor: not-allowed', presetName: 'not-allowed' },
          expected: { cursor: 'not-allowed' } },
    ]},

    // Edge case / guard clause: handleChangeCss bails out via `if (!el || !css && !name) return;` when
    // the clicked target carries neither a `.gallery` nor a `.name` value - no timeout is scheduled and
    // `styles.cursor` is never touched.
    { functionName: 'testApplyCursorGuardClause', env: 'browser', params: [
        { expected: { cursorKeyWritten: false } },
    ]},

    // Note: unlike Padding/Clippath/Column, this plugin does not override handleIcaStateChange at all,
    // so there is no reverse "external CSS change -> UI reflects it" path to test here.

    { functionName: 'testPluginInfo', env: 'browser', params: [
        { expected: { tags: ['cursor'], descriptionIsString: true } },
    ]},
];

export async function testSmoke(testCase: { expected: any }): Promise<string> {
    try {
        const result = await mountAndVerify(TAG, { position: 'left' });
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testApplyCursor(testCase: { input: { presetCss: string; presetName: string }; expected: any }): Promise<string> {
    try {
        const styles: Record<string, string> = {};
        setState('less.left.lessCSS.styles', styles);

        const el = await mount<PluginStyleCursor>(TAG, { position: 'left' });

        // Fake gallery item target: handleChangeCss only needs `classList.contains('itemgallery')`
        // truthy plus `.gallery`/`.name` properties (bound via lit `.gallery=`/`.name=` in renderGallery).
        const fakeTarget: any = {
            classList: { contains: () => true },
            gallery: testCase.input.presetCss,
            name: testCase.input.presetName,
        };
        (el as any).handleChangeCss({ target: fakeTarget, stopPropagation: () => {} } as unknown as KeyboardEvent);

        // handleChangeCss debounces via a 100ms setTimeout before calling setState(css).
        await new Promise((resolve) => setTimeout(resolve, 150));

        const finalStyles = getState('less.left.lessCSS.styles');
        const result = { cursor: finalStyles.cursor ?? '' };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testApplyCursorGuardClause(testCase: { expected: any }): Promise<string> {
    try {
        const styles: Record<string, string> = {};
        setState('less.left.lessCSS.styles', styles);

        const el = await mount<PluginStyleCursor>(TAG, { position: 'left' });

        const fakeTarget: any = { classList: { contains: () => true } }; // no `.gallery`/`.name`
        (el as any).handleChangeCss({ target: fakeTarget, stopPropagation: () => {} } as unknown as KeyboardEvent);

        // Even though no timeout is scheduled by the guard clause, wait past the usual debounce
        // window to make sure nothing was written asynchronously.
        await new Promise((resolve) => setTimeout(resolve, 150));

        const finalStyles = getState('less.left.lessCSS.styles');
        const result = { cursorKeyWritten: 'cursor' in finalStyles };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testPluginInfo(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleCursor>(TAG, { position: 'left' });
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
