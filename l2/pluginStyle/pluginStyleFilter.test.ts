/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleFilter.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { getState, setState } from '/_102029_/l2/collabState.js';
import { PluginStyleFilter, tags, getDescription } from '/_100555_/l2/pluginStyle/pluginStyleFilter.js';

const TAG = 'plugin-style--plugin-style-filter-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // onGalleryClick sets `this.filter` from the preset, then calls setValues2() which re-parses
    // that single CSS `filter` string back into the individual sub-properties (grayscale, blur, ...).
    // setValues2() extracts each function name via `substring(...).replace('-', '')` (only the FIRST
    // hyphen is stripped) and each numeric value via the char-class regex `[\.-\d]` - which, as verified,
    // keeps digits/dots/minus signs and drops units (%, px, deg), including the sign for negative degrees.
    { functionName: 'testApplyPreset', env: 'browser', params: [
        { input: { presetStyle: 'filter: blur(2px);' },
          expected: { filter: 'blur(2px)', filterBlur: '2', grayscale: '', sepia: '', saturate: '', opacity: '', brightness: '', contrast: '', huerotate: '', invert: '' } },
        { input: { presetStyle: 'filter: brightness(40%) sepia(1) hue-rotate(-42deg) saturate(6);' },
          expected: { filter: 'brightness(40%) sepia(1) hue-rotate(-42deg) saturate(6)', brightness: '40', sepia: '1', huerotate: '-42', saturate: '6', grayscale: '', filterBlur: '', opacity: '', contrast: '', invert: '' } },
    ]},

    // handleIcaStateChange only recognizes the AST property named exactly 'filter' (not startsWith),
    // since CSS filter is a single shorthand property, unlike padding/margin which have longhand sides.
    // The read direction (AST -> UI) goes through toCamelCaseProperty('filter') === 'filter' (no dash),
    // then re-derives the sub-properties via setValues2(), exactly like testApplyPreset above.
    { functionName: 'testHandleIcaStateChange', env: 'browser', params: [
        { input: { astProperties: { filter: { value: 'blur(2px)', line: 1 } } },
          expected: { filter: 'blur(2px)', filterBlur: '2' } },
        // Edge case: a selector with no `filter` rule still clears every field via this.clear(),
        // and never repopulates them since hasRuleFilterInAST stays false.
        { input: { astProperties: { color: { value: 'red', line: 1 } } },
          expected: { filter: undefined, grayscale: undefined, filterBlur: undefined, sepia: undefined, saturate: undefined, opacity: undefined, brightness: undefined, contrast: undefined, huerotate: undefined, invert: undefined } },
    ]},

    { functionName: 'testPluginInfo', env: 'browser', params: [
        { expected: { tags: ['filter'], descriptionIsString: true } },
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

        const el = await mount<PluginStyleFilter>(TAG, { position: 'left' });

        const gallery: any[] = (el as any).gallery;
        const item = gallery.find((g: any) => g.style === testCase.input.presetStyle);
        if (!item) throw new Error(`Gallery preset not found: ${testCase.input.presetStyle}`);
        await (el as any).onGalleryClick(item);

        const result: Record<string, any> = {};
        for (const key of Object.keys(testCase.expected)) {
            if (key === 'filter') {
                const finalStyles = getState('less.left.lessCSS.styles');
                result.filter = finalStyles.filter ?? '';
            } else {
                result[key] = (el as any)[key] ?? '';
            }
        }
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleIcaStateChange(testCase: { input: { astProperties: Record<string, { value: string; line: number }> }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleFilter>(TAG, { position: 'left' });

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

        const result: Record<string, any> = {};
        for (const key of Object.keys(testCase.expected)) {
            result[key] = (el as any)[key];
        }
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testPluginInfo(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleFilter>(TAG, { position: 'left' });
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
