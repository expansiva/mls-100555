/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectInfo.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginProject/pluginProjectInfo.ts",
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
            "name": "html"
          },
          {
            "name": "css"
          },
          {
            "name": "svg"
          },
          {
            "name": "TemplateResult"
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
            "name": "query"
          },
          {
            "name": "property"
          },
          {
            "name": "state"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/pluginBaseModule.js",
        "dependencies": [
          {
            "name": "PluginBaseModule"
          }
        ]
      },
      {
        "ref": "/_100555_/l2/utils/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_trash"
          },
          {
            "name": "collab_lock"
          },
          {
            "name": "collab_lock_open"
          },
          {
            "name": "collab_arrow_up_long"
          },
          {
            "name": "collab_arrow_down_long"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin for project info and dependencies",
      "businessCapabilities": [
        "Display project information",
        "Manage project dependencies"
      ],
      "technicalCapabilities": [
        "Lit web component",
        "i18n support"
      ],
      "implementedFeatures": [
        "Render project details",
        "List dependencies",
        "Add dependency",
        "Remove dependency",
        "Reorder dependencies",
        "Save dependencies"
      ]
    }
  }
}
    