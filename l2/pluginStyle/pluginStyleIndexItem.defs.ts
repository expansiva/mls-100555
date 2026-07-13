/// <mls fileReference="_100555_/l2/pluginStyle/pluginStyleIndexItem.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginStyle/pluginStyleIndexItem.ts",
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
            "name": "unsafeHTML",
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
            "name": "state",
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
        "ref": "/_100555_/l2/utils/cssHelperIndexBase.js",
        "dependencies": [
          {
            "name": "IHelpers",
            "type": "interface"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils.js",
        "dependencies": [
          {
            "name": "convertFileNameToTag",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100555_/l2/utils/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_heart",
            "type": "constant"
          },
          {
            "name": "collab_heart_o",
            "type": "constant"
          },
          {
            "name": "collab_question",
            "type": "constant"
          },
          {
            "name": "collab_angles_right",
            "type": "constant"
          },
          {
            "name": "collab_chevron_right",
            "type": "constant"
          },
          {
            "name": "collab_info_circle",
            "type": "constant"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin style index item component",
      "businessCapabilities": [
        "Display plugin information",
        "Toggle expand/collapse modes",
        "Like/unlike plugins",
        "Show plugin details"
      ],
      "technicalCapabilities": [
        "Lit web component",
        "Custom element",
        "Property binding",
        "Event handling"
      ],
      "implementedFeatures": [
        "Render plugin header with icons",
        "Handle click events for expand, full, like, info",
        "Dynamically load plugin content"
      ]
    }
  }
}
    