/// <mls fileReference="_100555_/l2/pluginExplore/pluginExploreList.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginExplore/pluginExploreList.ts",
    "componentType": "pluginUI",
    "componentScope": "editor",
    "group": "enhancement",
    "devFidelity": "final",
    "languages": [
      "en",
      "pt"
    ]
  },
  "references": {
    "webComponents": [
      "plugin-explore--plugin-explore-list-100555"
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
            "name": "queryAll",
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
        "ref": "/_102027_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "selectLevel",
            "type": "function"
          },
          {
            "name": "forceServiceInstance",
            "type": "function"
          },
          {
            "name": "getBaseTemplate",
            "type": "function"
          },
          {
            "name": "getInstanceByFile",
            "type": "function"
          },
          {
            "name": "OpenedFileL2",
            "type": "type"
          },
          {
            "name": "saveOpenedFile",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibStor.js",
        "dependencies": [
          {
            "name": "cloneAllFiles",
            "type": "function"
          },
          {
            "name": "deleteAllFiles",
            "type": "function"
          },
          {
            "name": "renameAllFiles",
            "type": "function"
          },
          {
            "name": "undoAllFiles",
            "type": "function"
          },
          {
            "name": "IReqCreateStorFile",
            "type": "interface"
          },
          {
            "name": "createStorFile",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibModel.js",
        "dependencies": [
          {
            "name": "createAllModels",
            "type": "function"
          },
          {
            "name": "createModel",
            "type": "function"
          },
          {
            "name": "readProjectTypescriptAndCompile",
            "type": "function"
          },
          {
            "name": "readProjectTypescriptAndCompileL1",
            "type": "function"
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
      },
      {
        "ref": "/_102027_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "isNameValid",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin for exploring file lists",
      "businessCapabilities": [
        "file management",
        "project exploration"
      ],
      "technicalCapabilities": [
        "list rendering",
        "event handling",
        "file operations"
      ],
      "implementedFeatures": [
        "list view",
        "add file",
        "undo",
        "clone",
        "rename",
        "delete",
        "filter",
        "sort"
      ],
      "constraints": []
    }
  }
}
    