/// <mls fileReference="_100555_/l2/pluginNewFile/pluginNewFileWebComponent.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginNewFile/pluginNewFileWebComponent.ts",
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
      "plugin-new-file--widget-text-code-100555"
    ],
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html",
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
        "ref": "/_102029_/l2/stateLitElement.js",
        "dependencies": [
          {
            "name": "StateLitElement",
            "type": "class"
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
        "ref": "/_102029_/l2/collabDecorators.js",
        "dependencies": [
          {
            "name": "propertyDataSource",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/serviceBase.js",
        "dependencies": [
          {
            "name": "ServiceBase",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100555_/l2/pluginNewFile/pluginNewFileBase.js",
        "dependencies": [
          {
            "name": "IDetails",
            "type": "interface"
          },
          {
            "name": "createNewFile",
            "type": "function"
          },
          {
            "name": "changeTagName",
            "type": "function"
          },
          {
            "name": "changeClassName",
            "type": "function"
          },
          {
            "name": "changeWidget",
            "type": "function"
          },
          {
            "name": "getTemplateImport",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100555_/l2/pluginNewFile/widgetTextCode.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin to create a new Lit web component file",
      "businessCapabilities": [
        "Generate Lit web component template",
        "Create new file in project"
      ],
      "technicalCapabilities": [
        "Uses Lit framework",
        "Custom element decorator",
        "Extends StateLitElement"
      ],
      "implementedFeatures": [
        "Template generation",
        "File creation",
        "Preview display"
      ],
      "constraints": [
        "Requires valid project and shortName"
      ]
    }
  }
}
    