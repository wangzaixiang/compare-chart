// Test dataset generator for stacked area chart
// Date range: 2020-01-01 to 2020-12-31 (366 days due to leap year)
// Products: product1 to product100 (100 products)

export interface DataPoint {
  date: string;
  product: string;
  sales: number;
}

export function generateTestData(): DataPoint[] {
  const data: DataPoint[] = [];
  const startDate = new Date('2020-01-01');
  const endDate = new Date('2020-12-31');
  const productCount = 100;
  
  // Generate all dates in 2020
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Generate data for all 100 products for this date
    for (let i = 1; i <= productCount; i++) {
      const product = `product${i}`;
      // Generate random sales data with some variation
      const baseSales = Math.random() * 1000 + 100;
      const seasonalFactor = 1 + 0.3 * Math.sin((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365) * 2 * Math.PI);
      const productFactor = 0.5 + (i / productCount) * 1.5; // Different products have different base sales
      const sales = Math.round(baseSales * seasonalFactor * productFactor);
      
      data.push({
        date: dateStr,
        product,
        sales
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}

// Pre-generate the dataset
export const testData = generateTestData();

console.log(`Generated ${testData.length} data points`);
console.log(`Date range: ${testData[0].date} to ${testData[testData.length - 1].date}`);
console.log(`Sample data:`, testData.slice(0, 5));