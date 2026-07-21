using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Reports.DTOs;

namespace TapHoa.Application.Reports.Queries.GetTopCustomersReport;

public class GetTopCustomersQuery : IRequest<List<CustomerAnalyticsDto>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public int Limit { get; set; } = 10;
}

public class GetTopCustomersQueryHandler : IRequestHandler<GetTopCustomersQuery, List<CustomerAnalyticsDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetTopCustomersQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<List<CustomerAnalyticsDto>> Handle(GetTopCustomersQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();

        var fromDate = request.FromDate.Date;
        var toDate = request.ToDate.Date.AddDays(1).AddTicks(-1);

        var sql = @"
            SELECT 
                c.Id as CustomerId,
                COALESCE(c.FullName, 'Khách lẻ') as CustomerName,
                COALESCE(c.PhoneNumber, '') as PhoneNumber,
                COUNT(o.Id) as TotalOrders,
                SUM(o.TotalAmount) as TotalSpent,
                MAX(o.OrderDate) as LastPurchaseDate
            FROM Orders o
            LEFT JOIN Customers c ON o.CustomerId = c.Id
            WHERE o.Status = 2 -- Completed
              AND o.OrderDate >= @FromDate 
              AND o.OrderDate <= @ToDate
              AND o.IsDeleted = 0
            GROUP BY c.Id, c.FullName, c.PhoneNumber
            ORDER BY TotalSpent DESC
            LIMIT @Limit";

        var result = await connection.QueryAsync<CustomerAnalyticsDto>(sql, new 
        { 
            FromDate = fromDate, 
            ToDate = toDate,
            Limit = request.Limit
        });
        
        return result.ToList();
    }
}
