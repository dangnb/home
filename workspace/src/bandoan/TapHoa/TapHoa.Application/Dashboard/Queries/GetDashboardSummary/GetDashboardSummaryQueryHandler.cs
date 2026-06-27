using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Dashboard.DTOs;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
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
            summary.TotalProducts = await connection.ExecuteScalarAsync<int>(WithSoftDelete("SELECT COUNT(1) FROM Products"));
            summary.TotalCustomers = await connection.ExecuteScalarAsync<int>(WithSoftDelete("SELECT COUNT(1) FROM Customers"));
            summary.TotalSuppliers = await connection.ExecuteScalarAsync<int>(WithSoftDelete("SELECT COUNT(1) FROM Suppliers"));

            // 2. Low Stock Count
            summary.LowStockCount = await connection.ExecuteScalarAsync<int>(
                WithSoftDelete("SELECT COUNT(1) FROM Products WHERE StockQuantity <= 10 AND Status != 'Ngừng kinh doanh'"));

            // 3. Total Stock Value
            summary.TotalStockValue = await connection.ExecuteScalarAsync<decimal>(
                WithSoftDelete("SELECT COALESCE(SUM(StockQuantity * Price), 0) FROM Products"));

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
            var recentTx = await connection.QueryAsync<DashboardRecentTransactionDto>(WithSoftDelete(recentTxSql));
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
                WHERE t.Type = 2 AND t.Status = 3 -- Outbound (2) and Completed (3)
                GROUP BY p.Id, p.Name, c.Name, p.Unit
                ORDER BY TotalExportQuantity DESC
                LIMIT 5";
            var topProducts = await connection.QueryAsync<DashboardTopProductDto>(WithSoftDelete(topProductsSql));
            summary.TopProducts = topProducts.ToList();

            return summary;
        }

        // Helper to ensure soft‑delete filter is applied to any raw SQL.
        private static string WithSoftDelete(string sql)
        {
            const string softClause = "IsDeleted = 0";
            // Trim any trailing whitespace for reliable processing
            var trimmed = sql.TrimEnd();
            // Check if there is already a WHERE clause (case‑insensitive)
            var whereIndex = trimmed.IndexOf("WHERE", System.StringComparison.OrdinalIgnoreCase);
            if (whereIndex >= 0)
            {
                // Insert the soft‑delete condition after existing WHERE
                var insertPos = whereIndex + 5; // length of "WHERE"
                return trimmed.Insert(insertPos, $" {softClause} AND");
            }
            else
            {
                // No WHERE – add one before ORDER BY / GROUP BY / LIMIT if present
                var lower = trimmed.ToLowerInvariant();
                var pos = lower.IndexOf("order by");
                if (pos < 0) pos = lower.IndexOf("group by");
                if (pos < 0) pos = lower.IndexOf("limit");
                if (pos < 0)
                {
                    return $"{trimmed} WHERE {softClause}";
                }
                else
                {
                    return trimmed.Insert(pos, $" WHERE {softClause}");
                }
            }
        }
    }
}
