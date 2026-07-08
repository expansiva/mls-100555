/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleFilter.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginStyle/pluginStyleFilter.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement",
    "devFidelity": "final"
  },
  "references": {
    "webComponents": [
      "plugin-style--plugin-style-filter-100555",
      "utils--collab-ds-input-range-100555",
      "utils--collab-ds-input-select-color-100555"
    ],
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
            "type": "?",
            "purpose": "decorator"
          },
          {
            "name": "property",
            "type": "?",
            "purpose": "decorator"
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
      },
      {
        "ref": "/_102029_/l2/collabDecorators.js",
        "dependencies": [
          {
            "name": "propertyDataSource",
            "type": "?",
            "purpose": "decorator"
          }
        ]
      },
      {
        "ref": "/_102029_/l2/collabState.js",
        "dependencies": [
          {
            "name": "getState",
            "type": "function"
          },
          {
            "name": "setState",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102029_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "getMessageKey",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100555_/l2/utils/lessCSS.js",
        "dependencies": [
          {
            "name": "ICSSState",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_100555_/l2/utils/collabDsInputSelectColor.js"
      },
      {
        "ref": "/_100555_/l2/utils/collabDsInputRange.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "A versatile plugin for managing and applying CSS filter properties.",
      "businessCapabilities": [
        "Apply CSS filters to UI elements",
        "Control visual effects like blur, brightness, contrast"
      ],
      "technicalCapabilities": [
        "Lit web component",
        "State management with collabState",
        "i18n support"
      ],
      "implementedFeatures": [
        "Grayscale filter",
        "Blur filter",
        "Sepia filter",
        "Saturate filter",
        "Opacity filter",
        "Brightness filter",
        "Contrast filter",
        "Hue rotate filter",
        "Invert filter",
        "Gallery of preset filters"
      ]
    }
  }
}
    