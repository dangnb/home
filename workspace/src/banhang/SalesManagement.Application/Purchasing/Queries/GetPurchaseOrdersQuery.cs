using MediatR;
using Microsoft.EntityFrameworkCore;
using SalesManagement.Application.Interfaces;

namespace SalesManagement.Application.Purchasing.Queries;

public record PurchaseOrderSummaryDto(Guid Id, string Code, string SupplierName, DateTime OrderDate, string Status, decimal TotalAmount);

public record GetPurchaseOrdersQuery() : IRequest<List<PurchaseOrderSummaryDto>>;

public class GetPurchaseOrdersQueryHandler : IRequestHandler<GetPurchaseOrdersQuery, List<PurchaseOrderSummaryDto>>
{
    private readonly IApplicationDbContext _db;
    public GetPurchaseOrdersQueryHandler(IApplicationDbContext db) => _db = db;

    public async Task<List<PurchaseOrderSummaryDto>> Handle(GetPurchaseOrdersQuery request, CancellationToken cancellationToken)
    {
        return await _db.PurchaseOrders
            .Include(o => o.Supplier)
            .OrderByDescending(o => o.OrderDate)
            .Select(o => new PurchaseOrderSummaryDto(
                o.Id,
                o.Code,
                o.Supplier != null ? o.Supplier.Name : "N/A",
                o.OrderDate,
                o.Status.ToString(),
                o.TotalAmount
            ))
            .ToListAsync(cancellationToken);
    }
}
