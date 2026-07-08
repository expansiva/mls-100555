/// <mls fileReference="_100555_/l2/pluginSiteMonitorDashboard/pluginSpikes.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const asis: mls.defs.AsIs = {
  "meta": {
    "fileReference": "_100555_/l2/pluginSiteMonitorDashboard/pluginSiteMonitorDashboardSpikes.ts",
    "componentType": "pluginUI",
    "componentScope": "appFrontEnd",
    "group": "enhancement"
  },
  "references": {
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
        "ref": "/_102027_/l2/pluginBaseModule.js",
        "dependencies": [
          {
            "name": "PluginBaseModule"
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
      "generalDescription": "Spikes",
      "businessCapabilities": [
        "Monitor hourly traffic spikes",
        "Display chart with number of requests over time"
      ],
      "technicalCapabilities": [
        "Renders SVG chart using Lit",
        "Handles filter changes for time periods"
      ],
      "implementedFeatures": [
        "Chart rendering with tooltip, legend, xAxis, yAxis, series",
        "Filter selection for today, week, month, all time",
        "Dynamic import of widgetCollabChart",
        "InnerHTML injection of chart component"
      ]
    }
  }
}
    