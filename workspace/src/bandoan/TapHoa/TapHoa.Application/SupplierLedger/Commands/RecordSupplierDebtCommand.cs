using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.SupplierLedger.Commands;

public class RecordSupplierDebtCommand : IRequest<Guid>
{
    public Guid SupplierId { get; set; }
    public decimal Amount { get; set; }
    public string? Note { get; set; }
    public DateTime? DueDate { get; set; }
}

public class RecordSupplierDebtCommandHandler : IRequestHandler<RecordSupplierDebtCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public RecordSupplierDebtCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(RecordSupplierDebtCommand request, CancellationToken cancellationToken)
    {
        var debt = await _context.SupplierDebts.FirstOrDefaultAsync(x => x.SupplierId == request.SupplierId, cancellationToken);
        if (debt == null)
        {
            var supplier = await _context.Suppliers.FindAsync(new object[] { request.SupplierId }, cancellationToken);
            debt = SupplierDebt.Create(request.SupplierId, supplier?.FullName ?? "Unknown Supplier", supplier?.PhoneNumber);
            _context.SupplierDebts.Add(debt);
        }
        
        debt.AddDebt(request.Amount);

        var transaction = SupplierDebtTransaction.CreateDebt(request.SupplierId, request.Amount, request.Note, request.DueDate);
        _context.SupplierDebtTransactions.Add(transaction);

        await _context.SaveChangesAsync(cancellationToken);
        return debt.Id;
    }
}
