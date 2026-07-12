using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.PurchaseOrders.DTOs;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.PurchaseOrders.Queries;

public record GetPurchaseOrderByIdQuery(Guid Id) : IRequest<PurchaseOrderDto?>;

public class GetPurchaseOrderByIdQueryHandler : IRequestHandler<GetPurchaseOrderByIdQuery, PurchaseOrderDto?>
{
    private readonly IApplicationDbContext _context;

    public GetPurchaseOrderByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PurchaseOrderDto?> Handle(GetPurchaseOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var p = await _context.PurchaseOrders
            .Include(po => po.Supplier)
            .Include(po => po.PurchaseOrderDetails)
                .ThenInclude(d => d.Product)
            .FirstOrDefaultAsync(po => po.Id == request.Id, cancellationToken);

        if (p == null) return null;

        return new PurchaseOrderDto
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
            Notes = p.Notes,
            Details = p.PurchaseOrderDetails.Select(d => new PurchaseOrderDetailDto
            {
                Id = d.Id,
                ProductId = d.ProductId,
                ProductName = d.Product.Name,
                Quantity = d.Quantity,
                CostPrice = d.CostPrice,
                SubTotal = d.SubTotal
            }).ToList()
        };
    }
}
