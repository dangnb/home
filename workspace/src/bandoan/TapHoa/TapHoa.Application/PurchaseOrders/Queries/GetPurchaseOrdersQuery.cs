using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.PurchaseOrders.DTOs;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.PurchaseOrders.Queries;

public record GetPurchaseOrdersQuery() : IRequest<List<PurchaseOrderDto>>;

public class GetPurchaseOrdersQueryHandler : IRequestHandler<GetPurchaseOrdersQuery, List<PurchaseOrderDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPurchaseOrdersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PurchaseOrderDto>> Handle(GetPurchaseOrdersQuery request, CancellationToken cancellationToken)
    {
        var pos = await _context.PurchaseOrders
            .Include(p => p.Supplier)
            .OrderByDescending(p => p.OrderDate)
            .ToListAsync(cancellationToken);

        return pos.Select(p => new PurchaseOrderDto
        {
            Id = p.Id,
            OrderCode = p.OrderCode,
            SupplierId = p.SupplierId,
            SupplierName = p.Supplier.FullName,
            OrderDate = p.OrderDate,
            ExpectedDeliveryDate = p.ExpectedDeliveryDate,
            TotalAmount = p.TotalAmount,
            AmountPaid = p.AmountPaid,
            Status = p.Status,
            Notes = p.Notes
        }).ToList();
    }
}
