/// <mls fileReference="_100555_/l2/pluginExplore/pluginExploreListAddL2.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginExplore/pluginExploreListAddL2.ts",
    "componentType": "pluginSettings",
    "componentScope": "editor",
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
          }
        ]
      },
      {
        "ref": "/_102027_/l2/utils.js",
        "dependencies": [
          {
            "name": "convertFileNameToTag"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/serviceBase.js",
        "dependencies": [
          {
            "name": "ServiceBase"
          }
        ]
      },
      {
        "ref": "/_102029_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "CollabLitElement"
          }
        ]
      },
      {
        "ref": "/_100555_/l2/pluginNewFile/pluginNewFileBase.js",
        "dependencies": [
          {
            "name": "IDetails"
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
          },
          {
            "name": "initState"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "loadPluginProject"
          },
          {
            "name": "isNameValid"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Add",
      "businessCapabilities": [
        "Add new plugins or files to a project"
      ],
      "technicalCapabilities": [
        "Renders UI with Lit",
        "Handles input validation",
        "Loads plugin templates"
      ],
      "implementedFeatures": [
        "Project selection",
        "Short name input with validation",
        "Template selection from plugins",
        "Back navigation"
      ]
    }
  }
}
    