using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.SupplierLedger.Commands;

public class PaySupplierDebtCommand : IRequest<Guid>
{
    public Guid SupplierId { get; set; }
    public decimal Amount { get; set; }
    public string? Note { get; set; }
}

public class PaySupplierDebtCommandHandler : IRequestHandler<PaySupplierDebtCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public PaySupplierDebtCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(PaySupplierDebtCommand request, CancellationToken cancellationToken)
    {
        var debt = await _context.SupplierDebts.FirstOrDefaultAsync(x => x.SupplierId == request.SupplierId, cancellationToken);
        if (debt == null) throw new InvalidOperationException("Supplier has no debt record.");

        debt.PayDebt(request.Amount);

        var paymentTransaction = SupplierDebtTransaction.CreatePayment(request.SupplierId, request.Amount, request.Note);
        _context.SupplierDebtTransactions.Add(paymentTransaction);

        // FIFO allocation of payment to oldest unpaid debts
        var unpaidDebts = await _context.SupplierDebtTransactions
            .Where(x => x.SupplierId == request.SupplierId && x.Type == SupplierDebtTransactionType.Debt && x.PaidAmount < x.Amount)
            .OrderBy(x => x.CreatedDate)
            .ToListAsync(cancellationToken);

        var remainingPayment = request.Amount;
        foreach (var unpaidDebt in unpaidDebts)
        {
            if (remainingPayment <= 0) break;

            var amountToPayForThisDebt = Math.Min(remainingPayment, unpaidDebt.Amount - unpaidDebt.PaidAmount);
            unpaidDebt.AddPayment(amountToPayForThisDebt);
            remainingPayment -= amountToPayForThisDebt;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return debt.Id;
    }
}
