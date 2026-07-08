/// <mls fileReference="_100555_/l2/pluginExplore/pluginExploreListAddL1.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginExplore/pluginExploreListAddL1.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "languages": [
      "en",
      "pt"
    ]
  },
  "references": {
    "webComponents": [
      "plugin-explore--plugin-explore-list-add-l1-100555"
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
          },
          {
            "name": "query",
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
        "ref": "/_102029_/l2/collabLitElement.js",
        "dependencies": [
          {
            "name": "CollabLitElement",
            "type": "class"
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
        "ref": "/_102027_/l2/libCommom.js",
        "dependencies": [
          {
            "name": "isNameValid",
            "type": "function"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/collabLibStor.js",
        "dependencies": [
          {
            "name": "createStorFile",
            "type": "function"
          },
          {
            "name": "IReqCreateStorFile",
            "type": "interface"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "A LitElement component for adding new files/items within a project, supporting internationalization and basic input validation.",
      "businessCapabilities": [
        "Allow users to add new project items (files/folders).",
        "Validate user input for new item names.",
        "Provide internationalized labels and messages.",
        "Manage project-specific file creation."
      ],
      "technicalCapabilities": [
        "Renders dynamic HTML using Lit.",
        "Handles user input events.",
        "Interacts with a backend storage service (createStorFile).",
        "Manages component state using Lit properties and decorators.",
        "Integrates with a global mls object for project context and event firing.",
        "Persists history in localStorage."
      ],
      "implementedFeatures": [
        "Display project and short name input fields.",
        "Input validation for short name (no spaces, not purely numeric, not starting with digit).",
        "Error message display for invalid input.",
        "Add button to trigger file creation.",
        "Navigation back/cancel functionality.",
        "Loading indicator management.",
        "Internationalization for UI labels and messages (English and Portuguese).",
        "History tracking of created files in local storage.",
        "Event firing upon successful file creation."
      ],
      "constraints": [
        "Short name cannot contain spaces.",
        "Short name cannot be purely numeric.",
        "Short name cannot start with a digit.",
        "Requires a project to be selected."
      ]
    }
  }
}
    