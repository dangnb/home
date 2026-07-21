using MediatR;
using Dapper;
using TapHoa.Application.Interfaces;
using TapHoa.Application.CashBook.DTOs;
using TapHoa.Application.Common;

namespace TapHoa.Application.CashBook.Queries;

// ── Get Paged CashBook Entries ──────────────────────────────────────────────
public class GetCashBookEntriesQuery : IRequest<PagedResult<CashBookEntryDto>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int? Type { get; set; } // 1=Income, 2=Expense
    public string? Category { get; set; }
}

public class GetCashBookEntriesQueryHandler : IRequestHandler<GetCashBookEntriesQuery, PagedResult<CashBookEntryDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetCashBookEntriesQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<PagedResult<CashBookEntryDto>> Handle(GetCashBookEntriesQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();

        var where = "WHERE IsDeleted = 0";
        var parameters = new DynamicParameters();

        if (request.FromDate.HasValue)
        {
            where += " AND EntryDate >= @FromDate";
            parameters.Add("FromDate", request.FromDate.Value);
        }
        if (request.ToDate.HasValue)
        {
            where += " AND EntryDate <= @ToDate";
            parameters.Add("ToDate", request.ToDate.Value);
        }
        if (request.Type.HasValue)
        {
            where += " AND Type = @Type";
            parameters.Add("Type", request.Type.Value);
        }
        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            where += " AND Category = @Category";
            parameters.Add("Category", request.Category);
        }

        var countSql = $"SELECT COUNT(1) FROM CashBookEntries {where}";
        var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

        var dataSql = $@"
            SELECT Id, EntryDate, Type, Category, Amount, Description, 
                   ReferenceId, ReferenceType, ShiftId, CreatedBy, CreatedDate
            FROM CashBookEntries {where}
            ORDER BY EntryDate DESC, CreatedDate DESC
            LIMIT @PageSize OFFSET @Offset";
        parameters.Add("PageSize", request.PageSize);
        parameters.Add("Offset", (request.PageNumber - 1) * request.PageSize);

        var items = await connection.QueryAsync<CashBookEntryDto>(dataSql, parameters);
        return new PagedResult<CashBookEntryDto>(items.ToList(), totalCount, request.PageNumber, request.PageSize);
    }
}

// ── Get CashBook Summary ────────────────────────────────────────────────────
public class GetCashBookSummaryQuery : IRequest<CashBookSummaryDto>
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
}

public class GetCashBookSummaryQueryHandler : IRequestHandler<GetCashBookSummaryQuery, CashBookSummaryDto>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetCashBookSummaryQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<CashBookSummaryDto> Handle(GetCashBookSummaryQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();

        var summary = new CashBookSummaryDto();

        // Total income & expense
        var totalsSql = @"
            SELECT 
                COALESCE(SUM(CASE WHEN Type = 1 THEN Amount ELSE 0 END), 0) AS TotalIncome,
                COALESCE(SUM(CASE WHEN Type = 2 THEN Amount ELSE 0 END), 0) AS TotalExpense
            FROM CashBookEntries
            WHERE IsDeleted = 0 AND EntryDate >= @FromDate AND EntryDate <= @ToDate";
        var totals = await connection.QuerySingleAsync<dynamic>(totalsSql, new { request.FromDate, request.ToDate });
        summary.TotalIncome = (decimal)totals.TotalIncome;
        summary.TotalExpense = (decimal)totals.TotalExpense;
        summary.Balance = summary.TotalIncome - summary.TotalExpense;

        // Breakdown by category — Income
        var incomeSql = @"
            SELECT Category, SUM(Amount) AS Amount, COUNT(1) AS Count
            FROM CashBookEntries
            WHERE IsDeleted = 0 AND Type = 1 AND EntryDate >= @FromDate AND EntryDate <= @ToDate
            GROUP BY Category ORDER BY Amount DESC";
        summary.IncomeBreakdown = (await connection.QueryAsync<CashBookCategoryBreakdown>(incomeSql, new { request.FromDate, request.ToDate })).ToList();

        // Breakdown by category — Expense
        var expenseSql = @"
            SELECT Category, SUM(Amount) AS Amount, COUNT(1) AS Count
            FROM CashBookEntries
            WHERE IsDeleted = 0 AND Type = 2 AND EntryDate >= @FromDate AND EntryDate <= @ToDate
            GROUP BY Category ORDER BY Amount DESC";
        summary.ExpenseBreakdown = (await connection.QueryAsync<CashBookCategoryBreakdown>(expenseSql, new { request.FromDate, request.ToDate })).ToList();

        return summary;
    }
}
