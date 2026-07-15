/// <mls fileReference="_100555_/l2/pluginEditL3/pluginEditStyleL3.test.ts" enhancement="_blank" />

import { IPluginTestCase, mount, cleanup, compare, query, mountAndVerify, overrideMls } from '/_102027_/l2/plugins/pluginTestUtils.js';
import { PluginEditStyleL3 } from '/_100555_/l2/pluginEditL3/pluginEditStyleL3.js';

import '/_100555_/l2/pluginEditL3/pluginEditStyleL3.js'; // side-effect import: guarantees this module's top-level registration (e.g. @customElement) always runs, regardless of whether the named imports above survive compilation (TS elides imports used only as types)

const TAG = 'plugin-edit-l3--plugin-edit-style-l3-100555';

