using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace TapHoa.Application.CustomerLedger.Commands;

public class PaySpecificDebtCommand : IRequest<bool>
{
    public Guid TransactionId { get; set; }
    public decimal Amount { get; set; }
    public string? Note { get; set; }
}

public class PaySpecificDebtCommandHandler : IRequestHandler<PaySpecificDebtCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public PaySpecificDebtCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(PaySpecificDebtCommand request, CancellationToken cancellationToken)
    {
        var debtTx = await _context.CustomerDebtTransactions
            .FirstOrDefaultAsync(x => x.Id == request.TransactionId && x.Type == CustomerDebtTransactionType.Debt, cancellationToken);
            
        if (debtTx == null) return false;

        // Update the specific debt
        debtTx.AddPayment(request.Amount);

        // Update total debt of the customer
        var customerDebt = await _context.CustomerDebts.FirstOrDefaultAsync(x => x.CustomerId == debtTx.CustomerId, cancellationToken);
        if (customerDebt != null)
        {
            customerDebt.PayDebt(request.Amount);
        }

        // Add payment transaction history
        var paymentTx = CustomerDebtTransaction.CreatePayment(debtTx.CustomerId, request.Amount, request.Note, debtTx.Id);
        _context.CustomerDebtTransactions.Add(paymentTx);

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
