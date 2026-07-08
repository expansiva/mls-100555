/// <mls fileReference="_100555_/l2/pluginSiteMonitorDashboard/pluginResponseTime.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginSiteMonitorDashboard/pluginSiteMonitorDashboardResponseTime.ts",
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
      "generalDescription": "Response Time",
      "businessCapabilities": [
        "Display average response time over time"
      ],
      "technicalCapabilities": [
        "Render SVG icon",
        "Prepare chart data",
        "Update DOM with chart widget"
      ],
      "implementedFeatures": [
        "Filter by time period",
        "Chart display with line series",
        "Mark points and lines"
      ]
    }
  }
}
    