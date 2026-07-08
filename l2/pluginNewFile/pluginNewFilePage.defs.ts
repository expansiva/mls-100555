/// <mls fileReference="_100555_/l2/pluginNewFile/pluginNewFilePage.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginNewFile/pluginNewFilePage.ts",
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
          }
        ]
      },
      {
        "ref": "/ _102027_/l2/utils.js",
        "dependencies": [
          {
            "name": "convertFileNameToTag"
          }
        ]
      },
      {
        "ref": "/_102029_/l2/stateLitElement.js",
        "dependencies": [
          {
            "name": "StateLitElement"
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
        "ref": "/_102029_/l2/collabDecorators.js",
        "dependencies": [
          {
            "name": "propertyDataSource"
          }
        ]
      },
      {
        "ref": "/_100555_/l2/pluginNewFile/pluginNewFileBase.js",
        "dependencies": [
          {
            "name": "IDetails"
          },
          {
            "name": "createNewFile"
          },
          {
            "name": "changeTagName"
          },
          {
            "name": "changeClassName"
          },
          {
            "name": "changeWidget"
          },
          {
            "name": "changeStateName"
          },
          {
            "name": "getTemplateImport"
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
        "ref": "/_100555_/l2/pluginNewFile/widgetTextCode.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Create a page file.",
      "businessCapabilities": [
        "Create a page file",
        "Manipulate the globalState",
        "Handle page events"
      ],
      "technicalCapabilities": [
        "Lit framework",
        "Custom element",
        "TypeScript",
        "i18n support"
      ],
      "implementedFeatures": [
        "Generate TypeScript template",
        "Generate HTML snippet",
        "Create new file",
        "Display loading state",
        "Error handling"
      ],
      "constraints": [
        "File name must start with \"page\""
      ]
    }
  }
}
    