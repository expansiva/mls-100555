/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleBorder.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { getState, setState } from '/_102029_/l2/collabState.js';
import { PluginStyleBorder, tags, getDescription } from '/_100555_/l2/pluginStyle/pluginStyleBorder.js';

const TAG = 'plugin-style--plugin-style-border-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // onGalleryClick() sets the border*/borderRadius* properties from the preset, awaits a render pass
    // (so the child utils--collab-ds-input-select-color-100555 elements pick up the new
    // _valueInput/_valueSelect/_valueColor), then setState() re-reads those child elements' combined
    // `.value` (via setBorderValues()) before deciding string-shorthand vs longhand-object.
    // Case 1: all 4 sides identical -> borderLocked collapses to a single shorthand string, and since
    // every radius is '' (also "equal"), borderRadiusLocked also collapses to a shorthand (empty) string.
    // Case 2: bottom side differs from top/left/right -> longhand border object (each side keyed
    // individually) while the (all-'') border-radius side still collapses to shorthand - the two
    // "all equal" checks are fully independent of each other.
    // Note: the composed side value goes through convertColorToHex() (from libCommom.ts) for the
    // color part, which uppercases its hex output (`.toUpperCase()`) - so even though the gallery
    // preset's own `style`/color strings are lowercase (e.g. '#32557f'), the value written back to
    // styles.border/borderTop/etc ends up with an UPPERCASE hex (e.g. '#32557F').
    { functionName: 'testApplyPreset', env: 'browser', params: [
        { input: { galleryIndex: 3 },
          expected: { border: '5px dashed #32557F', borderTop: '', borderRight: '', borderBottom: '', borderLeft: '', borderLocked: true, borderRadiusLocked: true } },
        { input: { galleryIndex: 0 },
          expected: { border: '', borderTop: '3px solid #2C3E50', borderRight: '3px solid #2C3E50', borderBottom: '6px groove #16A085', borderLeft: '3px solid #2C3E50', borderLocked: false, borderRadiusLocked: true } },
    ]},

    // handleIcaStateChange reads its guard from the passed `_value` but the actual AST/selector lookup
    // is done through `this.state` (not the argument) - both are set to the same object, mirroring
    // real usage via the `{{ less.<position> }}` attribute binding. Only width/style/radius properties
    // are used here (not color) since browsers may re-serialize color values through the CSSOM.
    { functionName: 'testHandleIcaStateChange', env: 'browser', params: [
        { input: { astProperties: { 'border-top-width': { value: '5px', line: 1 }, 'border-left-style': { value: 'dashed', line: 2 }, 'border-top-left-radius': { value: '10px', line: 3 } } },
          expected: { borderTopWidth: '5px', borderLeftStyle: 'dashed', borderTopLeftRadius: '10px', borderLocked: false, borderRadiusLocked: false } },
        // Edge case: a selector with no border-* rule at all still runs this.clear() (all fields reset
        // to undefined/false), it just never repopulates them (hasRuleBorderInAST stays false).
        { input: { astProperties: { color: { value: 'red', line: 1 } } },
          expected: { borderTopWidth: undefined, borderLeftStyle: undefined, borderTopLeftRadius: undefined, borderLocked: false, borderRadiusLocked: false } },
    ]},

    { functionName: 'testPluginInfo', env: 'browser', params: [
        { expected: { tags: ['border*'], descriptionIsString: true } },
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

export async function testApplyPreset(testCase: { input: { galleryIndex: number }; expected: any }): Promise<string> {
    try {
        const styles: Record<string, string> = {};
        setState('less.left.lessCSS.styles', styles);

        const el = await mount<PluginStyleBorder>(TAG, { position: 'left' });

        const gallery: any[] = (el as any).gallery;
        const item = gallery[testCase.input.galleryIndex];
        if (!item) throw new Error(`Gallery preset not found at index: ${testCase.input.galleryIndex}`);
        await (el as any).onGalleryClick(item);

        const finalStyles = getState('less.left.lessCSS.styles');
        const result = {
            border: finalStyles.border ?? '',
            borderTop: finalStyles.borderTop ?? '',
            borderRight: finalStyles.borderRight ?? '',
            borderBottom: finalStyles.borderBottom ?? '',
            borderLeft: finalStyles.borderLeft ?? '',
            borderLocked: el.borderLocked,
            borderRadiusLocked: el.borderRadiusLocked,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleIcaStateChange(testCase: { input: { astProperties: Record<string, { value: string; line: number }> }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleBorder>(TAG, { position: 'left' });

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
            borderTopWidth: el.borderTopWidth,
            borderLeftStyle: el.borderLeftStyle,
            borderTopLeftRadius: el.borderTopLeftRadius,
            borderLocked: el.borderLocked,
            borderRadiusLocked: el.borderRadiusLocked,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testPluginInfo(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleBorder>(TAG, { position: 'left' });
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
