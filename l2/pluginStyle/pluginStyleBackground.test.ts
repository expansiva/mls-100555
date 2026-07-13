/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleBackground.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { getState, setState } from '/_102029_/l2/collabState.js';
import { PluginCssTokens, tags, getDescription } from '/_100555_/l2/pluginStyle/pluginStyleBackground.js';

const TAG = 'plugin-style--plugin-style-background-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // clickGallery() exercises configString()/mountMyValue(): a plain color goes through the
    // rgba->hex->rgba round trip (info.tp === 'background'), a gradient goes through the
    // comma/rgba token-swapping parser in changeStr() (info.tp === 'linear-gradient').
    // Note: clickGallery() always hardcodes `actualKey = 'background'` before writing, so a preset
    // is always written to styles.background - even though handleIcaStateChange (see below) can
    // track 'background-image' as the actualKey. Gallery presets can never target background-image.
    { functionName: 'testApplyPreset', env: 'browser', params: [
        { input: { presetCss: 'background: rgba(240, 236, 227,1)' },
          expected: { background: 'rgba(240, 236, 227, 1)', css: 'rgba(240, 236, 227, 1)', infoTp: 'background' } },
        { input: { presetCss: 'background: linear-gradient(0deg, rgba(34, 193, 195,1) 0%, rgba(253, 187, 45,1) 100%)' },
          expected: { background: 'linear-gradient(0deg, rgba(34, 193, 195, 1) 0%, rgba(253, 187, 45, 1) 100%)', css: 'linear-gradient(0deg, rgba(34, 193, 195, 1) 0%, rgba(253, 187, 45, 1) 100%)', infoTp: 'linear-gradient' } },
    ]},

    // handleIcaStateChange reads its guard from the passed `_value` but the actual AST/selector lookup
    // is done through `this.state` (not the argument) - both are set to the same object, mirroring
    // real usage via the `{{ less.<position> }}` attribute binding.
    { functionName: 'testHandleIcaStateChange', env: 'browser', params: [
        { input: { astProperties: { background: { value: 'none', line: 1 } } },
          expected: { actualKey: 'background', css: 'none', infoTp: 'background', infoValue: 'none' } },
        // Quirk: when both 'background' and 'background-image' rules exist for the selector, the loop
        // in handleIcaStateChange never breaks - `actualKey` ends up as whichever matching key comes
        // LAST in Object.keys(actualAst) (source order), here 'background-image'. Any subsequent
        // helper-driven edit would then overwrite background-image instead of background.
        { input: { astProperties: { background: { value: 'none', line: 1 }, 'background-image': { value: 'none', line: 2 } } },
          expected: { actualKey: 'background-image' } },
    ]},

    { functionName: 'testPluginInfo', env: 'browser', params: [
        { expected: { tags: ['background', 'background-image'], descriptionIsString: true } },
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

export async function testApplyPreset(testCase: { input: { presetCss: string }; expected: any }): Promise<string> {
    try {
        const styles: Record<string, string> = {};
        setState('less.left.lessCSS.styles', styles);

        const el = await mount<PluginCssTokens>(TAG, { position: 'left' });
        (el as any).clickGallery({ target: { gallery: testCase.input.presetCss } } as unknown as MouseEvent);

        const finalStyles = getState('less.left.lessCSS.styles');
        const result = {
            background: finalStyles.background ?? '',
            css: el.css,
            infoTp: el.info.tp,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleIcaStateChange(testCase: { input: { astProperties: Record<string, { value: string; line: number }> }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginCssTokens>(TAG, { position: 'left' });

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

        const result: any = { actualKey: (el as any).actualKey };
        if (testCase.expected.css !== undefined) result.css = el.css;
        if (testCase.expected.infoTp !== undefined) result.infoTp = el.info.tp;
        if (testCase.expected.infoValue !== undefined) result.infoValue = el.info.itens[0]?.value;
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
