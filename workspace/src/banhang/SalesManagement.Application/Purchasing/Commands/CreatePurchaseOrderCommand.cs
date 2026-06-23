using MediatR;
using SalesManagement.Application.Interfaces;
using SalesManagement.Domain.Entities;
using SalesManagement.Domain.Enums;

namespace SalesManagement.Application.Purchasing.Commands;

public record PurchaseOrderDetailDto(Guid ProductId, int Quantity, decimal UnitPrice);
public record CreatePurchaseOrderDto(string Code, Guid SupplierId, string Note, List<PurchaseOrderDetailDto> Details);

public record CreatePurchaseOrderCommand(CreatePurchaseOrderDto Dto) : IRequest<Guid>;

public class CreatePurchaseOrderCommandHandler : IRequestHandler<CreatePurchaseOrderCommand, Guid>
{
    private readonly IApplicationDbContext _db;
    public CreatePurchaseOrderCommandHandler(IApplicationDbContext db) => _db = db;

    public async Task<Guid> Handle(CreatePurchaseOrderCommand request, CancellationToken cancellationToken)
    {
        var order = new PurchaseOrder(request.Dto.Code, request.Dto.SupplierId, DateTime.UtcNow, request.Dto.Note);
        order.Details = request.Dto.Details.Select(d => new PurchaseOrderDetail
        {
            Id = Guid.NewGuid(),
            ProductId = d.ProductId,
            Quantity = d.Quantity,
            UnitPrice = d.UnitPrice
        }).ToList();
        order.CalculateTotal();

        await _db.PurchaseOrders.AddAsync(order, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);
        return order.Id;
    }
}
