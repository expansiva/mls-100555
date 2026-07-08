/// <mls fileReference="_100555_/l2/utils/projectAST.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/utils/projectAST.ts",
    "componentType": "tool",
    "componentScope": "editor"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100554_/l2/collabLibModel.js",
        "dependencies": [
          {
            "name": "createModel",
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
        "ref": "/_100555_/l2/pluginNewFile/pluginNewFileBase.js",
        "dependencies": [
          {
            "name": "createNewFile",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Functions for managing project modules and configuration",
      "businessCapabilities": [
        "add module to project",
        "configure master front-end",
        "remove module from project"
      ],
      "technicalCapabilities": [
        "create new file",
        "import project config",
        "set model value",
        "compile and post-process"
      ],
      "implementedFeatures": [
        "addModule",
        "configureMasterFrontEnd",
        "removeModule"
      ]
    }
  }
}
    