/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleTextShadow.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { getState, setState } from '/_102029_/l2/collabState.js';
import { PluginStyleTextShadow, tags, getDescription } from '/_100555_/l2/pluginStyle/pluginStyleTextShadow.js';

const TAG = 'plugin-style--plugin-style-text-shadow-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // onGalleryClick -> setValues2() parses `textShadow` into offSetX/offSetY/textBlur/color.
    // The numeric-only and rgba() cases are parsed correctly, but hex/named colors trigger a bug:
    // see the third case below (`text-shadow: 1px 1px 2px #000;`).
    { functionName: 'testApplyPreset', env: 'browser', params: [
        { input: { presetStyle: 'text-shadow: 2px 2px;' },
          expected: { textShadow: '2px 2px', offSetX: '2px', offSetY: '2px', textBlur: '', color: '' } },
        { input: { presetStyle: 'text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);' },
          expected: { textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', offSetX: '2px', offSetY: '2px', textBlur: '4px', color: 'rgba(0, 0, 0, 0.5)' } },
        // BUG (found, not fixed): the '#' branch of setValues2 does
        // `value.substring(value.indexOf('#'), value.indexOf(' ') + 1)`. Since indexOf('#') (12) is
        // greater than the FIRST space's index (3), JS `substring` silently swaps the bounds, so it
        // extracts "1px 2px" (not the hex color) as `color`, and `textBlur` ends up holding the hex
        // string instead of the blur radius. Documented here as-is, per instructions not to fix it.
        { input: { presetStyle: 'text-shadow: 1px 1px 2px #000;' },
          expected: { textShadow: '1px 1px 2px #000', offSetX: '1px', offSetY: '', textBlur: '#000', color: '1px 2px' } },
    ]},

    // handleIcaStateChange reads its guard from the passed `_value`, but the actual AST/selector lookup
    // is done through `this.state` - the test sets both to the same object to match real usage.
    { functionName: 'testHandleIcaStateChange', env: 'browser', params: [
        { input: { astProperties: { 'text-shadow': { value: '3px 4px 5px', line: 1 } } },
          expected: { textShadow: '3px 4px 5px', offSetX: '3px', offSetY: '4px', textBlur: '5px', color: '' } },
        // Edge case: a selector with no text-shadow rule still clears every field via this.clear(),
        // it just never repopulates them (hasRuleTextShadowInAST stays false).
        { input: { astProperties: { color: { value: 'red', line: 1 } } },
          expected: { textShadow: undefined, offSetX: undefined, offSetY: undefined, textBlur: undefined, color: undefined } },
    ]},

    { functionName: 'testPluginInfo', env: 'browser', params: [
        { expected: { tags: ['text-shadow'], descriptionIsString: true } },
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

        const el = await mount<PluginStyleTextShadow>(TAG, { position: 'left' });

        const gallery: any[] = (el as any).gallery;
        const item = gallery.find((g: any) => g.style === testCase.input.presetStyle);
        if (!item) throw new Error(`Gallery preset not found: ${testCase.input.presetStyle}`);
        await (el as any).onGalleryClick(item);

        const finalStyles = getState('less.left.lessCSS.styles');
        const result = {
            textShadow: finalStyles.textShadow ?? '',
            offSetX: el.offSetX ?? '',
            offSetY: el.offSetY ?? '',
            textBlur: el.textBlur ?? '',
            color: el.color ?? '',
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleIcaStateChange(testCase: { input: { astProperties: Record<string, { value: string; line: number }> }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleTextShadow>(TAG, { position: 'left' });

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
            textShadow: el.textShadow,
            offSetX: el.offSetX,
            offSetY: el.offSetY,
            textBlur: el.textBlur,
            color: el.color,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testPluginInfo(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleTextShadow>(TAG, { position: 'left' });
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
