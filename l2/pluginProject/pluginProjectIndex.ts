/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectIndex.ts" enhancement="_102027_/l2/enhancementLit" />

// To improve system performance, avoid using imports, as this file is loaded during initialization.

import { PluginBaseIndex } from '/_102027_/l2/pluginBaseIndex.js';

export class PluginProjectIndex extends PluginBaseIndex {

    public getMenus(): mls.plugin.MenuAction[] {
        return [
            /*{
                category: 'Details',
                scope: ['l5Project'],
                priority: 1,
                auth: ['admin'],
                widget: '_100554_pluginProjectUsage'
            },
            {
                category: 'Details',
                scope: ['l5Project'],
                priority: 1,
                auth: ['admin'],
                widget: '_100554_pluginProjectConfig'
            },
            {
                category: 'Details',
                scope: ['l5Project'],
                priority: 1,
                auth: ['admin'],
                widget: '_100554_pluginProjectInfo'
            },
            {
                category: 'About',
                scope: ['l5Project'],
                priority: 1,
                auth: ['admin'],
                widget: '_100554_pluginProjectReadMe'
            },
            {
                category: 'Helpers',
                scope: ['l5Project'],
                priority: 1,
                auth: ['*'],
                widget: '_100554_pluginProjectFindFiles'
            },*/
        ];
    }

    public getHooks(): mls.plugin.HookAction[] {
        return [];
    }

    public getServices(): mls.plugin.ServiceAction[] {
        return [];
    }

}

export default new PluginProjectIndex();
