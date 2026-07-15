/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleTransform.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { getState, setState } from '/_102029_/l2/collabState.js';
import { PluginStyleTransform, tags, getDescription } from '/_100555_/l2/pluginStyle/pluginStyleTransform.js';

import '/_100555_/l2/pluginStyle/pluginStyleTransform.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-style--plugin-style-transform-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // onGalleryClick -> setValues2() splits `transform` on ')' and, per function, extracts its
    // numeric argument(s) with a [.\-\d] character-class match. `scale`/`translate`/`skew` accept up
    // to 2 comma-separated args (X then Y); when the function name already ends in X/Y (e.g.
    // `translateX`) the suffix is not appended again. `rotate` (and any other single-value function)
    // goes through the plain-number branch instead.
    { functionName: 'testApplyPreset', env: 'browser', params: [
        { input: { presetStyle: 'transform: scale(1.5);' },
          expected: { transform: 'scale(1.5)', scaleX: '1.5', scaleY: '', rotate: '', translateX: '', translateY: '', skewX: '', skewY: '' } },
        { input: { presetStyle: 'transform: rotate(90deg);' },
          expected: { transform: 'rotate(90deg)', scaleX: '', scaleY: '', rotate: '90', translateX: '', translateY: '', skewX: '', skewY: '' } },
        { input: { presetStyle: 'transform: skew(50deg, -50deg);' },
          expected: { transform: 'skew(50deg, -50deg)', scaleX: '', scaleY: '', rotate: '', translateX: '', translateY: '', skewX: '50', skewY: '-50' } },
        { input: { presetStyle: 'transform: translateX(20px);' },
          expected: { transform: 'translateX(20px)', scaleX: '', scaleY: '', rotate: '', translateX: '20', translateY: '', skewX: '', skewY: '' } },
    ]},

    // handleIcaStateChange reads its guard from the passed `_value`, but the actual AST/selector lookup
    // is done through `this.state` - the test sets both to the same object to match real usage.
    { functionName: 'testHandleIcaStateChange', env: 'browser', params: [
        { input: { astProperties: { 'transform': { value: 'rotate(45deg)', line: 1 } } },
          expected: { transform: 'rotate(45deg)', scaleX: '', scaleY: '', rotate: '45', translateX: '', translateY: '', skewX: '', skewY: '' } },
        // Edge case: a selector with no transform rule still clears every field via this.clear(),
        // it just never repopulates them (hasRuleTransformInAST stays false).
        { input: { astProperties: { color: { value: 'red', line: 1 } } },
          expected: { transform: undefined, scaleX: undefined, scaleY: undefined, rotate: undefined, translateX: undefined, translateY: undefined, skewX: undefined, skewY: undefined } },
    ]},

    { functionName: 'testPluginInfo', env: 'browser', params: [
        { expected: { tags: ['transform'], descriptionIsString: true } },
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

        const el = await mount<PluginStyleTransform>(TAG, { position: 'left' });

        const gallery: any[] = (el as any).gallery;
        const item = gallery.find((g: any) => g.style === testCase.input.presetStyle);
        if (!item) throw new Error(`Gallery preset not found: ${testCase.input.presetStyle}`);
        await (el as any).onGalleryClick(item);

        const finalStyles = getState('less.left.lessCSS.styles');
        const result = {
            transform: finalStyles.transform ?? '',
            scaleX: el.scaleX ?? '',
            scaleY: el.scaleY ?? '',
            rotate: el.rotate ?? '',
            translateX: el.translateX ?? '',
            translateY: el.translateY ?? '',
            skewX: el.skewX ?? '',
            skewY: el.skewY ?? '',
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleIcaStateChange(testCase: { input: { astProperties: Record<string, { value: string; line: number }> }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleTransform>(TAG, { position: 'left' });

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
            transform: el.transform,
            scaleX: el.scaleX,
            scaleY: el.scaleY,
            rotate: el.rotate,
            translateX: el.translateX,
            translateY: el.translateY,
            skewX: el.skewX,
            skewY: el.skewY,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testPluginInfo(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleTransform>(TAG, { position: 'left' });
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
