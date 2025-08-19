import { testData, DataPoint } from './data.js';

// ECharts implementation for stacked area chart
export class EChartsStackedAreaChart {
  private chartInstance: any;
  private data: DataPoint[];

  constructor(containerId: string) {
    this.data = testData;

    // This assumes ECharts is available
    if (typeof window !== 'undefined' && (window as any).echarts) {
      this.initChart(containerId);
    } else {
      console.error('ECharts not available. Please include ECharts in your HTML:');
      console.log('<script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>');
    }
  }

  private initChart(containerId: string) {
    const echarts = (window as any).echarts;
    
    // Get the container element
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }

    // Initialize the chart
    this.chartInstance = echarts.init(container);
    
    // Generate chart configuration and render
    const option = this.generateChartOption();
    this.chartInstance.setOption(option);

    // Handle window resize
    window.addEventListener('resize', () => {
      this.chartInstance.resize();
    });
  }

  private generateChartOption() {
    // Transform data for ECharts
    const transformedData = this.transformDataForECharts();
    
    const option = {
      title: {
        text: 'Product Sales Over Time (Stacked Area Chart)',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        formatter: function(params: any) {
          let result = `${params[0].axisValue}<br/>`;
          let total = 0;
          params.forEach((param: any) => {
            total += param.value;
            result += `${param.marker} ${param.seriesName}: ${param.value.toLocaleString()}<br/>`;
          });
          result += `<strong>Total: ${total.toLocaleString()}</strong>`;
          return result;
        }
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 50,
        bottom: 20,
        data: transformedData.products.slice(0, 20), // Show only first 20 in legend
        textStyle: {
          fontSize: 10
        }
      },
      grid: {
        left: '3%',
        right: '15%',
        bottom: '10%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {
            title: 'Save as Image'
          },
          dataZoom: {
            title: {
              zoom: 'Zoom',
              back: 'Reset Zoom'
            }
          },
          restore: {
            title: 'Restore'
          }
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: transformedData.dates,
        axisLabel: {
          formatter: function(value: string) {
            return new Date(value).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short' 
            });
          },
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: 'Sales',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: function(value: number) {
            return value.toLocaleString();
          }
        }
      },
      dataZoom: [
        {
          type: 'slider',
          start: 0,
          end: 100,
          height: 20,
          bottom: 30
        },
        {
          type: 'inside',
          start: 0,
          end: 100
        }
      ],
      series: transformedData.series
    };

    return option;
  }

  private transformDataForECharts() {
    // Get unique dates and products
    const dates = Array.from(new Set(this.data.map(d => d.date))).sort();
    const products = Array.from(new Set(this.data.map(d => d.product))).sort();

    // Create color palette
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
      '#10ac84', '#ee5a6f', '#0abde3', '#3867d6', '#8854d0',
      '#a55eea', '#26de81', '#2bcbba', '#eb3b5a', '#fa8231'
    ];

    // Generate series data
    const series = products.map((product, index) => {
      const productData = dates.map(date => {
        const dataPoint = this.data.find(d => d.date === date && d.product === product);
        return dataPoint ? dataPoint.sales : 0;
      });

      return {
        name: product,
        type: 'line',
        stack: 'Total',
        areaStyle: {
          opacity: 0.8
        },
        emphasis: {
          focus: 'series'
        },
        data: productData,
        itemStyle: {
          color: colors[index % colors.length]
        },
        lineStyle: {
          width: 0
        },
        symbol: 'none',
        smooth: true
      };
    });

    return {
      dates,
      products,
      series
    };
  }

  // Public method to update chart data
  public updateData(newData: DataPoint[]) {
    this.data = newData;
    if (this.chartInstance) {
      const option = this.generateChartOption();
      this.chartInstance.setOption(option, true);
    }
  }

  // Public method to resize chart
  public resize() {
    if (this.chartInstance) {
      this.chartInstance.resize();
    }
  }

  // Public method to dispose chart
  public dispose() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  }
}

// Function to create and render the chart
export function renderEChartsChart(containerId: string) {
  return new EChartsStackedAreaChart(containerId);
}

// Simple function to get ECharts option without creating chart instance
export function getEChartsOption(data: DataPoint[] = testData) {
  const dates = Array.from(new Set(data.map(d => d.date))).sort();
  const products = Array.from(new Set(data.map(d => d.product))).sort();

  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
    '#10ac84', '#ee5a6f', '#0abde3', '#3867d6', '#8854d0',
    '#a55eea', '#26de81', '#2bcbba', '#eb3b5a', '#fa8231'
  ];

  const series = products.map((product, index) => {
    const productData = dates.map(date => {
      const dataPoint = data.find(d => d.date === date && d.product === product);
      return dataPoint ? dataPoint.sales : 0;
    });

    return {
      name: product,
      type: 'line',
      stack: 'Total',
      areaStyle: { opacity: 0.8 },
      data: productData,
      itemStyle: { color: colors[index % colors.length] },
      lineStyle: { width: 0 },
      symbol: 'none',
      smooth: true
    };
  });

  return {
    title: {
      text: 'Product Sales Over Time (Stacked Area Chart)',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 50,
      data: products.slice(0, 20)
    },
    grid: {
      left: '3%',
      right: '15%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates
    },
    yAxis: {
      type: 'value',
      name: 'Sales'
    },
    series
  };
}

// Usage example:
// renderEChartsChart('echarts-chart-container');