using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.Warehouse.Queries;

public record GetProductTransactionHistoryQuery(Guid ProductId) : IRequest<List<ProductTransactionHistoryDto>>;

public class ProductTransactionHistoryDto
{
    public Guid TransactionId { get; set; }
    public string TransactionCode { get; set; } = default!;
    public TransactionType Type { get; set; }
    public DateTime CreatedAt { get; set; }
    public int Quantity { get; set; }
    public decimal UnitCost { get; set; }
    public string Status { get; set; } = default!;
}

public class GetProductTransactionHistoryQueryHandler : IRequestHandler<GetProductTransactionHistoryQuery, List<ProductTransactionHistoryDto>>
{
    private readonly IApplicationDbContext _context;

    public GetProductTransactionHistoryQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductTransactionHistoryDto>> Handle(GetProductTransactionHistoryQuery request, CancellationToken cancellationToken)
    {
        var query = from l in _context.InventoryTransactionLines
                    join t in _context.InventoryTransactions on l.TransactionId equals t.Id
                    where l.ProductId == request.ProductId
                    orderby t.CreatedAt descending
                    select new ProductTransactionHistoryDto
                    {
                        TransactionId = t.Id,
                        TransactionCode = t.Code,
                        Type = t.Type,
                        CreatedAt = t.CreatedAt,
                        Quantity = l.Quantity,
                        UnitCost = l.UnitCost,
                        Status = t.Status.ToString()
                    };

        return await query.ToListAsync(cancellationToken);
    }
}
