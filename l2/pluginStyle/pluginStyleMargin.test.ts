/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleMargin.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { getState, setState } from '/_102029_/l2/collabState.js';
// Note: the exported class is named `PluginStyleSpacing`, not `PluginStyleMargin` - the file/tag/tags
// all say "margin", only the class identifier drifted to the more generic "Spacing" name.
import { PluginStyleSpacing, tags, getDescription } from '/_100555_/l2/pluginStyle/pluginStyleMargin.js';

import '/_100555_/l2/pluginStyle/pluginStyleMargin.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-style--plugin-style-margin-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // onGalleryClick exercises the same 3-branch shorthand-collapsing pipeline as Padding:
    // all sides equal -> single shorthand value; top/bottom+left/right pairs equal -> 2-value shorthand;
    // otherwise -> longhand object (each side written individually, with `|| ''` fallback for empty sides).
    { functionName: 'testApplyPreset', env: 'browser', params: [
        { input: { presetStyle: 'margin: 10px' },
          expected: { margin: '10px', marginTop: '', marginRight: '', marginBottom: '', marginLeft: '', marginLocked: true } },
        { input: { presetStyle: 'margin: 10px 0' },
          expected: { margin: '10px 0', marginTop: '', marginRight: '', marginBottom: '', marginLeft: '', marginLocked: false } },
        { input: { presetStyle: 'margin-left: 10px' },
          expected: { margin: '', marginTop: '', marginRight: '', marginBottom: '', marginLeft: '10px', marginLocked: false } },
    ]},

    // handleIcaStateChange reads its guard from the passed `_value` but the actual AST/selector lookup
    // is done through `this.state` (not the argument) - the test sets both to the same object to match
    // real usage, where `state` is populated via the `{{ less.<position> }}` attribute binding.
    { functionName: 'testHandleIcaStateChange', env: 'browser', params: [
        { input: { astProperties: { 'margin-top': { value: '5px', line: 1 }, 'margin-left': { value: '3px', line: 2 } } },
          expected: { marginTop: '5px', marginLeft: '3px', marginRight: undefined, marginBottom: undefined, marginLocked: false } },
        // Edge case: a selector with no margin-* rule still clears every field via this.clear(),
        // it just never repopulates them (hasRuleMarginInAST stays false).
        { input: { astProperties: { color: { value: 'red', line: 1 } } },
          expected: { marginTop: undefined, marginLeft: undefined, marginRight: undefined, marginBottom: undefined } },
    ]},

    { functionName: 'testPluginInfo', env: 'browser', params: [
        { expected: { tags: ['margin*'], descriptionIsString: true } },
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

export async function testApplyPreset(testCase: { input: { presetStyle: string }; expected: any }): Promise<string> {
    try {
        const styles: Record<string, string> = {};
        setState('less.left.lessCSS.styles', styles);

        const el = await mount<PluginStyleSpacing>(TAG, { position: 'left' });

        const gallery: any[] = (el as any).gallery;
        const item = gallery.find((g: any) => g.style === testCase.input.presetStyle);
        if (!item) throw new Error(`Gallery preset not found: ${testCase.input.presetStyle}`);
        (el as any).onGalleryClick(item);

        const finalStyles = getState('less.left.lessCSS.styles');
        const result = {
            margin: finalStyles.margin ?? '',
            marginTop: finalStyles.marginTop ?? '',
            marginRight: finalStyles.marginRight ?? '',
            marginBottom: finalStyles.marginBottom ?? '',
            marginLeft: finalStyles.marginLeft ?? '',
            marginLocked: el.marginLocked,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleIcaStateChange(testCase: { input: { astProperties: Record<string, { value: string; line: number }> }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleSpacing>(TAG, { position: 'left' });

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

        const result = {
            marginTop: el.marginTop,
            marginLeft: el.marginLeft,
            marginRight: el.marginRight,
            marginBottom: el.marginBottom,
            ...(testCase.expected.marginLocked !== undefined ? { marginLocked: el.marginLocked } : {}),
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testPluginInfo(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleSpacing>(TAG, { position: 'left' });
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
