/// <mls fileReference="_100555_/l2/pluginNewFile/pluginNewFileBase.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginNewFile/pluginNewFileBase.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_102027_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "openService",
            "type": "function"
          },
          {
            "name": "isNameValid",
            "type": "function"
          }
        ]
      },
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
      }
    ]
  },
  "codeInsights": {
    "deadCodeBlocks": [
      "/*export async function createNewFile(args:IRequestNewFile) {\nconst params = {} as mls.events.IFileAction;\nparams.action = 'new' as typeof params.action;\nparams.level = 2;\nparams.project = args.project;\nparams.newProject = args.project;\nparams.shortName = args.shortName;\nparams.newshortName = args.shortName;\nparams.folder = '';\nparams.newfolder = '';\nparams.newEnhancement = args.enhancement || '_blank';\nparams.extension = '.ts';\nparams.newTSSource = args.sourceTS;\nif (args.sourceHTML) params.newHtmlSource = args.sourceHTML;\nif (args.sourceLess) (params as any).newLessSource = args.sourceLess;\nif (args.sourceTest) (params as any).newTsTestSource = args.sourceTest;\nif (args.sourceDefs) (params as any).newTsDefsSource = args.sourceDefs;\n(params as any).openPreview = args.openPreview\nparams.position = args.position;\nmls.actual[2].setFullName('_' + params.project + '_' + params.shortName);\n(mls.actual[2] as any)[args.position] = {\nproject: params.project,\nshortName: params.shortName\n};\nif (mls.actualLevel == 1) {\nawait mls.events.fire([1], ['FileAction'], JSON.stringify(params), 0);\nif (args.position === 'left' && args.openPreview) openService('_100554_servicePreviewL1', 'right', 1);\n} else {\nawait mls.events.fire([2], ['FileAction'], JSON.stringify(params), 0);\nif (args.position === 'left' && args.openPreview) openService('_100554_servicePreview', 'right', 2);\n}\nsaveLocalHistory(params.project, 2, params.shortName, params.extension, params.folder);\n}*/"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin base for creating new files with template replacements",
      "businessCapabilities": [
        "Create new files in projects",
        "Replace placeholders in source code",
        "Manage file history"
      ],
      "technicalCapabilities": [
        "Export utility functions for string replacements",
        "Handle file creation via library calls",
        "Fire events for file actions"
      ],
      "implementedFeatures": [
        "changeClassName",
        "changeWidget",
        "changeTagName",
        "changeStateName",
        "getTemplateImport",
        "createNewFile",
        "fireEvents",
        "saveLocalHistory"
      ]
    }
  }
}
    