/// <mls fileReference="_100555_/l2/pluginModule/pluginDeleteModule.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginModule/pluginDeleteModule.ts",
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
      "plugin-module--plugin-delete-module-100555"
    ],
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html",
            "type": "function",
            "purpose": "Template literal tag for rendering HTML"
          },
          {
            "name": "css",
            "type": "function",
            "purpose": "Template literal tag for styling"
          },
          {
            "name": "TemplateResult",
            "type": "type",
            "purpose": "Type for Lit HTML template results"
          }
        ]
      },
      {
        "ref": "lit/decorators.js",
        "dependencies": [
          {
            "name": "customElement",
            "type": "function",
            "purpose": "Decorator to define a custom element"
          },
          {
            "name": "state",
            "type": "function",
            "purpose": "Decorator to declare reactive state property"
          },
          {
            "name": "property",
            "type": "function",
            "purpose": "Decorator to declare reactive property"
          }
        ]
      },
      {
        "ref": "/_102029_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "CollabLitElement",
            "type": "class",
            "purpose": "Base class for Collab.codes Lit elements"
          }
        ]
      },
      {
        "ref": "/_100555_/l2/utils/projectAST.js",
        "dependencies": [
          {
            "name": "removeModule",
            "type": "function",
            "purpose": "Function to remove a module from the project AST"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/designSystemBase.js",
        "dependencies": [
          {
            "name": "removeTokensTheme",
            "type": "function",
            "purpose": "Function to remove design tokens associated with a theme"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibStor.js",
        "dependencies": [
          {
            "name": "deleteFile",
            "type": "function",
            "purpose": "Function to mark a file for deletion"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "A UI component for deleting a module and its associated files and design tokens.",
      "businessCapabilities": [
        "Module deletion",
        "File deletion",
        "Design token removal"
      ],
      "technicalCapabilities": [
        "Front-end UI rendering (LitElement)",
        "State management (LitElement)",
        "File system interaction (via collabLibStor.js)",
        "AST manipulation (via projectAST.js)",
        "Design system token management (via designSystemBase.js)",
        "Internationalization (i18n)"
      ],
      "implementedFeatures": [
        "Module name confirmation for deletion",
        "Displaying files to be deleted",
        "Deleting module files",
        "Removing module from project AST",
        "Removing associated design tokens",
        "User feedback on deletion status"
      ],
      "constraints": [
        "Requires module name confirmation for deletion",
        "Requires mls.stor access for file operations",
        "Requires projectAST and designSystemBase for module and token removal"
      ]
    }
  }
}
    