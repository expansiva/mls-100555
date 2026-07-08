/// <mls fileReference="_100555_/l2/utils/collabDsInputRange.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/utils/collabDsInputRange.ts",
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
        "ref": "/_102029_/l2/stateLitElement.js",
        "dependencies": [
          {
            "name": "StateLitElement",
            "type": "class"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Custom input range component with text input and select dropdown",
      "businessCapabilities": [
        "Handles numeric input with unit selection",
        "Supports mouse wheel for value adjustment"
      ],
      "technicalCapabilities": [
        "Extends StateLitElement",
        "Uses Lit for rendering"
      ],
      "implementedFeatures": [
        "Text input with number filtering",
        "Select dropdown for units",
        "Wheel event handling for increment/decrement",
        "Custom event dispatching"
      ]
    }
  }
}
    