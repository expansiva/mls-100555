/// <mls fileReference="_100555_/l2/utils/collabDsInputSelectColor.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/utils/collabDsInputSelectColor.ts",
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
            "name": "repeat",
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
      },
      {
        "ref": "/_102027_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "convertColorToHex",
            "type": "function"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Custom element for selecting color with input, select, and color picker",
      "businessCapabilities": [
        "Provides a combined input for numeric values, unit selection, and color picking"
      ],
      "technicalCapabilities": [
        "Renders Lit HTML templates with inputs and selects",
        "Handles input events and wheel events for numeric adjustment",
        "Converts and validates color values"
      ],
      "implementedFeatures": [
        "Numeric input with unit select",
        "Unit select dropdown",
        "Color picker input",
        "Event dispatching on changes"
      ]
    }
  }
}
    