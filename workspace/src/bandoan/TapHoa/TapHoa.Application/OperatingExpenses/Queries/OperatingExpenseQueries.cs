using MediatR;
using Dapper;
using TapHoa.Application.Interfaces;
using TapHoa.Application.OperatingExpenses.DTOs;
using TapHoa.Application.Common.Models;
using TapHoa.Application.Common;

namespace TapHoa.Application.OperatingExpenses.Queries;

// ── Get Paged Expenses ──────────────────────────────────────────────────────
public class GetOperatingExpensesQuery : IRequest<PagedResult<OperatingExpenseDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public int? Month { get; set; }
    public int? Year { get; set; }
    public int? PaymentStatus { get; set; }
    public string? SearchTerm { get; set; }
}

public class GetOperatingExpensesQueryHandler : IRequestHandler<GetOperatingExpensesQuery, PagedResult<OperatingExpenseDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetOperatingExpensesQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<PagedResult<OperatingExpenseDto>> Handle(GetOperatingExpensesQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();

        var where = "WHERE IsDeleted = 0";
        var parameters = new DynamicParameters();

        if (request.Month.HasValue)
        {
            where += " AND Month = @Month";
            parameters.Add("Month", request.Month.Value);
        }
        if (request.Year.HasValue)
        {
            where += " AND Year = @Year";
            parameters.Add("Year", request.Year.Value);
        }
        if (request.PaymentStatus.HasValue)
        {
            where += " AND PaymentStatus = @PaymentStatus";
            parameters.Add("PaymentStatus", request.PaymentStatus.Value);
        }
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            where += " AND Name LIKE @SearchTerm";
            parameters.Add("SearchTerm", $"%{request.SearchTerm}%");
        }

        var countSql = $"SELECT COUNT(1) FROM OperatingExpenses {where}";
        var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

        var dataSql = $@"
            SELECT Id, Name, Type, Amount, Month, Year, DueDate, PaidDate, 
                   PaymentStatus, Notes, CreatedBy, CreatedDate
            FROM OperatingExpenses {where}
            ORDER BY Year DESC, Month DESC, CreatedDate DESC
            LIMIT @PageSize OFFSET @Offset";
        parameters.Add("PageSize", request.PageSize);
        parameters.Add("Offset", (request.PageNumber - 1) * request.PageSize);

        var items = await connection.QueryAsync<OperatingExpenseDto>(dataSql, parameters);
        return new PagedResult<OperatingExpenseDto>(items.ToList(), totalCount, request.PageNumber, request.PageSize);
    }
}

// ── Get Expense Summary ─────────────────────────────────────────────────────
public class GetExpenseSummaryQuery : IRequest<ExpenseSummaryDto>
{
    public int Month { get; set; }
    public int Year { get; set; }
}

public class GetExpenseSummaryQueryHandler : IRequestHandler<GetExpenseSummaryQuery, ExpenseSummaryDto>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetExpenseSummaryQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<ExpenseSummaryDto> Handle(GetExpenseSummaryQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();

        var sql = @"
            SELECT 
                COALESCE(SUM(CASE WHEN Type = 1 THEN Amount ELSE 0 END), 0) AS TotalFixed,
                COALESCE(SUM(CASE WHEN Type = 2 THEN Amount ELSE 0 END), 0) AS TotalVariable,
                COALESCE(SUM(Amount), 0) AS TotalAmount,
                COALESCE(SUM(CASE WHEN PaymentStatus = 2 THEN Amount ELSE 0 END), 0) AS TotalPaid,
                COALESCE(SUM(CASE WHEN PaymentStatus != 2 THEN Amount ELSE 0 END), 0) AS TotalUnpaid
            FROM OperatingExpenses
            WHERE IsDeleted = 0 AND Month = @Month AND Year = @Year";

        var summary = await connection.QuerySingleAsync<ExpenseSummaryDto>(sql, new { request.Month, request.Year });
        summary.Month = request.Month;
        summary.Year = request.Year;

        var categorySql = @"
            SELECT Name, Amount, PaymentStatus
            FROM OperatingExpenses
            WHERE IsDeleted = 0 AND Month = @Month AND Year = @Year
            ORDER BY Amount DESC";
        summary.Categories = (await connection.QueryAsync<ExpenseCategorySummary>(categorySql, new { request.Month, request.Year })).ToList();

        return summary;
    }
}
