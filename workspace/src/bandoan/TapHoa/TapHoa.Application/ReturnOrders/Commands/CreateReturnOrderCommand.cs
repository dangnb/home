using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.ReturnOrders.Commands;

public class CreateReturnOrderCommand : IRequest<Guid>
{
    public Guid OriginalOrderId { get; set; }
    public string? Reason { get; set; }
    public List<ReturnItemDto> Items { get; set; } = new();
}

public class ReturnItemDto
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
}

public class CreateReturnOrderCommandValidator : AbstractValidator<CreateReturnOrderCommand>
{
    public CreateReturnOrderCommandValidator()
    {
        RuleFor(v => v.OriginalOrderId).NotEmpty();
        RuleFor(v => v.Items).NotEmpty();
        RuleForEach(v => v.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.ProductId).NotEmpty();
            item.RuleFor(i => i.Quantity).GreaterThan(0);
        });
    }
}

public class CreateReturnOrderCommandHandler : IRequestHandler<CreateReturnOrderCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateReturnOrderCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateReturnOrderCommand request, CancellationToken cancellationToken)
    {
        var originalOrder = await _context.Orders
            .Include(o => o.OrderDetails)
            .FirstOrDefaultAsync(o => o.Id == request.OriginalOrderId, cancellationToken);

        if (originalOrder == null)
            throw new Exception($"Order {request.OriginalOrderId} not found.");

        // Check if return order already exists for this order to prevent duplicate return codes loosely
        var returnCount = await _context.ReturnOrders
            .CountAsync(r => r.OriginalOrderId == request.OriginalOrderId, cancellationToken);
            
        string returnCode = $"RT-{originalOrder.OrderCode}-{returnCount + 1}";

        var returnOrder = new ReturnOrder(
            originalOrder.Id,
            returnCode,
            "System", // Should be replaced by CurrentUser in interceptor
            request.Reason
        );

        foreach (var item in request.Items)
        {
            var orderDetail = originalOrder.OrderDetails.FirstOrDefault(d => d.ProductId == item.ProductId);
            if (orderDetail == null)
                throw new Exception($"Product {item.ProductId} was not found in the original order.");

            if (item.Quantity > orderDetail.Quantity)
                throw new Exception($"Return quantity {item.Quantity} exceeds original purchase quantity {orderDetail.Quantity} for Product {item.ProductId}.");

            returnOrder.AddDetail(item.ProductId, item.Quantity, orderDetail.UnitPrice);
        }

        _context.ReturnOrders.Add(returnOrder);
        await _context.SaveChangesAsync(cancellationToken);

        return returnOrder.Id;
    }
}
