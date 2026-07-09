/// <mls fileReference="_100555_/l2/pluginGit/pluginPullrequest.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginGit/pluginPullrequest.ts",
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
            "type": "?"
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
        "ref": "/_102027_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "getMyKeysBranch",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin for displaying open pull requests",
      "businessCapabilities": [
        "Display open pull requests for a repository"
      ],
      "technicalCapabilities": [
        "Renders list of pull requests using Lit",
        "Handles i18n for messages"
      ],
      "implementedFeatures": [
        "Fetches and displays pull requests",
        "Handles errors",
        "Supports auto-prepare functionality"
      ]
    }
  }
}
    