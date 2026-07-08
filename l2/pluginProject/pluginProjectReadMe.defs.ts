/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectReadMe.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginProject/pluginProjectReadMe.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "collab-edit-md-100554"
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
        "ref": "/_100555_/l2/utils/collabEditMd.js",
        "dependencies": [
          {
            "name": "CollabEditMd",
            "type": "class"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin for project README.md editing",
      "businessCapabilities": [
        "Edit project README.md",
        "Display README.md in dashboard"
      ],
      "technicalCapabilities": [
        "Uses Lit library for rendering",
        "Integrates with CollabEditMd component"
      ],
      "implementedFeatures": [
        "prepare method",
        "render method",
        "setReadme method",
        "onChangeMd method",
        "createFile method"
      ],
      "constraints": [
        "Only renders when scope is 'dashboard'"
      ]
    }
  }
}
    