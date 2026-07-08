/// <mls fileReference="_100555_/l2/pluginSiteMonitorDashboard/pluginSiteMonitorDashboardRegionalLatency.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginSiteMonitorDashboard/pluginSiteMonitorDashboardRegionalLatency.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "widget-collab-chart-100554"
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
            "name": "css"
          },
          {
            "name": "svg"
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
            "name": "query"
          },
          {
            "name": "property"
          }
        ]
      },
      {
        "ref": "/_102027_/l2/plugins/pluginBaseModule.js",
        "dependencies": [
          {
            "name": "PluginBaseModule",
            "type": "class"
          }
        ]
      },
      {
        "ref": "/_100554_/l2/widgetCollabChart.js"
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Regional Latency",
      "businessCapabilities": [
        "Monitor regional latency"
      ],
      "technicalCapabilities": [
        "Render bar chart",
        "Use Lit for templating"
      ],
      "implementedFeatures": [
        "Filter by time periods",
        "Display latency data in bar chart",
        "Support simplified and full modes"
      ],
      "constraints": [
        "Requires dashboard scope"
      ]
    }
  }
}
    