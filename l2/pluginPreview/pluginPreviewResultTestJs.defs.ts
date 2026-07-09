/// <mls fileReference="_100555_/l2/pluginPreview/pluginPreviewResultTestJs.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginPreview/pluginPreviewResultTestJs.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
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
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "customElement",
            "type": "function"
          },
          {
            "name": "property",
            "type": "function"
          },
          {
            "name": "query",
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
        "ref": "/_102027_/l2/libCompile.js",
        "dependencies": [
          {
            "name": "getDependenciesByMFile",
            "type": "function"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "unusedImports": [
      "getDependenciesByMFile"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin for previewing compiled test JS results",
      "businessCapabilities": [
        "Displays compilation results of test JS"
      ],
      "technicalCapabilities": [
        "Uses Monaco editor for code display",
        "Integrates with TypeScript compilation"
      ],
      "implementedFeatures": [
        "Creates read-only Monaco editor",
        "Fetches and sets compiled JS model",
        "Handles compilation errors"
      ]
    }
  }
}
    