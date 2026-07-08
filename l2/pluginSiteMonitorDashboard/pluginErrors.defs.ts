/// <mls fileReference="_100555_/l2/pluginSiteMonitorDashboard/pluginErrors.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginSiteMonitorDashboard/pluginSiteMonitorDashboardErrors.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
    "webComponents": [
      "plugin-site-monitor-dashboard--plugin-errors-100555",
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
      "generalDescription": "Errors",
      "businessCapabilities": [
        "Monitor dashboard errors"
      ],
      "technicalCapabilities": [
        "Render SVG charts",
        "Use Lit framework"
      ],
      "implementedFeatures": [
        "Filter by time period",
        "Display bar chart of error codes"
      ]
    }
  }
}
    