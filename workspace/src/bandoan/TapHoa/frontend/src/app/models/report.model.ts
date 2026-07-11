export interface RevenueProfitReport {
    totalRevenue: number;
    totalProfit: number;
    totalOrders: number;
    chartData: RevenueChartData[];
}

export interface RevenueChartData {
    label: string;
    revenue: number;
    profit: number;
    orderCount: number;
}

export interface TopProductReport {
    productId: string;
    productName: string;
    categoryName: string;
    unit: string;
    totalQuantitySold: number;
    totalRevenue: number;
}
