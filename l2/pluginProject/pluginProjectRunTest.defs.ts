/// <mls fileReference="_100555_/l2/pluginProject/pluginProjectRunTest.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginProject/pluginProjectRunTest.ts",
    "componentType": "pluginSettings",
    "componentScope": "editor",
    "languages": [
      "en",
      "pt"
    ],
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "collab-result-container-100554",
      "collab-result-test-100554",
      "plugin-project--plugin-project-run-test-100555"
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
            "name": "repeat",
            "type": "function"
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
          }
        ]
      },
      {
        "ref": "/_102027_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "forceServiceInstance",
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
        "ref": "/_100555_/l2/utils/tsTestAST.js",
        "dependencies": [
          {
            "name": "ICANTest",
            "type": "interface"
          },
          {
            "name": "ICANIntegration",
            "type": "interface"
          },
          {
            "name": "TsTestAst",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabPageElement.js",
        "dependencies": [
          {
            "name": "CollabPageElement",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100555_/l2/utils/collabIcons.js",
        "dependencies": [
          {
            "name": "collab_fileTest",
            "type": "constant"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabResultTest.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin to run tests for project pages",
      "businessCapabilities": [
        "Automatically runs all available tests for pages with tests in the project"
      ],
      "technicalCapabilities": [
        "Uses LitElement for UI",
        "Interacts with Monaco editor for AST",
        "Manages test execution and results display"
      ],
      "implementedFeatures": [
        "Render UI with progress bar",
        "Execute tests",
        "Display results",
        "Calculate progress",
        "Handle i18n"
      ]
    }
  }
}
    