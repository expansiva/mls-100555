/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleBoxShadow.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { getState, setState } from '/_102029_/l2/collabState.js';
import { PluginStyleBoxShadow, tags, getDescription } from '/_100555_/l2/pluginStyle/pluginStyleBoxShadow.js';

import '/_100555_/l2/pluginStyle/pluginStyleBoxShadow.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-style--plugin-style-box-shadow-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // onGalleryClick() writes item.state.boxShadow verbatim to `this.boxShadow` (so the raw CSS value
    // is always correct), then calls the private setValues2() parser to split it into offsetX/offsetY/
    // boxBlur/spread/color/shadowMode for the individual editor inputs - that split has a real bug:
    { functionName: 'testApplyPreset', env: 'browser', params: [
        { input: { galleryIndex: 2 },
          expected: { boxShadow: '5px 5px 20px', offsetX: '5px', offsetY: '5px', boxBlur: '20px', spread: '', color: '', shadowMode: 'outset' } },
        // BUG: setValues2()'s "starts with a lowercase letter -> treat as a named color" branch
        // (`/[a-z]/.test(value.substring(0, 1))`) fires on the "inset" KEYWORD too, since it also starts
        // with a lowercase letter. It strips "inset" out of the string and assigns it to `this.color`
        // instead of recognizing shadowMode. The subsequent `value.indexOf('inset')` check then runs
        // against the ALREADY-STRIPPED string, so it never finds "inset" either. Net effect: clicking
        // the "inset" gallery preset leaves shadowMode as 'outset' and sets color to the literal string
        // 'inset' - even though the raw `boxShadow` value written to styles is still correct, since that
        // one is copied from item.state.boxShadow before the (buggy) parse ever runs.
        { input: { galleryIndex: 7 },
          expected: { boxShadow: 'inset 0 0 10px', offsetX: '0', offsetY: '0', boxBlur: '10px', spread: '', color: 'inset', shadowMode: 'outset' } },
    ]},

    // handleIcaStateChange reads its guard from the passed `_value` but the actual AST/selector lookup
    // is done through `this.state` (not the argument) - both are set to the same object, mirroring
    // real usage via the `{{ less.<position> }}` attribute binding. Uses a pure-length box-shadow value
    // (no color) to stay clear of any browser-specific CSSOM color re-serialization.
    { functionName: 'testHandleIcaStateChange', env: 'browser', params: [
        { input: { astProperties: { 'box-shadow': { value: '5px 5px 10px', line: 1 } } },
          expected: { offsetX: '5px', offsetY: '5px', boxBlur: '10px', spread: '', color: '', shadowMode: 'outset' } },
        // Edge case: a selector with no box-shadow rule still runs this.clear() (all fields reset to
        // undefined, shadowMode reset to 'outset'), it just never repopulates them (hasRuleBoxInAST
        // stays false).
        { input: { astProperties: { color: { value: 'red', line: 1 } } },
          expected: { offsetX: undefined, offsetY: undefined, boxBlur: undefined, spread: undefined, color: undefined, shadowMode: 'outset' } },
    ]},

    { functionName: 'testPluginInfo', env: 'browser', params: [
        { expected: { tags: ['box-shadow'], descriptionIsString: true } },
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

        const el = await mount<PluginStyleBoxShadow>(TAG, { position: 'left' });

        const gallery: any[] = (el as any).gallery;
        const item = gallery[testCase.input.galleryIndex];
        if (!item) throw new Error(`Gallery preset not found at index: ${testCase.input.galleryIndex}`);
        await (el as any).onGalleryClick(item);

        const finalStyles = getState('less.left.lessCSS.styles');
        const result = {
            boxShadow: finalStyles.boxShadow ?? '',
            offsetX: el.offsetX,
            offsetY: el.offsetY,
            boxBlur: el.boxBlur,
            spread: el.spread,
            color: el.color,
            shadowMode: el.shadowMode,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleIcaStateChange(testCase: { input: { astProperties: Record<string, { value: string; line: number }> }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleBoxShadow>(TAG, { position: 'left' });

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
            offsetX: el.offsetX,
            offsetY: el.offsetY,
            boxBlur: el.boxBlur,
            spread: el.spread,
            color: el.color,
            shadowMode: el.shadowMode,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testPluginInfo(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleBoxShadow>(TAG, { position: 'left' });
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
