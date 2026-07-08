/// <mls fileReference="_100555_/l2/utils/lessCSS.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/utils/lessCSS.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100555_/l2/utils/lessAST.js",
        "dependencies": [
          {
            "name": "LessAst",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_102029_/l2/collabState.js",
        "dependencies": [
          {
            "name": "setState",
            "type": "function"
          },
          {
            "name": "getState",
            "type": "function"
          },
          {
            "name": "initState",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "LessCSS class for LESS CSS manipulation",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "LESS AST management",
        "Monaco editor integration",
        "CSS property proxy"
      ],
      "implementedFeatures": [
        "setSelector",
        "getProperty",
        "setProperty",
        "refresh",
        "setStateByLine"
      ]
    }
  }
}
    