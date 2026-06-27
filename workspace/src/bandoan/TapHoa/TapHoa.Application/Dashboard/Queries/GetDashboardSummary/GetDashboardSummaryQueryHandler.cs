using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Dashboard.DTOs;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using TapHoa.Domain.Entities.Warehouse;
using System;
using Dapper;

namespace TapHoa.Application.Dashboard.Queries.GetDashboardSummary
{
    public class GetDashboardSummaryQueryHandler : IRequestHandler<GetDashboardSummaryQuery, DashboardSummaryDto>
    {
        private readonly ISqlConnectionFactory _sqlConnectionFactory;

        public GetDashboardSummaryQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
        {
            _sqlConnectionFactory = sqlConnectionFactory;
        }

        public async Task<DashboardSummaryDto> Handle(GetDashboardSummaryQuery request, CancellationToken cancellationToken)
        {
            var summary = new DashboardSummaryDto();
            using var connection = _sqlConnectionFactory.CreateConnection();

            // 1. Basic Counts
            summary.TotalProducts = await connection.ExecuteScalarAsync<int>("SELECT COUNT(1) FROM Products WHERE IsDeleted = 0");
            summary.TotalCustomers = await connection.ExecuteScalarAsync<int>("SELECT COUNT(1) FROM Customers WHERE IsDeleted = 0");
            summary.TotalSuppliers = await connection.ExecuteScalarAsync<int>("SELECT COUNT(1) FROM Suppliers WHERE IsDeleted = 0");

            // 2. Low Stock Count
            summary.LowStockCount = await connection.ExecuteScalarAsync<int>("SELECT COUNT(1) FROM Products WHERE IsDeleted = 0 AND StockQuantity <= 10 AND Status != 'Ngừng kinh doanh'");

            // 3. Total Stock Value
            summary.TotalStockValue = await connection.ExecuteScalarAsync<decimal>("SELECT COALESCE(SUM(StockQuantity * Price), 0) FROM Products WHERE IsDeleted = 0");

            // 4. Recent Transactions (Top 5)
            var recentTxSql = @"
                SELECT 
                    Code AS TransactionCode, 
                    CreatedAt, 
                    Type, 
                    COALESCE(CreatedBy, 'System') AS CreatedBy,
                    (SELECT COALESCE(SUM(ABS(Quantity) * UnitCost), 0) FROM InventoryTransactionLines WHERE TransactionId = t.Id) AS TotalValue
                FROM InventoryTransactions t
                ORDER BY CreatedAt DESC
                LIMIT 5";
            
            var recentTx = await connection.QueryAsync<DashboardRecentTransactionDto>(recentTxSql);
            summary.RecentTransactions = recentTx.ToList();

            // 5. Top Products (By Export Volume)
            var topProductsSql = @"
                SELECT
                    p.Id AS ProductId,
                    p.Name AS ProductName,
                    COALESCE(c.Name, 'Không phân loại') AS Category,
                    p.Unit,
                    SUM(ABS(l.Quantity)) AS TotalExportQuantity,
                    SUM(ABS(l.Quantity) * l.UnitCost) AS TotalExportValue
                FROM InventoryTransactionLines l
                INNER JOIN InventoryTransactions t ON l.TransactionId = t.Id
                INNER JOIN Products p ON l.ProductId = p.Id
                LEFT JOIN Categories c ON p.CategoryId = c.Id
                WHERE t.Type = 1 -- Export
                GROUP BY p.Id, p.Name, c.Name, p.Unit
                ORDER BY TotalExportQuantity DESC
                LIMIT 5";

            var topProducts = await connection.QueryAsync<DashboardTopProductDto>(topProductsSql);
            summary.TopProducts = topProducts.ToList();

            return summary;
        }
    }
}
