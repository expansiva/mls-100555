/// <mls fileReference="_100555_/l2/pluginExplore/pluginExploreListAddL3.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginExplore/pluginExploreListAddL3.ts",
    "componentType": "pluginSettings",
    "componentScope": "editor",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement",
    "devFidelity": "scaffold"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/collabLibStor.js",
        "dependencies": [
          {
            "name": "createAllFiles",
            "type": "function"
          },
          {
            "name": "IReqCreateAllFiles",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils.js",
        "dependencies": [
          {
            "name": "convertFileNameToTag",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "getInstanceByFile",
            "type": "function"
          },
          {
            "name": "isNameValid",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentHelper.js",
        "dependencies": [
          {
            "name": "executeAgentByFile",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/collabImport.js",
        "dependencies": [
          {
            "name": "collabImport",
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
        "ref": "/_102027_/l2/serviceBase.js",
        "dependencies": [
          {
            "name": "ServiceBase",
            "type": "class"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin to add new organisms via prompt",
      "businessCapabilities": [
        "Create new organism components",
        "Execute AI agent for prototyping"
      ],
      "technicalCapabilities": [
        "Lit web component",
        "Custom element",
        "TypeScript"
      ],
      "implementedFeatures": [
        "Render form for module, organism name, prompt",
        "Create TS and defs files",
        "Execute agent"
      ]
    }
  }
}
    