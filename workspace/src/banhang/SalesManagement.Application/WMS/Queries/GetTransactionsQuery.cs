using MediatR;
using Microsoft.EntityFrameworkCore;
using SalesManagement.Infrastructure.Data;

namespace SalesManagement.Application.WMS.Queries;

public record TransactionSummaryDto(Guid Id, string Code, string Type, string WarehouseName, string Status, int TotalItems, DateTime CreatedAt);

public record GetTransactionsQuery() : IRequest<List<TransactionSummaryDto>>;

public class GetTransactionsQueryHandler : IRequestHandler<GetTransactionsQuery, List<TransactionSummaryDto>>
{
    private readonly ApplicationDbContext _db;

    public GetTransactionsQueryHandler(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<List<TransactionSummaryDto>> Handle(GetTransactionsQuery request, CancellationToken cancellationToken)
    {
        return await _db.InventoryTransactions
            .Include(t => t.Warehouse)
            .Include(t => t.Details)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TransactionSummaryDto(
                t.Id,
                t.Code,
                t.Type.ToString(),
                t.Warehouse != null ? t.Warehouse.Name : "",
                t.Status.ToString(),
                t.Details.Sum(d => d.Quantity),
                t.CreatedAt
            ))
            .ToListAsync(cancellationToken);
    }
}
