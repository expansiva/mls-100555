/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleColumn.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { getState, setState } from '/_102029_/l2/collabState.js';
import { PluginStyleColumn, tags, getDescription } from '/_100555_/l2/pluginStyle/pluginStyleColumn.js';

import '/_100555_/l2/pluginStyle/pluginStyleColumn.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-style--plugin-style-column-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    // onGalleryClick copies every field of the preset's `state` onto the matching @property, awaits a
    // render pass, then calls the private setState(), which writes columnCount/Gap/Span/Width and the
    // column-rule-* longhand fields (with `|| ''` fallback) into `less.<position>.lessCSS.styles`.
    // Quirk/bug: setState() never writes a combined `columnRule` key into `styles` - the shorthand is
    // only ever split into columnRuleColor/columnRuleStyle/columnRuleWidth. The local `this.columnRule`
    // field is set separately (via setColumnRuleValues(), reading the rendered rule-color-picker widget)
    // but that value is discarded and never reaches `styles`, so it's effectively dead for CSS output.
    { functionName: 'testApplyPreset', env: 'browser', params: [
        { input: { presetStyle: 'column-count: 2; column-gap: 20px; column-rule-width: 1px; column-rule-style: dashed;' },
          expected: {
              columnCount: '2', columnGap: '20px', columnSpan: '', columnWidth: '',
              columnRuleColor: '', columnRuleStyle: 'dashed', columnRuleWidth: '1px', breakInside: '',
              columnRuleKeyWrittenToStyles: false,
          } },
        { input: { presetStyle: 'column-count: 2; column-rule-width: 1px; column-rule-style: solid;' },
          expected: {
              columnCount: '2', columnGap: '', columnSpan: '', columnWidth: '',
              columnRuleColor: '', columnRuleStyle: 'solid', columnRuleWidth: '1px', breakInside: '',
              columnRuleKeyWrittenToStyles: false,
          } },
    ]},

    // handleIcaStateChange reads its guard from the passed `_value` but the actual AST/selector lookup
    // is done through `this.state` (not the argument) - the test sets both to the same object to match
    // real usage, where `state` is populated via the `{{ less.<position> }}` attribute binding.
    { functionName: 'testHandleIcaStateChange', env: 'browser', params: [
        { input: { astProperties: { 'column-count': { value: '3', line: 1 }, 'break-inside': { value: 'avoid', line: 2 } } },
          expected: {
              columnCount: '3', breakInside: 'avoid',
              columnWidth: undefined, columnGap: undefined, columnSpan: undefined,
              columnRuleColor: undefined, columnRuleStyle: undefined, columnRuleWidth: undefined,
          } },
        // Edge case: a selector with no column-* / break-inside rule still clears every field via
        // this.clear(), it just never repopulates them (hasRuleColumnInAST stays false).
        { input: { astProperties: { color: { value: 'red', line: 1 } } },
          expected: {
              columnCount: undefined, breakInside: undefined,
              columnWidth: undefined, columnGap: undefined, columnSpan: undefined,
              columnRuleColor: undefined, columnRuleStyle: undefined, columnRuleWidth: undefined,
          } },
    ]},

    { functionName: 'testPluginInfo', env: 'browser', params: [
        { expected: { tags: ['column*', 'break-inside'], descriptionIsString: true } },
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

        const el = await mount<PluginStyleColumn>(TAG, { position: 'left' });

        const gallery: any[] = (el as any).gallery;
        const item = gallery.find((g: any) => g.style === testCase.input.presetStyle);
        if (!item) throw new Error(`Gallery preset not found: ${testCase.input.presetStyle}`);
        await (el as any).onGalleryClick(item);

        const finalStyles = getState('less.left.lessCSS.styles');
        const result = {
            columnCount: finalStyles.columnCount ?? '',
            columnGap: finalStyles.columnGap ?? '',
            columnSpan: finalStyles.columnSpan ?? '',
            columnWidth: finalStyles.columnWidth ?? '',
            columnRuleColor: finalStyles.columnRuleColor ?? '',
            columnRuleStyle: finalStyles.columnRuleStyle ?? '',
            columnRuleWidth: finalStyles.columnRuleWidth ?? '',
            breakInside: finalStyles.breakInside ?? '',
            columnRuleKeyWrittenToStyles: 'columnRule' in finalStyles,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleIcaStateChange(testCase: { input: { astProperties: Record<string, { value: string; line: number }> }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleColumn>(TAG, { position: 'left' });

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
            columnCount: el.columnCount,
            breakInside: el.breakInside,
            columnWidth: el.columnWidth,
            columnGap: el.columnGap,
            columnSpan: el.columnSpan,
            columnRuleColor: el.columnRuleColor,
            columnRuleStyle: el.columnRuleStyle,
            columnRuleWidth: el.columnRuleWidth,
        };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testPluginInfo(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginStyleColumn>(TAG, { position: 'left' });
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
