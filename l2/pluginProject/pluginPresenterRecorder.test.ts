/// <mls fileReference="_100555_/l2/pluginProject/pluginPresenterRecorder.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, mountAndVerify } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { pluginData, PluginPresenterRecorder } from '/_100555_/l2/pluginProject/pluginPresenterRecorder.js';

const TAG = 'plugin-project--plugin-presenter-recorder-100555';

export const tests: IPluginTestCase[] = [

    // ---- browser: need real DOM/customElements ----
    // None of these call `startRecording()`/`stopRecording()`'s real capture path — `getDisplayMedia`
    // and `getUserMedia` are never invoked. We only exercise the component's own state/template logic.

    { functionName: 'testSmoke', env: 'browser', params: [
        { expected: { registered: true, rendered: true } },
    ]},

    { functionName: 'testHandleZoomChange', env: 'browser', params: [
        { input: { value: '1' }, expected: { avatarZoom: 1 } },
        { input: { value: '1.5' }, expected: { avatarZoom: 1.5 } },
        { input: { value: '2' }, expected: { avatarZoom: 2 } },
    ]},

    { functionName: 'testAvatarShapeRadioReflection', env: 'browser', params: [
        { input: { avatarShape: 'square' }, expected: { squareChecked: true, roundChecked: false } },
        { input: { avatarShape: 'round' }, expected: { squareChecked: false, roundChecked: true } },
    ]},

    { functionName: 'testButtonDisabledStates', env: 'browser', params: [
        { input: { isRecording: false, isCountdown: false }, expected: { startDisabled: false, stopDisabled: true } },
        { input: { isRecording: true, isCountdown: false }, expected: { startDisabled: true, stopDisabled: false } },
        { input: { isRecording: false, isCountdown: true }, expected: { startDisabled: true, stopDisabled: true } },
    ]},

    // Peculiarity/bug: `stopRecording()` has its `this.isRecording = false; this.requestUpdate();`
    // lines commented out in the source, so calling it never clears `isRecording` — the disabled
    // "Stop" button stays enabled even after stopping. Documented here, not fixed (per instructions).
    { functionName: 'testStopRecordingDoesNotResetIsRecording', env: 'browser', params: [
        { expected: { isRecordingStillTrue: true } },
    ]},

    // ---- vscode: pure logic, no DOM involved ----

    { functionName: 'testPluginData', env: 'vscode', params: [
        { expected: { title: 'Record Presenter', svgHasSvgTag: true } },
    ]},
];

export async function testSmoke(testCase: { expected: any }): Promise<string> {
    try {
        const result = await mountAndVerify(TAG);
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testHandleZoomChange(testCase: { input: { value: string }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginPresenterRecorder>(TAG);
        el.handleZoomChange({ target: { value: testCase.input.value } } as unknown as Event);
        const result = { avatarZoom: el.avatarZoom };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testAvatarShapeRadioReflection(testCase: { input: { avatarShape: 'square' | 'round' }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginPresenterRecorder>(TAG, { avatarShape: testCase.input.avatarShape });
        const square = el.querySelector('input[name="shape"][value="square"]') as HTMLInputElement;
        const round = el.querySelector('input[name="shape"][value="round"]') as HTMLInputElement;
        const result = { squareChecked: square.checked, roundChecked: round.checked };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testButtonDisabledStates(testCase: { input: { isRecording: boolean; isCountdown: boolean }; expected: any }): Promise<string> {
    try {
        const el = await mount<PluginPresenterRecorder>(TAG, { isRecording: testCase.input.isRecording, isCountdown: testCase.input.isCountdown });
        const buttons = el.querySelectorAll('button');
        const startBtn = buttons[0] as HTMLButtonElement;
        const stopBtn = buttons[1] as HTMLButtonElement;
        const result = { startDisabled: startBtn.disabled, stopDisabled: stopBtn.disabled };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testStopRecordingDoesNotResetIsRecording(testCase: { expected: any }): Promise<string> {
    try {
        const el = await mount<PluginPresenterRecorder>(TAG, { isRecording: true });
        el.stopRecording();
        const result = { isRecordingStillTrue: el.isRecording === true };
        compare(result, testCase.expected);
        return JSON.stringify(result);
    } finally {
        cleanup();
    }
}

export async function testPluginData(testCase: { expected: any }): Promise<string> {
    const svg = pluginData.getSvg() as any;
    const svgText = Array.isArray(svg?.strings) ? svg.strings.join('') : String(svg);
    const result = {
        title: pluginData.title,
        svgHasSvgTag: svgText.includes('<svg'),
    };
    compare(result, testCase.expected);
    return JSON.stringify(result);
}
