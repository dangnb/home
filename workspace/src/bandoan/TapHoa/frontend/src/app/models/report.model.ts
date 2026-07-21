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

export interface ProfitLossReport {
    month: number;
    year: number;
    grossRevenue: number;
    returnAmount: number;
    discountAmount: number;
    netRevenue: number;
    costOfGoodsSold: number;
    grossProfit: number;
    grossProfitMargin: number;
    fixedExpenses: number;
    variableExpenses: number;
    salaryExpenses: number;
    totalOperatingExpenses: number;
    netProfit: number;
    netProfitMargin: number;
    expenseBreakdown: ProfitLossLineItem[];
    monthlyTrend: MonthlyTrendItem[];
}

export interface ProfitLossLineItem {
    name: string;
    amount: number;
}

export interface MonthlyTrendItem {
    month: number;
    year: number;
    revenue: number;
    profit: number;
}

export interface DeadStockReport {
    productId: string;
    productName: string;
    categoryName: string;
    availableQuantity: number;
    daysSinceLastSale: number;
}

export interface CustomerAnalytics {
    customerId?: string;
    customerName: string;
    phoneNumber: string;
    totalOrders: number;
    totalSpent: number;
    lastPurchaseDate?: string;
}

export interface EmployeePerformance {
    username: string;
    fullName: string;
    totalOrders: number;
    totalRevenue: number;
}
