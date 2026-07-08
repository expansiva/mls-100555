/// <mls fileReference="_100555_/l2/utils/collabEditMd.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/utils/collabEditMd.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "group": "enhancement",
    "devFidelity": "final"
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
            "name": "css",
            "type": "function"
          },
          {
            "name": "LitElement",
            "type": "class"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "customElement",
            "type": "function"
          },
          {
            "name": "property",
            "type": "function"
          },
          {
            "name": "query",
            "type": "function"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "deadCodeBlocks": [
      "initEditorQuillMD",
      "IQuillConfigOptions"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "LitElement custom element for collaborative markdown editing",
      "businessCapabilities": [
        "markdown editing",
        "preview toggle"
      ],
      "technicalCapabilities": [
        "LitElement integration",
        "EasyMDE library usage"
      ],
      "implementedFeatures": [
        "edit mode",
        "finish edit",
        "toolbar visibility control"
      ]
    }
  }
}
    