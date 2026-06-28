using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.SupplierLedger.Commands;

public class PaySpecificSupplierDebtCommand : IRequest<Guid>
{
    public Guid SupplierId { get; set; }
    public Guid DebtTransactionId { get; set; }
    public decimal Amount { get; set; }
    public string? Note { get; set; }
}

public class PaySpecificSupplierDebtCommandHandler : IRequestHandler<PaySpecificSupplierDebtCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public PaySpecificSupplierDebtCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(PaySpecificSupplierDebtCommand request, CancellationToken cancellationToken)
    {
        var debt = await _context.SupplierDebts.FirstOrDefaultAsync(x => x.SupplierId == request.SupplierId, cancellationToken);
        if (debt == null) throw new InvalidOperationException("Supplier has no debt record.");

        var targetDebt = await _context.SupplierDebtTransactions
            .FirstOrDefaultAsync(x => x.Id == request.DebtTransactionId && x.SupplierId == request.SupplierId, cancellationToken);
            
        if (targetDebt == null) throw new InvalidOperationException("Debt transaction not found.");
        if (targetDebt.Type != SupplierDebtTransactionType.Debt) throw new InvalidOperationException("Target transaction is not a debt.");

        var remainingAmountOnDebt = targetDebt.Amount - targetDebt.PaidAmount;
        if (request.Amount > remainingAmountOnDebt)
            throw new InvalidOperationException("Payment amount exceeds the remaining unpaid amount of this specific debt.");

        debt.PayDebt(request.Amount);
        targetDebt.AddPayment(request.Amount);

        var paymentTransaction = SupplierDebtTransaction.CreatePayment(request.SupplierId, request.Amount, request.Note, targetDebt.Id);
        _context.SupplierDebtTransactions.Add(paymentTransaction);

        await _context.SaveChangesAsync(cancellationToken);
        return debt.Id;
    }
}
