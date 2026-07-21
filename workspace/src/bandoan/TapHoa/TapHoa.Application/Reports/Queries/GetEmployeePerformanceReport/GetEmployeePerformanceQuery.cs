using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Reports.DTOs;

namespace TapHoa.Application.Reports.Queries.GetEmployeePerformanceReport;

public class GetEmployeePerformanceQuery : IRequest<List<EmployeePerformanceDto>>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
}

public class GetEmployeePerformanceQueryHandler : IRequestHandler<GetEmployeePerformanceQuery, List<EmployeePerformanceDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetEmployeePerformanceQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<List<EmployeePerformanceDto>> Handle(GetEmployeePerformanceQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();

        var fromDate = request.FromDate.Date;
        var toDate = request.ToDate.Date.AddDays(1).AddTicks(-1);

        var sql = @"
            SELECT 
                o.CreatedBy as Username,
                COALESCE((SELECT u.FullName FROM Users u WHERE u.Username = o.CreatedBy LIMIT 1), o.CreatedBy) as FullName,
                COUNT(o.Id) as TotalOrders,
                SUM(o.TotalAmount) as TotalRevenue
            FROM Orders o
            WHERE o.Status = 2 -- Completed
              AND o.OrderDate >= @FromDate 
              AND o.OrderDate <= @ToDate
              AND o.IsDeleted = 0
              AND o.CreatedBy IS NOT NULL
            GROUP BY o.CreatedBy
            ORDER BY TotalRevenue DESC";

        var result = await connection.QueryAsync<EmployeePerformanceDto>(sql, new 
        { 
            FromDate = fromDate, 
            ToDate = toDate
        });
        
        return result.ToList();
    }
}
