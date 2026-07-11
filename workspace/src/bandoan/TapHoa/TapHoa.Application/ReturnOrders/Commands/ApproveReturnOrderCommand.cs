using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities.Warehouse;
using TapHoa.Domain.Enums;

namespace TapHoa.Application.ReturnOrders.Commands;

public record ApproveReturnOrderCommand(Guid ReturnOrderId) : IRequest<bool>;

public class ApproveReturnOrderCommandHandler : IRequestHandler<ApproveReturnOrderCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public ApproveReturnOrderCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(ApproveReturnOrderCommand request, CancellationToken cancellationToken)
    {
        var returnOrder = await _context.ReturnOrders
            .Include(r => r.ReturnOrderDetails)
            .FirstOrDefaultAsync(r => r.Id == request.ReturnOrderId, cancellationToken);

        if (returnOrder == null)
            throw new Exception($"Return order {request.ReturnOrderId} not found.");

        if (returnOrder.Status != ReturnStatus.Pending)
            throw new Exception("Only pending return orders can be approved.");

        var originalOrder = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == returnOrder.OriginalOrderId, cancellationToken);

        // Calculate refund amount
        returnOrder.Approve();

        // Generate inbound inventory transaction to restock items
        var transaction = new InventoryTransaction(
            $"IN-RET-{returnOrder.ReturnCode}",
            TransactionType.Inbound,
            returnOrder.ReturnCode,
            "System", // Approver
            $"Restock from return order {returnOrder.ReturnCode}"
        );

        if (originalOrder != null && originalOrder.CustomerId.HasValue)
        {
            transaction.SetPaymentDetails(0, null, originalOrder.CustomerId.Value);
        }

        foreach (var detail in returnOrder.ReturnOrderDetails)
        {
            transaction.AddLine(detail.ProductId, detail.Quantity, detail.RefundPrice);
        }

        transaction.SubmitForApproval();
        transaction.Approve("System");

        _context.InventoryTransactions.Add(transaction);

        // If customer debt is involved, we could also reduce debt here, 
        // but for now we just restock and approve the return.
        
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
