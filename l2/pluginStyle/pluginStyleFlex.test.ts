/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleFlex.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { getState, setState } from '/_102029_/l2/collabState.js';
import { PluginStyleFlex, tags, getDescription } from '/_100555_/l2/pluginStyle/pluginStyleFlex.js';

import '/_100555_/l2/pluginStyle/pluginStyleFlex.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-style--plugin-style-flex-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // Unlike Padding/Margin, Flex keeps no camelCase mirror properties on the element itself - the
    // private `setState(prop, css)` is the single real sink that both `handleChangeCss` and
    // `handleChangeGalleryCss` funnel into. It converts the kebab-case `prop` via
    // `this.state?.lessCSS?.lessAST.toCamelCaseProperty(prop)` before writing `less.<position>.lessCSS.styles`.
    { functionName: 'testApplyFlexChange', env: 'browser', params: [
        { input: { prop: 'display', value: 'flex' }, expected: { display: 'flex' } },
        { input: { prop: 'flex-direction', value: 'column' }, expected: { flexDirection: 'column' } },
        { input: { prop: 'align-items', value: 'center' }, expected: { alignItems: 'center' } },
    ]},

    // Quirk: `this.state?.lessCSS?.lessAST.toCamelCaseProperty(prop) || ''` short-circuits to
    // undefined (then '') when `state` was never populated (e.g. AST not loaded yet) - setState()
    // does NOT throw, it silently writes the value under the empty-string key `styles['']` instead
    // of the intended camelCase key, and the real key is left untouched.
    { functionName: 'testApplyFlexChangeWithoutState', env: 'browser', params: [
        { input: { prop: 'flex-direction', value: 'row' }, expected: { emptyKeyValue: 'row', flexDirectionIsUndefined: true } },
    ]},

    // setValues() (the read direction, AST -> UI) queries every DOM element with a `[prop]`
    // attribute and sets `.value` straight from `json[prop].value` using the RAW kebab-case AST key
    // - no toCamelCaseProperty conversion on this side, unlike the write direction above.
    // Also: `clear()` just calls `setValues()` unconditionally before the `hasRuleFlexInAST` branch
    // is even checked, so that flag never actually changes the outcome - `_onIcaStateChange()` (called
    // only when the flag is true) just calls the very same `setValues()` again, redundantly.
    { functionName: 'testHandleIcaStateChange', env: 'browser', params: [
        { input: { astProperties: { 'flex-direction': { value: 'column', line: 1 }, 'justify-content': { value: 'center', line: 2 } } },
          expected: { flexDirection: 'column', justifyContent: 'center', alignItems: '' } },
        // Edge case: a selector with no flex-related rule still ends up blanking every [prop]
        // element, but only because none of them match `json[prop]` - not because of the
        // (effectively unused) hasRuleFlexInAST guard.
        { input: { astProperties: { color: { value: 'red', line: 1 } } },
          expected: { flexDirection: '', justifyContent: '', alignItems: '' } },
    ]},

    { functionName: 'testPluginInfo', env: 'browser', params: [
        { expected: { tags: ['flex*', 'gap', 'align-items', 'justify-content', 'flex-direction', 'flex-wrap', 'align-content'], descriptionIsString: true } },
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

function fakeStateWithAst(): any {
    return {
        selector: '.test-selector',
        emitter: 'editor',
        lessCSS: {
            selector: '.test-selector',
            lessAST: {
                toCamelCaseProperty: (prop: string) => prop.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase()),
            },
        },
    };
}

export async function testApplyFlexChange(testCase: { input: { prop: string; value: string }; expected: any }): Promise<string> {
    try {
        const styles: Record<string, string> = {};
        setState('less.left.lessCSS.styles', styles);

        const el = await mount<PluginStyleFlex>(TAG, { position: 'left' });
        (el as any).state = fakeStateWithAst();

        (el as any).setState(testCase.input.prop, testCase.input.value);

        const finalStyles = getState('less.left.lessCSS.styles');
        const key = Object.keys(testCase.expected)[0];
        const result = { [key]: finalStyles[key] };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testApplyFlexChangeWithoutState(testCase: { input: { prop: string; value: string }; expected: any }): Promise<string> {
    try {
        const styles: Record<string, string> = {};
        setState('less.left.lessCSS.styles', styles);

        const el = await mount<PluginStyleFlex>(TAG, { position: 'left' });
        // Intentionally leave `state` unset to exercise the fallback-to-empty-key quirk.

        (el as any).setState(testCase.input.prop, testCase.input.value);

        const finalStyles = getState('less.left.lessCSS.styles');
        const result = {
            emptyKeyValue: finalStyles[''],
            flexDirectionIsUndefined: finalStyles.flexDirection === undefined,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleIcaStateChange(testCase: { input: { astProperties: Record<string, { value: string; line: number }> }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleFlex>(TAG, { position: 'left' });

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

        const flexDirectionEl = query(el, 'select[prop="flex-direction"]') as HTMLSelectElement | null;
        const justifyContentEl = query(el, 'select[prop="justify-content"]') as HTMLSelectElement | null;
        const alignItemsEl = query(el, 'select[prop="align-items"]') as HTMLSelectElement | null;
        const result = {
            flexDirection: flexDirectionEl?.value ?? '',
            justifyContent: justifyContentEl?.value ?? '',
            alignItems: alignItemsEl?.value ?? '',
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testPluginInfo(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleFlex>(TAG, { position: 'left' });
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
