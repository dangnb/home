using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Application.ReturnOrders.DTOs;

namespace TapHoa.Application.ReturnOrders.Queries;

public record GetReturnOrderByIdQuery(Guid Id) : IRequest<ReturnOrderDto?>;

public class GetReturnOrderByIdQueryHandler : IRequestHandler<GetReturnOrderByIdQuery, ReturnOrderDto?>
{
    private readonly IApplicationDbContext _context;

    public GetReturnOrderByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ReturnOrderDto?> Handle(GetReturnOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var r = await _context.ReturnOrders
            .Include(r => r.OriginalOrder)
                .ThenInclude(o => o!.Customer)
            .Include(r => r.ReturnOrderDetails)
                .ThenInclude(d => d.Product)
            .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

        if (r == null) return null;

        return new ReturnOrderDto
        {
            Id = r.Id,
            ReturnCode = r.ReturnCode,
            OriginalOrderId = r.OriginalOrderId,
            OriginalOrderCode = r.OriginalOrder!.OrderCode,
            CustomerName = r.OriginalOrder.Customer != null ? r.OriginalOrder.Customer.FullName : "Khách lẻ",
            ReturnDate = r.ReturnDate,
            Reason = r.Reason,
            Status = r.Status,
            RefundAmount = r.RefundAmount,
            CreatedBy = r.CreatedBy,
            Details = r.ReturnOrderDetails.Select(d => new ReturnOrderDetailDto
            {
                Id = d.Id,
                ProductId = d.ProductId,
                ProductName = d.Product!.Name,
                Unit = d.Product.Unit,
                Quantity = d.Quantity,
                RefundPrice = d.RefundPrice,
                SubTotal = d.SubTotal
            }).ToList()
        };
    }
}
