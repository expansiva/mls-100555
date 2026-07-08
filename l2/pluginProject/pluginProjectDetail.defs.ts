/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectDetail.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginProject/pluginProjectDetail.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "plugin-project--plugin-project-detail-100555",
      "plugin-project--plugin-project-info-100555"
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
            "name": "css",
            "type": "function"
          },
          {
            "name": "svg",
            "type": "function"
          },
          {
            "name": "TemplateResult",
            "type": "type"
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
            "name": "query",
            "type": "function"
          },
          {
            "name": "property",
            "type": "function"
          },
          {
            "name": "customElement",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/libCompile.js",
        "dependencies": [
          {
            "name": "getAllWebComponentsInSource",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils.js",
        "dependencies": [
          {
            "name": "convertTagToFileName",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/pluginBaseModule.js",
        "dependencies": [
          {
            "name": "PluginBaseModule",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100555_/l2/pluginProject/pluginProjectInfo.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin for displaying project details",
      "businessCapabilities": [
        "Load project information",
        "Render project HTML content",
        "Dynamically load web components"
      ],
      "technicalCapabilities": [
        "Uses LitElement for UI",
        "Interacts with local storage",
        "Loads files from storage"
      ],
      "implementedFeatures": [
        "prepare method",
        "firstUpdated lifecycle",
        "render method",
        "loadProject method"
      ]
    }
  }
}
    