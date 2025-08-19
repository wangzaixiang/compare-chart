import { testData, DataPoint } from './data.js';

// Vega-Lite specification for stacked area chart
export const vegaStackedAreaChart = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  title: 'Product Sales Over Time (Stacked Area Chart)',
  width: 800,
  height: 400,
  data: {
    values: testData
  },
  mark: 'area',
  encoding: {
    x: {
      field: 'date',
      type: 'temporal',
      title: 'Date',
      axis: {
        format: '%Y-%m',
        labelAngle: -45
      }
    },
    y: {
      aggregate: 'sum',
      field: 'sales',
      type: 'quantitative',
      title: 'Total Sales',
      stack: 'zero'
    },
    color: {
      field: 'product',
      type: 'nominal',
      title: 'Product',
      scale: {
        scheme: 'category20'
      },
      legend: {
        orient: 'right',
        columns: 1,
        symbolLimit: 20
      }
    },
    order: {
      field: 'product',
      type: 'nominal'
    }
  },
  resolve: {
    scale: {
      color: 'independent'
    }
  }
};

// Function to render the chart using Vega-Embed
export function renderVegaChart(containerId: string) {
  // This assumes vega-embed is available
  // In a real application, you would import vega-embed
  if (typeof window !== 'undefined' && (window as any).vegaEmbed) {
    (window as any).vegaEmbed(`#${containerId}`, vegaStackedAreaChart, {
      theme: 'quartz',
      actions: true,
      tooltip: true
    }).then((result: any) => {
      console.log('Vega chart rendered successfully');
    }).catch((error: any) => {
      console.error('Error rendering Vega chart:', error);
    });
  } else {
    console.error('Vega-Embed not available. Please include vega-embed in your HTML:');
    console.log('<script src="https://cdn.jsdelivr.net/npm/vega@5"></script>');
    console.log('<script src="https://cdn.jsdelivr.net/npm/vega-lite@5"></script>');
    console.log('<script src="https://cdn.jsdelivr.net/npm/vega-embed@6"></script>');
  }
}

// Alternative function to get the spec for external use
export function getVegaSpec() {
  return vegaStackedAreaChart;
}

// Usage example:
// renderVegaChart('vega-chart-container');