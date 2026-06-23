using MediatR;
using Microsoft.EntityFrameworkCore;
using SalesManagement.Application.Interfaces;

namespace SalesManagement.Application.WMS.Queries;

public record StockLedgerDto(Guid Id, string TransactionCode, string Type, int ChangeQuantity, int BalanceAfter, DateTime CreatedAt);

public record GetStockLedgerReportQuery(Guid WarehouseId, Guid ProductId, DateTime From, DateTime To) 
    : IRequest<List<StockLedgerDto>>;

public class GetStockLedgerReportHandler : IRequestHandler<GetStockLedgerReportQuery, List<StockLedgerDto>>
{
    private readonly IApplicationDbContext _db;

    public GetStockLedgerReportHandler(IApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<List<StockLedgerDto>> Handle(GetStockLedgerReportQuery request, CancellationToken cancellationToken)
    {
        var ledgers = await _db.StockLedgers
            .Include(l => l.Transaction)
            .Where(l => l.WarehouseId == request.WarehouseId 
                     && l.ProductId == request.ProductId 
                     && l.CreatedAt >= request.From 
                     && l.CreatedAt <= request.To)
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => new StockLedgerDto(
                l.Id,
                l.Transaction!.Code,
                l.Transaction.Type.ToString(),
                l.ChangeQuantity,
                l.BalanceAfter,
                l.CreatedAt
            ))
            .ToListAsync(cancellationToken);

        return ledgers;
    }
}
