/// <mls fileReference="_100555_/l2/pluginEditL3/pluginEditStyleL3.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginEditL3/pluginEditStyleL3.ts",
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
      "plugin-edit-l3--plugin-edit-style-l3-100555",
      "mls-editor-100529"
    ],
    "imports": [
      {
        "ref": "lit",
        "dependencies": [
          {
            "name": "html",
            "type": "constant"
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
            "name": "query",
            "type": "function"
          },
          {
            "name": "property",
            "type": "function"
          },
          {
            "name": "state",
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
        "ref": "/_102027_/l2/pluginBaseModule.js",
        "dependencies": [
          {
            "name": "PluginBaseModule",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100555_/l2/pluginEditL3/pluginEditStyleAST.js",
        "dependencies": [
          {
            "name": "LessAST",
            "type": "class"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "unusedImports": [
      "repeat"
    ],
    "i18nWarnings": [
      "Not found storfile",
      "Not found preview",
      "Not found base model",
      "Not found model",
      "Not found element"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "A LitElement component for editing Less styles of components within the Collab.codes editor, specifically for level 3 (L3) files, integrating with Monaco Editor for code manipulation and real-time updates.",
      "businessCapabilities": [
        "Enables users to directly edit Less styles for components in the editor.",
        "Provides real-time feedback and updates on style changes.",
        "Integrates with the Collab.codes file system and preview environment for style management."
      ],
      "technicalCapabilities": [
        "Utilizes LitElement for building interactive web components.",
        "Integrates Monaco Editor for advanced code editing functionalities.",
        "Parses and manipulates Less CSS using a custom AST (LessAST).",
        "Manages editor models and content synchronization.",
        "Handles editor-specific events for interaction and updates.",
        "Supports internationalization (i18n) for messages."
      ],
      "implementedFeatures": [
        "Monaco Editor initialization and configuration.",
        "Loading and saving Less style files.",
        "Creation and management of Monaco editor models for original and destination styles.",
        "Parsing Less content into an Abstract Syntax Tree (AST).",
        "Merging and updating CSS declarations between style models.",
        "Identifying and applying styles to active elements in the preview iframe.",
        "Event handling for editor level changes and toolbar selections.",
        "Dynamic resizing of the editor based on component properties."
      ],
      "constraints": [
        "Requires the global 'mls' object for editor services, events, and file storage.",
        "Depends on the 'monaco.editor' global object for code editing functionality.",
        "Relies on 'window.preview.iframe' for accessing the preview environment and its content.",
        "Assumes specific file naming conventions for tag conversion.",
        "Requires the presence of 'mls-editor-100529' web component for rendering the editor UI."
      ]
    }
  }
}
    