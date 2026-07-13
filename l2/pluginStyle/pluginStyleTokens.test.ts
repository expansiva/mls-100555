/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleTokens.test.ts" enhancement="_blank" />

// Unlike the other pluginStyle editors (padding/textShadow/transform...), this plugin does not edit a
// single CSS shorthand via a preset gallery. It manages design-system color TOKENS: it fetches a
// theme's palette through `getTokens()` (designSystemBase.js) keyed by `mls.actualProject`, groups the
// flat color-key list by base/state/variation, and lets the user pick a token (writing `@tokenKey`
// into the LESS style). There is no `arrayGallery`/`setValues2` shorthand-parsing pipeline to test here.

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify, overrideMls } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginCssTokens, tags, getDescription } from '/_100555_/l2/pluginStyle/pluginStyleTokens.js';

const TAG = 'plugin-style--plugin-style-tokens-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // groupColorsByState() is a pure data transform (it never reads `this`), reachable only through an
    // instance. It buckets each `{key,value}` color by baseKey (stripping -lighter/-darker/-dark/-light
    // and any -hover/-focus/-disabled state suffix), by state (hover/focus/disabled/default), and by
    // variation (lighter/darker/dark/light/default).
    { functionName: 'testGroupColorsByState', env: 'browser', params: [
        { input: { items: [
            { key: 'primary', value: '#111' },
            { key: 'primary-hover', value: '#222' },
            { key: 'primary-light', value: '#333' },
            { key: 'secondary-dark-focus', value: '#444' },
        ]},
          expected: {
              primary: {
                  default: { dark: '', light: '#333', lighter: '', darker: '', default: '#111' },
                  hover: { dark: '', light: '', lighter: '', darker: '', default: '#222' },
              },
              secondary: {
                  focus: { dark: '#444', light: '', lighter: '', darker: '', default: '' },
              },
          } },
    ]},

    // handleColorClick writes `@<key>` into `this.state.lessCSS.styles[this.prop]`, guarded by
    // state/lessCSS/selector/prop all being truthy.
    { functionName: 'testHandleColorClick', env: 'browser', params: [
        { input: { prop: 'color', hasState: true, key: 'primary-hover', value: '#222' },
          expected: { styleValue: '@primary-hover' } },
        // Edge case: no `state` set (e.g. before the first ICA state arrives) - the guard clause must
        // no-op silently instead of throwing.
        { input: { prop: 'color', hasState: false, key: 'primary-hover', value: '#222' },
          expected: { styleValue: null } },
    ]},

    // handleIcaStateChange only accepts values that look like a token reference (start with '@'). Any
    // other value just flips `needOrder` back to true (forcing the next getTokensColor() call to
    // re-sort by relevance) without touching `prop`/`value`.
    { functionName: 'testHandleIcaStateChange', env: 'browser', params: [
        { input: { key: 'primary', value: '@primary' },
          expected: { prop: 'primary', value: '@primary', needOrder: false } },
        { input: { key: 'foo', value: 'red' },
          expected: { prop: 'unchanged', value: 'unchanged', needOrder: true } },
    ]},

    // getTokensColor() guards on `mls.actualProject` and throws synchronously-awaited when missing.
    // Note: mounting the element also triggers this same guard once in the background via
    // firstUpdated() -> getTokens() (fire-and-forget, uncaught) - that is pre-existing plugin behavior,
    // not something introduced by this test, and shows up as a console warning, not a test failure.
    { functionName: 'testGetTokensColorGuard', env: 'browser', params: [
        { expected: { threw: true, message: 'Invalid project selected' } },
    ]},

    { functionName: 'testPluginInfo', env: 'browser', params: [
        { expected: { tags: ['color:@*', 'background-color:@*', 'background:@*'], descriptionIsString: true } },
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

export async function testGroupColorsByState(testCase: { input: { items: { key: string; value: string }[] }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginCssTokens>(TAG, { position: 'left' });
        const result = (el as any).groupColorsByState(testCase.input.items);
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleColorClick(testCase: { input: { prop: string; hasState: boolean; key: string; value: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginCssTokens>(TAG, { position: 'left' });
        el.prop = testCase.input.prop;
        const styles: Record<string, string> = {};
        if (testCase.input.hasState) {
            el.state = { selector: '.test-selector', lessCSS: { selector: '.test-selector', styles } } as any;
        }
        el.handleColorClick(testCase.input.key, testCase.input.value);
        const result = { styleValue: styles[testCase.input.prop] ?? null };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleIcaStateChange(testCase: { input: { key: string; value: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginCssTokens>(TAG, { position: 'left' });
        (el as any).needOrder = false;
        el.prop = 'unchanged';
        el.value = 'unchanged';
        el.handleIcaStateChange('less.left', { key: testCase.input.key, value: testCase.input.value } as any);

        const result = {
            prop: el.prop,
            value: el.value,
            needOrder: (el as any).needOrder,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testGetTokensColorGuard(testCase: { expected: any }): Promise<string> {
    try {
        overrideMls({ actualProject: undefined });
        const el = await mount<PluginCssTokens>(TAG, { position: 'left' });

        let threw = false;
        let message = '';
        try {
            await (el as any).getTokensColor();
        } catch (e: any) {
            threw = true;
            message = e.message;
        }
        const result = { threw, message };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testPluginInfo(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginCssTokens>(TAG, { position: 'left' });
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
