using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Reports.DTOs;

namespace TapHoa.Application.Reports.Queries.GetDeadStockReport;

public class GetDeadStockQuery : IRequest<List<DeadStockReportDto>>
{
    public int DaysThreshold { get; set; } = 30; // Default 30 days
}

public class GetDeadStockQueryHandler : IRequestHandler<GetDeadStockQuery, List<DeadStockReportDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetDeadStockQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<List<DeadStockReportDto>> Handle(GetDeadStockQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();

        var sql = @"
            SELECT 
                p.Id as ProductId,
                p.Name as ProductName,
                c.Name as CategoryName,
                COALESCE((SELECT sl.AvailableQuantity FROM StockLevels sl WHERE sl.ProductId = p.Id LIMIT 1), 0) as AvailableQuantity,
                DATEDIFF(NOW(), COALESCE(MAX(o.OrderDate), p.CreatedDate, NOW())) as DaysSinceLastSale
            FROM Products p
            LEFT JOIN Categories c ON p.CategoryId = c.Id
            LEFT JOIN OrderDetails od ON od.ProductId = p.Id AND od.IsDeleted = 0
            LEFT JOIN Orders o ON od.OrderId = o.Id AND o.Status = 2 AND o.IsDeleted = 0
            WHERE p.IsDeleted = 0
            GROUP BY p.Id, p.Name, c.Name, AvailableQuantity
            HAVING DaysSinceLastSale >= @DaysThreshold AND AvailableQuantity > 0
            ORDER BY DaysSinceLastSale DESC, AvailableQuantity DESC";

        var result = await connection.QueryAsync<DeadStockReportDto>(sql, new { DaysThreshold = request.DaysThreshold });
        return result.ToList();
    }
}
