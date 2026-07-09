/// <mls fileReference="_100555_/l2/pluginPreview/pluginPreviewResultJs.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginPreview/pluginPreviewResultJs.ts",
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
      "plugin-preview--plugin-preview-result-js-100555",
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
            "name": "repeat",
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
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin for previewing JavaScript compilation results",
      "businessCapabilities": [
        "Compiles TypeScript code",
        "Displays compilation errors",
        "Shows production JavaScript output"
      ],
      "technicalCapabilities": [
        "Uses Monaco editor for code display",
        "Integrates with Lit for rendering",
        "Handles i18n for messages"
      ],
      "implementedFeatures": [
        "Creates Monaco editor instance",
        "Fetches and sets compilation results",
        "Updates editor model with compiled JavaScript"
      ]
    }
  }
}
    