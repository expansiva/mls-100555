/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleTransform.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginStyle/pluginStyleTransform.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
      "pt"
    ],
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
          },
          {
            "name": "queryAll",
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
      },
      {
        "ref": "/_102029_/l2/collabDecorators.js",
        "dependencies": [
          {
            "name": "propertyDataSource",
            "type": "function"
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
      "generalDescription": "A versatile plugin for maintaining and applying CSS transform properties.",
      "businessCapabilities": [
        "Easily manage scale, rotate, skew, and translate transformations to create dynamic and interactive UI elements with precision."
      ],
      "technicalCapabilities": [
        "Uses Lit library",
        "Extends StateLitElement",
        "Handles CSS state changes"
      ],
      "implementedFeatures": [
        "scaleX",
        "scaleY",
        "rotate",
        "translateX",
        "translateY",
        "skewX",
        "skewY"
      ]
    }
  }
}
    