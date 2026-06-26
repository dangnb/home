using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Exceptions;

namespace TapHoa.Application.Warehouse.Commands;

public class DeleteTransactionCommandHandler : IRequestHandler<DeleteTransactionCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public DeleteTransactionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteTransactionCommand request, CancellationToken cancellationToken)
    {
        var transaction = await _context.InventoryTransactions
            .FirstOrDefaultAsync(t => t.Id == request.TransactionId, cancellationToken);
            
        if (transaction == null) 
            return false;

        if (transaction.Status == TapHoa.Domain.Enums.TransactionStatus.Completed)
            throw new DomainException("Không thể xóa phiếu đã hoàn thành chốt sổ! Giao dịch đã ghi sổ phải được điều chỉnh thay vì xóa.");

        _context.InventoryTransactions.Remove(transaction);
        await _context.SaveChangesAsync(cancellationToken);
        
        return true;
    }
}
