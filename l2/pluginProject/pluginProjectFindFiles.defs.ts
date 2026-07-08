/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectFindFiles.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginProject/pluginProjectFindFiles.ts",
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
        "ref": "/_102027_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "getDateFormated",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/libProjectConfig.js",
        "dependencies": [
          {
            "name": "getConfigProject",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100555_/l2/utils/collabIcons.js",
        "dependencies": [
          {
            "name": "icons",
            "type": "?"
          }
        ]
      }
    ],
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin for finding files in a project",
      "businessCapabilities": [
        "Search for text or regex in project files"
      ],
      "technicalCapabilities": [
        "Renders UI with search input, file type selector, progress bar, and results list"
      ],
      "implementedFeatures": [
        "File search by type",
        "Text or regex search",
        "Progress indication",
        "Display matched files"
      ]
    }
  }
}
    