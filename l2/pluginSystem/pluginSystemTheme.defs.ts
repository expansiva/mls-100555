/// <mls fileReference="_100555_/l2/pluginSystem/pluginSystemTheme.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginSystem/pluginSystemTheme.ts",
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
      "plugin-system--plugin-system-theme-100555"
    ],
    "imports": [
      {
        "ref": "/_102027_/l2/pluginBaseModule.js",
        "dependencies": [
          {
            "name": "PluginBaseModule",
            "type": "class"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Theme selection plugin component",
      "businessCapabilities": [
        "Allows users to select and change application theme"
      ],
      "technicalCapabilities": [
        "Uses localStorage for theme persistence",
        "Detects OS theme preference"
      ],
      "implementedFeatures": [
        "Theme selection dropdown",
        "Change button",
        "Page reload on theme change"
      ]
    }
  }
}
    