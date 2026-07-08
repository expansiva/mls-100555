/// <mls fileReference="_100555_/l2/pluginEditL3/pluginEditStyleAST.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginEditL3/pluginEditStyleAST.ts",
    "componentType": "tool",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "asIs": {
    "semantic": {
      "generalDescription": "LESS Abstract Syntax Tree (AST) manipulation utility for Monaco editor.",
      "businessCapabilities": [
        "Programmatic manipulation of LESS/CSS styles within an editor environment."
      ],
      "technicalCapabilities": [
        "Parse LESS/CSS content into an AST-like structure.",
        "Select CSS selectors.",
        "Add/update/remove CSS properties for a given selector.",
        "Add/remove CSS selectors.",
        "Export grouped CSS selectors."
      ],
      "implementedFeatures": [
        "Selector parsing and block mapping.",
        "Rule management (set, get).",
        "Selector path ensuring.",
        "Grouped selector export."
      ],
      "constraints": [
        "Operates on a monaco.editor.ITextModel.",
        "Assumes LESS/CSS syntax."
      ]
    }
  }
}
    