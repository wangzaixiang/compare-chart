import { testData, DataPoint } from './data.js';

// D3.js implementation for stacked area chart
export class D3StackedAreaChart {
  private width: number;
  private height: number;
  private margin: { top: number; right: number; bottom: number; left: number };
  private svg: any;
  private data: DataPoint[];

  constructor(containerId: string, width = 800, height = 400) {
    this.width = width;
    this.height = height;
    this.margin = { top: 20, right: 120, bottom: 60, left: 60 };
    this.data = testData;

    // This assumes D3.js is available
    if (typeof window !== 'undefined' && (window as any).d3) {
      this.initChart(containerId);
    } else {
      console.error('D3.js not available. Please include D3.js in your HTML:');
      console.log('<script src="https://d3js.org/d3.v7.min.js"></script>');
    }
  }

  private initChart(containerId: string) {
    const d3 = (window as any).d3;
    
    // Clear any existing chart
    d3.select(`#${containerId}`).selectAll('*').remove();

    // Create SVG
    this.svg = d3.select(`#${containerId}`)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.render();
  }

  private render() {
    const d3 = (window as any).d3;
    
    // Get unique dates and products
    const dates = Array.from(new Set(this.data.map(d => d.date))).sort();
    const products = Array.from(new Set(this.data.map(d => d.product))).sort();

    // Prepare data for stacking
    const stackData = this.prepareStackData();
    
    // Create stack generator
    const stack = d3.stack()
      .keys(products)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const series = stack(stackData);

    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(dates, (d: string) => new Date(d)))
      .range([0, this.width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(series, (d: any) => d3.max(d, (layer: any) => layer[1]))])
      .nice()
      .range([this.height, 0]);

    const colorScale = d3.scaleOrdinal()
      .domain(products)
      .range(d3.schemeTableau10);

    // Create area generator
    const area = d3.area()
      .x((d: any) => xScale(new Date(d.data.date)))
      .y0((d: any) => yScale(d[0]))
      .y1((d: any) => yScale(d[1]))
      .curve(d3.curveMonotoneX);

    // Add areas
    this.svg.selectAll('.area')
      .data(series)
      .enter()
      .append('path')
      .attr('class', 'area')
      .attr('d', area)
      .attr('fill', (d: any) => colorScale(d.key))
      .attr('opacity', 0.8)
      .on('mouseover', function(this: SVGPathElement, event: any, d: any) {
        d3.select(this).attr('opacity', 1);
      })
      .on('mouseout', function(this: SVGPathElement, event: any, d: any) {
        d3.select(this).attr('opacity', 0.8);
      });

    // Add x-axis
    this.svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat('%Y-%m'))
        .ticks(d3.timeMonth.every(2)))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    // Add y-axis
    this.svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale));

    // Add axis labels
    this.svg.append('text')
      .attr('class', 'x-label')
      .attr('text-anchor', 'middle')
      .attr('x', this.width / 2)
      .attr('y', this.height + 50)
      .text('Date');

    this.svg.append('text')
      .attr('class', 'y-label')
      .attr('text-anchor', 'middle')
      .attr('y', -40)
      .attr('x', -this.height / 2)
      .attr('transform', 'rotate(-90)')
      .text('Total Sales');

    // Add title
    this.svg.append('text')
      .attr('class', 'chart-title')
      .attr('text-anchor', 'middle')
      .attr('x', this.width / 2)
      .attr('y', -5)
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Product Sales Over Time (Stacked Area Chart)');

    // Add legend (simplified - showing only first 20 products)
    const legend = this.svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${this.width + 10}, 20)`);

    const legendItems = legend.selectAll('.legend-item')
      .data(products.slice(0, 20))
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d: string, i: number) => `translate(0, ${i * 18})`);

    legendItems.append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', (d: string) => colorScale(d));

    legendItems.append('text')
      .attr('x', 16)
      .attr('y', 9)
      .style('font-size', '12px')
      .text((d: string) => d);
  }


  private prepareStackData() {
    const dates = Array.from(new Set(this.data.map(d => d.date))).sort();
    const products = Array.from(new Set(this.data.map(d => d.product))).sort();

    return dates.map(date => {
      const dateData = this.data.filter(d => d.date === date);
      const result: any = { date };
      
      products.forEach(product => {
        const productData = dateData.find(d => d.product === product);
        result[product] = productData ? productData.sales : 0;
      });
      
      return result;
    });
  }
}

// Function to create and render the chart
export function renderD3Chart(containerId: string, width?: number, height?: number) {
  return new D3StackedAreaChart(containerId, width, height);
}

// Usage example:
// renderD3Chart('d3-chart-container');