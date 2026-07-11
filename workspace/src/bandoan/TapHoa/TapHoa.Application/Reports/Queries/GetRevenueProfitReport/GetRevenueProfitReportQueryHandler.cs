using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Reports.DTOs;

namespace TapHoa.Application.Reports.Queries.GetRevenueProfitReport;

public class GetRevenueProfitReportQueryHandler : IRequestHandler<GetRevenueProfitReportQuery, RevenueProfitReportDto>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetRevenueProfitReportQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<RevenueProfitReportDto> Handle(GetRevenueProfitReportQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();

        // Query to get overall summary
        var summarySql = @"
            SELECT 
                COUNT(1) as TotalOrders,
                COALESCE(SUM(o.TotalAmount), 0) as TotalRevenue,
                COALESCE(SUM(o.TotalAmount - (
                    SELECT COALESCE(SUM(od.Quantity * COALESCE(p.CostPrice, 0)), 0)
                    FROM OrderDetails od
                    JOIN Products p ON od.ProductId = p.Id
                    WHERE od.OrderId = o.Id AND od.IsDeleted = 0
                )), 0) as TotalProfit
            FROM Orders o
            WHERE o.Status = 2 -- Completed
              AND o.OrderDate >= @FromDate 
              AND o.OrderDate <= @ToDate
              AND o.IsDeleted = 0";

        var summary = await connection.QueryFirstOrDefaultAsync<RevenueProfitReportDto>(summarySql, new { request.FromDate, request.ToDate });
        if (summary == null) summary = new RevenueProfitReportDto();

        // Query to get chart data grouped by time
        string dateFormat = request.GroupBy.ToLower() switch
        {
            "month" => "'%Y-%m'",
            "week" => "'%Y-%u'",
            _ => "'%Y-%m-%d'" // default to day
        };

        var chartSql = $@"
            SELECT 
                DATE_FORMAT(o.OrderDate, {dateFormat}) as Label,
                COUNT(1) as OrderCount,
                COALESCE(SUM(o.TotalAmount), 0) as Revenue,
                COALESCE(SUM(o.TotalAmount - (
                    SELECT COALESCE(SUM(od.Quantity * COALESCE(p.CostPrice, 0)), 0)
                    FROM OrderDetails od
                    JOIN Products p ON od.ProductId = p.Id
                    WHERE od.OrderId = o.Id AND od.IsDeleted = 0
                )), 0) as Profit
            FROM Orders o
            WHERE o.Status = 2 -- Completed
              AND o.OrderDate >= @FromDate 
              AND o.OrderDate <= @ToDate
              AND o.IsDeleted = 0
            GROUP BY DATE_FORMAT(o.OrderDate, {dateFormat})
            ORDER BY Label ASC";

        var chartData = await connection.QueryAsync<RevenueChartDataDto>(chartSql, new { request.FromDate, request.ToDate });
        
        summary.ChartData = chartData.ToList();

        return summary;
    }
}
