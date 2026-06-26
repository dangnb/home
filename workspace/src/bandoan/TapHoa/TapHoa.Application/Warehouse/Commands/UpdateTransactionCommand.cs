using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Exceptions;

namespace TapHoa.Application.Warehouse.Commands;

public record UpdateTransactionCommand(
    Guid TransactionId,
    string ReferenceId,
    string Notes,
    List<TransactionLineDto> Lines
) : IRequest<bool>;

public class UpdateTransactionCommandHandler : IRequestHandler<UpdateTransactionCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public UpdateTransactionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(UpdateTransactionCommand request, CancellationToken cancellationToken)
    {
        var transaction = await _context.InventoryTransactions
            .Include(t => t.Lines)
            .FirstOrDefaultAsync(t => t.Id == request.TransactionId, cancellationToken);

        if (transaction == null)
            throw new DomainException("Transaction not found.");

        // We explicitly remove the old lines from the DbContext so EF deletes them physically 
        _context.InventoryTransactionLines.RemoveRange(transaction.Lines);
        
        // This clears the collection navigation safely
        transaction.ClearLines();

        transaction.UpdateDetails(request.ReferenceId, request.Notes);

        foreach (var line in request.Lines)
        {
            transaction.AddLine(line.ProductId, line.Quantity, line.UnitCost);
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
