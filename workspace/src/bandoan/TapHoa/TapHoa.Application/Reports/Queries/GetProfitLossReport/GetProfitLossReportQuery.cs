using MediatR;
using Dapper;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Reports.Queries;

public class ProfitLossReportDto
{
    public int Month { get; set; }
    public int Year { get; set; }

    // Revenue
    public decimal GrossRevenue { get; set; }
    public decimal ReturnAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal NetRevenue { get; set; }

    // COGS
    public decimal CostOfGoodsSold { get; set; }

    // Gross Profit
    public decimal GrossProfit { get; set; }
    public decimal GrossProfitMargin { get; set; } // %

    // Operating Expenses
    public decimal FixedExpenses { get; set; }
    public decimal VariableExpenses { get; set; }
    public decimal SalaryExpenses { get; set; }
    public decimal TotalOperatingExpenses { get; set; }

    // Net Profit
    public decimal NetProfit { get; set; }
    public decimal NetProfitMargin { get; set; } // %

    // Breakdown
    public List<ProfitLossLineItem> ExpenseBreakdown { get; set; } = new();
    public List<MonthlyTrendItem> MonthlyTrend { get; set; } = new();
}

public class ProfitLossLineItem
{
    public string Name { get; set; } = "";
    public decimal Amount { get; set; }
}

public class MonthlyTrendItem
{
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal Revenue { get; set; }
    public decimal Profit { get; set; }
}

// ── P&L Report Query ────────────────────────────────────────────────────────
public class GetProfitLossReportQuery : IRequest<ProfitLossReportDto>
{
    public int Month { get; set; }
    public int Year { get; set; }
}

public class GetProfitLossReportQueryHandler : IRequestHandler<GetProfitLossReportQuery, ProfitLossReportDto>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetProfitLossReportQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<ProfitLossReportDto> Handle(GetProfitLossReportQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();

        var startDate = new DateTime(request.Year, request.Month, 1);
        var endDate = startDate.AddMonths(1).AddTicks(-1);
        var report = new ProfitLossReportDto { Month = request.Month, Year = request.Year };

        // ── 1. Revenue ──────────────────────────────────────────────────────
        var revenueSql = @"
            SELECT 
                COALESCE(SUM(TotalAmount), 0) AS GrossRevenue,
                COALESCE(SUM(DiscountAmount), 0) AS DiscountAmount
            FROM Orders 
            WHERE Status = 2 AND IsDeleted = 0 
              AND OrderDate >= @StartDate AND OrderDate <= @EndDate";
        var revenue = await connection.QuerySingleOrDefaultAsync<dynamic>(revenueSql, new { StartDate = startDate, EndDate = endDate });
        report.GrossRevenue = revenue?.GrossRevenue ?? 0;
        report.DiscountAmount = revenue?.DiscountAmount ?? 0;

        // ── 2. Returns ──────────────────────────────────────────────────────
        var returnSql = @"
            SELECT COALESCE(SUM(RefundAmount), 0) 
            FROM ReturnOrders 
            WHERE Status = 2 AND IsDeleted = 0 
              AND CreatedDate >= @StartDate AND CreatedDate <= @EndDate";
        report.ReturnAmount = await connection.ExecuteScalarAsync<decimal>(returnSql, new { StartDate = startDate, EndDate = endDate });

        // Net Revenue
        report.NetRevenue = report.GrossRevenue - report.ReturnAmount;

        // ── 3. COGS (Cost of Goods Sold) ────────────────────────────────────
        var cogsSql = @"
            SELECT COALESCE(SUM(od.Quantity * p.CostPrice), 0)
            FROM OrderDetails od
            JOIN Orders o ON od.OrderId = o.Id
            JOIN Products p ON od.ProductId = p.Id
            WHERE o.Status = 2 AND o.IsDeleted = 0 
              AND o.OrderDate >= @StartDate AND o.OrderDate <= @EndDate";
        report.CostOfGoodsSold = await connection.ExecuteScalarAsync<decimal>(cogsSql, new { StartDate = startDate, EndDate = endDate });

        // Gross Profit
        report.GrossProfit = report.NetRevenue - report.CostOfGoodsSold;
        report.GrossProfitMargin = report.NetRevenue > 0 ? Math.Round(report.GrossProfit / report.NetRevenue * 100, 2) : 0;

        // ── 4. Operating Expenses ───────────────────────────────────────────
        var expenseSql = @"
            SELECT 
                COALESCE(SUM(CASE WHEN Type = 1 THEN Amount ELSE 0 END), 0) AS FixedExpenses,
                COALESCE(SUM(CASE WHEN Type = 2 THEN Amount ELSE 0 END), 0) AS VariableExpenses
            FROM OperatingExpenses 
            WHERE IsDeleted = 0 AND Month = @Month AND Year = @Year";
        var expenses = await connection.QuerySingleOrDefaultAsync<dynamic>(expenseSql, new { request.Month, request.Year });
        report.FixedExpenses = expenses?.FixedExpenses ?? 0;
        report.VariableExpenses = expenses?.VariableExpenses ?? 0;

        // ── 5. Salary Expenses ──────────────────────────────────────────────
        var salarySql = @"
            SELECT COALESCE(SUM(pe.NetSalary), 0)
            FROM PayrollEntries pe
            JOIN PayrollPeriods pp ON pe.PayrollPeriodId = pp.Id
            WHERE pp.Month = @Month AND pp.Year = @Year AND pp.IsDeleted = 0";
        report.SalaryExpenses = await connection.ExecuteScalarAsync<decimal>(salarySql, new { request.Month, request.Year });

        report.TotalOperatingExpenses = report.FixedExpenses + report.VariableExpenses + report.SalaryExpenses;

        // Net Profit
        report.NetProfit = report.GrossProfit - report.TotalOperatingExpenses;
        report.NetProfitMargin = report.NetRevenue > 0 ? Math.Round(report.NetProfit / report.NetRevenue * 100, 2) : 0;

        // ── 6. Expense Breakdown ────────────────────────────────────────────
        var breakdownSql = @"
            SELECT Name, Amount FROM OperatingExpenses 
            WHERE IsDeleted = 0 AND Month = @Month AND Year = @Year
            ORDER BY Amount DESC";
        report.ExpenseBreakdown = (await connection.QueryAsync<ProfitLossLineItem>(breakdownSql, new { request.Month, request.Year })).ToList();

        if (report.SalaryExpenses > 0)
            report.ExpenseBreakdown.Insert(0, new ProfitLossLineItem { Name = "Lương nhân viên", Amount = report.SalaryExpenses });

        // ── 7. Monthly Trend (last 6 months) ────────────────────────────────
        var trendSql = @"
            SELECT 
                MONTH(o.OrderDate) AS Month, 
                YEAR(o.OrderDate) AS Year,
                COALESCE(SUM(o.TotalAmount), 0) AS Revenue,
                0 AS Profit
            FROM Orders o
            WHERE o.Status = 2 AND o.IsDeleted = 0
              AND o.OrderDate >= @TrendStart AND o.OrderDate <= @EndDate
            GROUP BY YEAR(o.OrderDate), MONTH(o.OrderDate)
            ORDER BY Year, Month";
        var trendStart = startDate.AddMonths(-5);
        report.MonthlyTrend = (await connection.QueryAsync<MonthlyTrendItem>(trendSql, new { TrendStart = trendStart, EndDate = endDate })).ToList();

        return report;
    }
}
