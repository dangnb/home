using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Reports.DTOs;

namespace TapHoa.Application.Reports.Queries.GetTopProductsReport;

public class GetTopProductsReportQueryHandler : IRequestHandler<GetTopProductsReportQuery, List<TopProductReportDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetTopProductsReportQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<List<TopProductReportDto>> Handle(GetTopProductsReportQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();

        string orderByClause = request.OrderBy.ToLower() == "revenue" 
            ? "TotalRevenue DESC" 
            : "TotalQuantitySold DESC";

        var sql = $@"
            SELECT 
                p.Id as ProductId,
                p.Name as ProductName,
                COALESCE(c.Name, 'Không phân loại') as CategoryName,
                p.Unit,
                SUM(od.Quantity) as TotalQuantitySold,
                SUM(od.SubTotal) as TotalRevenue
            FROM OrderDetails od
            JOIN Orders o ON od.OrderId = o.Id
            JOIN Products p ON od.ProductId = p.Id
            LEFT JOIN Categories c ON p.CategoryId = c.Id
            WHERE o.Status = 2 -- Completed
              AND o.OrderDate >= @FromDate 
              AND o.OrderDate <= @ToDate
              AND o.IsDeleted = 0
              AND od.IsDeleted = 0
            GROUP BY p.Id, p.Name, c.Name, p.Unit
            ORDER BY {orderByClause}
            LIMIT @Limit";

        var result = await connection.QueryAsync<TopProductReportDto>(sql, new { request.FromDate, request.ToDate, request.Limit });
        
        return result.ToList();
    }
}
