/// <mls fileReference="_100555_/l2/pluginNewFile/widgetTextCode.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginNewFile/widgetTextCode.ts",
    "componentType": "molecule",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
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
      },
      {
        "ref": "/_102029_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "CollabLitElement",
            "type": "class"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Widget for displaying and editing code with syntax highlighting",
      "businessCapabilities": [
        "Display code with syntax highlighting",
        "Edit code text"
      ],
      "technicalCapabilities": [
        "Uses Lit web components",
        "Integrates highlight.js for syntax highlighting"
      ],
      "implementedFeatures": [
        "Language property",
        "Text property",
        "Languages array",
        "Code block query",
        "Select query",
        "Updated lifecycle",
        "SetCode method",
        "UnescapeHtml method",
        "WaitForLoadIfNeeded method",
        "FirstUpdated lifecycle",
        "Render method",
        "OnChangeText method"
      ]
    }
  }
}
    