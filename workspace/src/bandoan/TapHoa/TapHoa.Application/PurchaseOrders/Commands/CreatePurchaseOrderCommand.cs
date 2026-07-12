using MediatR;
using TapHoa.Application.PurchaseOrders.DTOs;
using TapHoa.Domain.Entities;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.PurchaseOrders.Commands;

public record CreatePurchaseOrderCommand(CreatePurchaseOrderDto Dto) : IRequest<Guid>;

public class CreatePurchaseOrderCommandHandler : IRequestHandler<CreatePurchaseOrderCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreatePurchaseOrderCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(CreatePurchaseOrderCommand request, CancellationToken cancellationToken)
    {
        var orderCode = $"PO-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 4).ToUpper()}";
        
        var po = new PurchaseOrder(
            orderCode,
            request.Dto.SupplierId,
            request.Dto.ExpectedDeliveryDate,
            request.Dto.Notes
        );

        foreach (var detail in request.Dto.Details)
        {
            po.AddDetail(detail.ProductId, detail.Quantity, detail.CostPrice);
        }

        _context.PurchaseOrders.Add(po);
        await _context.SaveChangesAsync(cancellationToken);

        return po.Id;
    }
}
