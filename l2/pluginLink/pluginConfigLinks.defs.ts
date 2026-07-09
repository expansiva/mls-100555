/// <mls fileReference="_100555_/l2/pluginLink/pluginConfigLinks.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginLink/pluginConfigLinks.ts",
    "componentType": "pluginSettings",
    "componentScope": "editor",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "link-item",
      "content-edit",
      "plugin-link--plugin-config-links-100555"
    ],
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html",
            "type": "constant"
          },
          {
            "name": "svg",
            "type": "constant"
          },
          {
            "name": "TemplateResult",
            "type": "interface"
          },
          {
            "name": "repeat",
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
        "ref": "/_102027_/l2/libProjectConfig.js",
        "dependencies": [
          {
            "name": "getConfigProject",
            "type": "function"
          },
          {
            "name": "updateConfigProject",
            "type": "function"
          }
        ]
      }
    ],
    "statesRO": [
      "mls.actualProject"
    ],
    "statesRW": [
      "this.myLinks",
      "this.myConfig"
    ]
  },
  "codeInsights": {
    "unusedImports": [
      "query",
      "unsafeHTML"
    ],
    "deadCodeBlocks": [
      "this.test"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "A plugin configuration component for managing a list of external links.",
      "businessCapabilities": [
        "Allows users to add, edit, and remove external links.",
        "Stores and retrieves link configurations for a project."
      ],
      "technicalCapabilities": [
        "Renders a list of configurable links.",
        "Provides an interface for adding new links with title, URL, and color.",
        "Persists link data using project configuration services.",
        "Handles user interactions for link management (add, delete, edit mode)."
      ],
      "implementedFeatures": [
        "Displaying a list of links.",
        "Adding new links.",
        "Deleting existing links.",
        "Toggling an edit mode for link management.",
        "Saving link configurations to project settings."
      ],
      "constraints": [
        "Requires 'mls.actualProject' to be defined for configuration operations.",
        "Link title and URL are mandatory for adding a new link."
      ]
    }
  }
}
    