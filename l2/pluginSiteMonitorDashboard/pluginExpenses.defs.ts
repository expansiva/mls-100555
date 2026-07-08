/// <mls fileReference="_100555_/l2/pluginSiteMonitorDashboard/pluginExpenses.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginSiteMonitorDashboard/pluginSiteMonitorDashboardExpenses.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "group": "enhancement",
    "devFidelity": "final"
  },
  "references": {
    "webComponents": [
      "widget-collab-chart-100554"
    ],
    "imports": [
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
      "generalDescription": "Expenses plugin for site monitor dashboard",
      "businessCapabilities": [
        "Display expense breakdown",
        "Filter expenses by time period"
      ],
      "technicalCapabilities": [
        "Render pie chart using widget-collab-chart",
        "Use Lit for templating"
      ],
      "implementedFeatures": [
        "Pie chart with expense data",
        "Time filter select dropdown",
        "Mode property for simplified or full view"
      ],
      "constraints": [
        "Scope must be dashboard to render"
      ]
    }
  }
}
    