/// <mls fileReference="_100555_/l2/pluginStyle/pluginStylePadding.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginStyle/pluginStylePadding.ts",
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
      "utils--collab-ds-input-range-100555"
    ],
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html"
          },
          {
            "name": "repeat"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "customElement"
          },
          {
            "name": "property"
          },
          {
            "name": "query"
          },
          {
            "name": "queryAll"
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
            "name": "propertyDataSource"
          }
        ]
      },
      {
        "ref": "/_102029_/l2/collabState.js",
        "dependencies": [
          {
            "name": "getState"
          },
          {
            "name": "setState"
          }
        ]
      },
      {
        "ref": "/_102029_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "getMessageKey"
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
        "ref": "/_100555_/l2/utils/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_lock"
          },
          {
            "name": "collab_lock_open"
          },
          {
            "name": "collab_padding_bottom"
          },
          {
            "name": "collab_padding_top"
          },
          {
            "name": "collab_padding_left"
          },
          {
            "name": "collab_padding_right"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin for adjusting CSS padding",
      "businessCapabilities": [
        "Adjust padding values for CSS elements",
        "Provide gallery of padding presets"
      ],
      "technicalCapabilities": [
        "Uses Lit for rendering",
        "Integrates with LESS CSS state"
      ],
      "implementedFeatures": [
        "Padding lock for uniform values",
        "Individual padding controls for top, left, bottom, right",
        "Gallery selection for quick padding application"
      ]
    }
  }
}
    