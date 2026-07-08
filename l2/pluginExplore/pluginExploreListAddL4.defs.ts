/// <mls fileReference="_100555_/l2/pluginExplore/pluginExploreListAddL4.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginExplore/pluginExploreListAddL4.ts",
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
            "name": "html"
          },
          {
            "name": "repeat"
          },
          {
            "name": "TemplateResult"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "customElement"
          },
          {
            "name": "state"
          },
          {
            "name": "property"
          },
          {
            "name": "query"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibStor.js",
        "dependencies": [
          {
            "name": "createAllFiles"
          },
          {
            "name": "IReqCreateAllFiles"
          }
        ]
      },
      {
        "ref": "/_100555_/l2/pluginNewFile/pluginNewFileBase.js",
        "dependencies": [
          {
            "name": "getTemplateImport"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils.js",
        "dependencies": [
          {
            "name": "convertFileNameToTag"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "getInstanceByFile"
          },
          {
            "name": "isNameValid"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/aiAgentHelper.js",
        "dependencies": [
          {
            "name": "executeAgentByFile"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/collabImport.js",
        "dependencies": [
          {
            "name": "collabImport"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/pluginBaseModule.js",
        "dependencies": [
          {
            "name": "PluginBaseModule"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/serviceBase.js",
        "dependencies": [
          {
            "name": "ServiceBase"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin component for adding new pages or organisms",
      "businessCapabilities": [
        "Prepares module list",
        "Creates new page files",
        "Executes AI agent for prototype generation"
      ],
      "technicalCapabilities": [
        "Uses Lit for rendering",
        "Handles form inputs",
        "Integrates with storage and AI helpers"
      ],
      "implementedFeatures": [
        "prepare",
        "init",
        "render",
        "createFile",
        "goBack",
        "verifyModuleConfig",
        "setHistory",
        "getNewNameAndValid",
        "showLoad",
        "showError"
      ]
    }
  }
}
    