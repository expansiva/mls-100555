/// <mls fileReference="_100555_/l2/pluginStyle/pluginStylePadding.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { getState, setState } from '/_102029_/l2/collabState.js';
import { PluginStylePadding, tags, getDescription } from '/_100555_/l2/pluginStyle/pluginStylePadding.js';

const TAG = 'plugin-style--plugin-style-padding-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // onGalleryClick exercises the 3 branches of the private setState()/updatePadding() pipeline:
    // all sides equal -> single shorthand value; top/bottom+left/right pairs equal -> 2-value shorthand;
    // otherwise -> longhand object (each side written individually, with `|| ''` fallback for empty sides).
    { functionName: 'testApplyPreset', env: 'browser', params: [
        { input: { presetStyle: 'padding: 10px' },
          expected: { padding: '10px', paddingTop: '', paddingRight: '', paddingBottom: '', paddingLeft: '', paddingLocked: true } },
        { input: { presetStyle: 'padding: 10px 0' },
          expected: { padding: '10px 0', paddingTop: '', paddingRight: '', paddingBottom: '', paddingLeft: '', paddingLocked: false } },
        { input: { presetStyle: 'padding-left: 10px' },
          expected: { padding: '', paddingTop: '', paddingRight: '', paddingBottom: '', paddingLeft: '10px', paddingLocked: false } },
    ]},

    // handleIcaStateChange reads its guard from the passed `_value` but the actual AST/selector lookup
    // is done through `this.state` (not the argument) - the test sets both to the same object to match
    // real usage, where `state` is populated via the `{{ less.<position> }}` attribute binding.
    { functionName: 'testHandleIcaStateChange', env: 'browser', params: [
        { input: { astProperties: { 'padding-top': { value: '5px', line: 1 }, 'padding-left': { value: '3px', line: 2 } } },
          expected: { paddingTop: '5px', paddingLeft: '3px', paddingRight: undefined, paddingBottom: undefined, paddingLocked: false } },
        // Edge case: a selector with no padding-* rule still clears every field via this.clear(),
        // it just never repopulates them (hasRulePaddingInAST stays false).
        { input: { astProperties: { color: { value: 'red', line: 1 } } },
          expected: { paddingTop: undefined, paddingLeft: undefined, paddingRight: undefined, paddingBottom: undefined } },
    ]},

    { functionName: 'testPluginInfo', env: 'browser', params: [
        { expected: { tags: ['padding*'], descriptionIsString: true } },
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

        const el = await mount<PluginStylePadding>(TAG, { position: 'left' });

        const gallery: any[] = (el as any).gallery;
        const item = gallery.find((g: any) => g.style === testCase.input.presetStyle);
        if (!item) throw new Error(`Gallery preset not found: ${testCase.input.presetStyle}`);
        (el as any).onGalleryClick(item);

        const finalStyles = getState('less.left.lessCSS.styles');
        const result = {
            padding: finalStyles.padding ?? '',
            paddingTop: finalStyles.paddingTop ?? '',
            paddingRight: finalStyles.paddingRight ?? '',
            paddingBottom: finalStyles.paddingBottom ?? '',
            paddingLeft: finalStyles.paddingLeft ?? '',
            paddingLocked: el.paddingLocked,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleIcaStateChange(testCase: { input: { astProperties: Record<string, { value: string; line: number }> }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStylePadding>(TAG, { position: 'left' });

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
            paddingTop: el.paddingTop,
            paddingLeft: el.paddingLeft,
            paddingRight: el.paddingRight,
            paddingBottom: el.paddingBottom,
            ...(testCase.expected.paddingLocked !== undefined ? { paddingLocked: el.paddingLocked } : {}),
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testPluginInfo(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStylePadding>(TAG, { position: 'left' });
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
