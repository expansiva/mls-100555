/// <mls fileReference="_100555_/l2/pluginSiteMonitorDashboard/pluginSiteMonitorDashboardActiveUsers.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginSiteMonitorDashboard/pluginSiteMonitorDashboardActiveUsers.ts",
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
            "name": "html"
          },
          {
            "name": "css"
          },
          {
            "name": "svg"
          },
          {
            "name": "TemplateResult"
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
            "name": "PluginBaseModule"
          }
        ]
      }
    ]
  },
  "asIs": {
    "semantic": {
      "generalDescription": "Active Users",
      "businessCapabilities": [
        "Display active users chart",
        "Filter by time periods"
      ],
      "technicalCapabilities": [
        "Uses Lit for rendering",
        "Renders chart with widget-collab-chart"
      ],
      "implementedFeatures": [
        "Chart data for anonymous and logged-in users",
        "Time filter options"
      ]
    }
  }
}
    