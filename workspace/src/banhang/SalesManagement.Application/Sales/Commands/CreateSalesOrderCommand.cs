using MediatR;
using SalesManagement.Application.Interfaces;
using SalesManagement.Domain.Entities;
using SalesManagement.Domain.Enums;

namespace SalesManagement.Application.Sales.Commands;

public record SalesOrderDetailDto(Guid ProductId, int Quantity, decimal UnitPrice);
public record CreateSalesOrderDto(string Code, Guid CustomerId, string Note, List<SalesOrderDetailDto> Details);

public record CreateSalesOrderCommand(CreateSalesOrderDto Dto) : IRequest<Guid>;

public class CreateSalesOrderCommandHandler : IRequestHandler<CreateSalesOrderCommand, Guid>
{
    private readonly IApplicationDbContext _db;
    public CreateSalesOrderCommandHandler(IApplicationDbContext db) => _db = db;

    public async Task<Guid> Handle(CreateSalesOrderCommand request, CancellationToken cancellationToken)
    {
        var order = new SalesOrder(request.Dto.Code, request.Dto.CustomerId, DateTime.UtcNow, request.Dto.Note);
        order.Details = request.Dto.Details.Select(d => new SalesOrderDetail
        {
            Id = Guid.NewGuid(),
            ProductId = d.ProductId,
            Quantity = d.Quantity,
            UnitPrice = d.UnitPrice
        }).ToList();
        order.CalculateTotal();

        await _db.SalesOrders.AddAsync(order, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);
        return order.Id;
    }
}
