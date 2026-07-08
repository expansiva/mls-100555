/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectConfig.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginProject/pluginProjectConfig.ts",
    "componentType": "pluginSettings",
    "componentScope": "editor",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "mls-editor-100529"
    ],
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html",
            "type": "function"
          },
          {
            "name": "css",
            "type": "function"
          },
          {
            "name": "svg",
            "type": "function"
          },
          {
            "name": "TemplateResult",
            "type": "type"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "query",
            "type": "function"
          },
          {
            "name": "property",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/pluginBaseModule.js",
        "dependencies": [
          {
            "name": "PluginBaseModule",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/libProjectConfig.js"
      }
    ]
  },
  "codeInsights": {
    "securityWarnings": [
      "eval(val);"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin for project configuration",
      "businessCapabilities": [
        "Edit project configuration",
        "Clear local changes"
      ],
      "technicalCapabilities": [
        "Uses Lit for rendering",
        "Integrates Monaco editor",
        "Loads and saves project config"
      ],
      "implementedFeatures": [
        "Renders header with icon and clear button",
        "Embeds Monaco editor",
        "Loads project configs",
        "Clears local changes",
        "Refreshes on project selection"
      ]
    }
  }
}
    