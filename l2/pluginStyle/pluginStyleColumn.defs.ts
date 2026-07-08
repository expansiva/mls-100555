/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleColumn.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginStyle/pluginStyleColumn.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "utils--collab-ds-input-select-color-100555",
      "utils--collab-ds-input-range-100555"
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
          },
          {
            "name": "queryAll",
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
        "ref": "/_100555_/l2/utils/collabDsInputSelectColor.js",
        "dependencies": [
          {
            "name": "CollabDsInputSelectColor",
            "type": "class"
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
        "ref": "/_102027_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "convertColorToHex",
            "type": "function"
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
      "generalDescription": "This plugin allows for easy and efficient creation and adjustment of text columns. It lets you set the number of columns, spacing between them, and other formatting details, providing an organized layout and enhancing readability.",
      "businessCapabilities": [
        "create and adjust text columns",
        "define the number of columns",
        "set spacing between columns",
        "adjust formatting details"
      ],
      "technicalCapabilities": [
        "uses Lit library",
        "custom element",
        "state management",
        "CSS manipulation"
      ],
      "implementedFeatures": [
        "columnsCount",
        "columnsWidth",
        "columnsGap",
        "columnsRule",
        "columnSpan",
        "breakInside"
      ]
    }
  }
}
    