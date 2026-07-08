/// <mls fileReference="_100555_/l2/pluginSystem/pluginSystemLanguage.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginSystem/pluginSystemLanguage.ts",
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
        "ref": "/_102027_/l2/pluginBaseModule.js",
        "dependencies": [
          {
            "name": "PluginBaseModule",
            "type": "class"
          }
        ]
      }
    ]
  },
  "codeInsights": {
    "i18nWarnings": [
      "Default",
      "pt-BR",
      "en-US"
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Plugin for system language selection",
      "businessCapabilities": [
        "Select language",
        "Change language",
        "Store user language preference"
      ],
      "technicalCapabilities": [
        "Lit-based custom element",
        "i18n support",
        "localStorage usage"
      ],
      "implementedFeatures": [
        "Render language select dropdown",
        "Handle language change",
        "Persist language in localStorage"
      ]
    }
  }
}
    