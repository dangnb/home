using System;
using System.Collections.Generic;

namespace TapHoa.Application.Reports.DTOs;

public class RevenueProfitReportDto
{
    public decimal TotalRevenue { get; set; }
    public decimal TotalProfit { get; set; }
    public int TotalOrders { get; set; }
    
    public List<RevenueChartDataDto> ChartData { get; set; } = new();
}

public class RevenueChartDataDto
{
    public string Label { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public decimal Profit { get; set; }
    public int OrderCount { get; set; }
}

public class TopProductReportDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    
    public int TotalQuantitySold { get; set; }
    public decimal TotalRevenue { get; set; }
}

public class DeadStockReportDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public int AvailableQuantity { get; set; }
    public int DaysSinceLastSale { get; set; }
}

public class CustomerAnalyticsDto
{
    public Guid? CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public int TotalOrders { get; set; }
    public decimal TotalSpent { get; set; }
    public DateTime? LastPurchaseDate { get; set; }
}

public class EmployeePerformanceDto
{
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
}
