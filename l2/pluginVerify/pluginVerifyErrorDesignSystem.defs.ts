/// <mls fileReference="_100555_/l2/pluginVerify/pluginVerifyErrorDesignSystem.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginVerify/pluginVerifyErrorDesignSystem.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html",
            "type": "function"
          },
          {
            "name": "repeat",
            "type": "function"
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
            "name": "customElement",
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
        "ref": "/_102027_/l2/designSystemBase.js",
        "dependencies": [
          {
            "name": "preCompileLessByThemeOrDefault",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin to verify and compile less files for errors",
      "businessCapabilities": [
        "Verify less files for compilation errors",
        "Report errors in design system files"
      ],
      "technicalCapabilities": [
        "Compile less files using preCompileLessByThemeOrDefault",
        "Render error lists with lit"
      ],
      "implementedFeatures": [
        "Prepare verification process",
        "Compile all less files",
        "Display progress and errors",
        "Cancel verification"
      ]
    }
  }
}
    