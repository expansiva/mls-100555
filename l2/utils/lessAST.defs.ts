/// <mls fileReference="_100555_/l2/utils/lessAST.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/utils/lessAST.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "imports": [
      {
        "ref": "/_100555_/l2/utils/lessMonaco.js",
        "dependencies": [
          {
            "name": "MonacoDriver",
            "type": "class"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "This class parses a LESS model, building an AST and converting LESS selectors into a CSS-compatible format.",
      "businessCapabilities": [],
      "technicalCapabilities": [
        "Basic Selector Nesting",
        "Simple Variables",
        "Basic LESS Structure"
      ],
      "implementedFeatures": [
        "Basic Selector Nesting",
        "Simple Variables",
        "Basic LESS Structure"
      ],
      "constraints": [
        "Variable Interpolation within Selectors",
        "Parameterized Mixins",
        "Mathematical and Color Functions",
        "Looping and Iteration",
        "Global Scope Management"
      ]
    }
  }
}
    