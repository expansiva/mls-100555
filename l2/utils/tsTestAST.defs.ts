/// <mls fileReference="_100555_/l2/utils/tsTestAST.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/utils/tsTestAST.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100555_/l2/utils/tsTestMonaco.js",
        "dependencies": [
          {
            "name": "MonacoDriver",
            "type": "class"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "deadCodeBlocks": [
      "_deleteTest2"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Class to parse a TypeScript test file and generate an AST.",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "parse TypeScript code into AST",
        "retrieve integrations from AST",
        "retrieve tests from AST",
        "add test to AST",
        "delete test from AST",
        "navigate to test in editor",
        "get test info",
        "run test",
        "add integration to AST"
      ],
      "implementedFeatures": [
        "parse",
        "getIntegrations",
        "getTests",
        "addTest",
        "deleteTest",
        "goToTest",
        "getTestInfo",
        "runTest",
        "addIntegration"
      ]
    }
  }
}
    