/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleClippath.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { getState, setState } from '/_102029_/l2/collabState.js';
// Note: the source file is named "pluginStyleClippath.ts" but the exported class is
// `PluginStyleClipath` (single 'p') - a naming inconsistency in the source, kept as-is here.
import { PluginStyleClipath, tags, getDescription } from '/_100555_/l2/pluginStyle/pluginStyleClippath.js';

const TAG = 'plugin-style--plugin-style-clippath-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // handleChangeCss (triggered by clicking a gallery item) writes the raw preset string into
    // `less.<position>.lessCSS.styles.clipPath` and rebuilds the internal preview (points/parameters/
    // outputRes) through initClipPathMaker(). Quirk: unlike Padding's onGalleryClick, this path never
    // assigns the reactive `clipPath` @property itself - that only happens via the reverse
    // handleIcaStateChange -> setValues() flow, so right after a preset click `el.clipPath` stays undefined.
    { functionName: 'testApplyPreset', env: 'browser', params: [
        { input: { presetCss: 'clip-path: circle(40% at 50% 50%)', presetName: 'circle' },
          expected: { stylesClipPath: 'circle(40% at 50% 50%)', outputRes: 'circle(40% at 50% 50%)', clipPathPropertyUnsynced: true } },
        { input: { presetCss: 'clip-path: ellipse(25% 40% at 50% 50%)', presetName: 'ellipse' },
          expected: { stylesClipPath: 'ellipse(25% 40% at 50% 50%)', outputRes: 'ellipse(25% 40% at 50% 50%)', clipPathPropertyUnsynced: true } },
    ]},

    // handleIcaStateChange reads its guard from the passed `_value` but the actual AST/selector lookup
    // is done through `this.state` (not the argument) - the test sets both to the same object to match
    // real usage, where `state` is populated via the `{{ less.<position> }}` attribute binding.
    { functionName: 'testHandleIcaStateChange', env: 'browser', params: [
        { input: { astProperties: { 'clip-path': { value: 'none', line: 1 } } },
          expected: { clipPath: 'none' } },
        // Edge case: a selector with no clip-path rule still clears the field via this.clear(),
        // it just never repopulates it (hasRuleClipPath stays false).
        { input: { astProperties: { color: { value: 'red', line: 1 } } },
          expected: { clipPath: undefined } },
    ]},

    { functionName: 'testPluginInfo', env: 'browser', params: [
        { expected: { tags: ['clip-path'], descriptionIsString: true } },
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

export async function testApplyPreset(testCase: { input: { presetCss: string; presetName: string }; expected: any }): Promise<string> {
    try {
        const styles: Record<string, string> = {};
        setState('less.left.lessCSS.styles', styles);

        const el = await mount<PluginStyleClipath>(TAG, { position: 'left' });

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
        const result = {
            stylesClipPath: finalStyles.clipPath ?? '',
            outputRes: (el as any).outputRes,
            clipPathPropertyUnsynced: el.clipPath === undefined,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleIcaStateChange(testCase: { input: { astProperties: Record<string, { value: string; line: number }> }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleClipath>(TAG, { position: 'left' });

        const fakeLessAst = {
            ast: { '.test-selector': testCase.input.astProperties },
            toCamelCaseProperty: (prop: string) => prop.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase()),
        };
        const icaValue: any = {
            selector: '.test-selector',
            emitter: 'editor',
            lessCSS: { selector: '.test-selector', lessAST: fakeLessAst },
        };
        el.state = icaValue;
        (el as any).handleIcaStateChange('less.left', icaValue);

        const result = { clipPath: el.clipPath };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testPluginInfo(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleClipath>(TAG, { position: 'left' });
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
