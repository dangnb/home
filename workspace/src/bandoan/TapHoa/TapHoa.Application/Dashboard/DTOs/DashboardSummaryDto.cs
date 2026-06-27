using System;
using System.Collections.Generic;

namespace TapHoa.Application.Dashboard.DTOs
{
    public class DashboardSummaryDto
    {
        public int TotalProducts { get; set; }
        public int TotalCustomers { get; set; }
        public int TotalSuppliers { get; set; }
        public int LowStockCount { get; set; }
        public decimal TotalStockValue { get; set; }
        public List<DashboardRecentTransactionDto> RecentTransactions { get; set; } = new();
        public List<DashboardTopProductDto> TopProducts { get; set; } = new();
    }

    public class DashboardRecentTransactionDto
    {
        public string TransactionCode { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int Type { get; set; } // 0: Import, 1: Export, 2: Adjust
        public string CreatedBy { get; set; } = string.Empty;
        public decimal TotalValue { get; set; }
    }

    public class DashboardTopProductDto
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int TotalExportQuantity { get; set; }
        public decimal TotalExportValue { get; set; }
        public string Unit { get; set; } = string.Empty;
    }
}
