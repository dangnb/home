using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.CustomerLedger.Commands;

public class RecordDebtCommand : IRequest<Guid>
{
    public Guid CustomerId { get; set; }
    public decimal Amount { get; set; }
    public string Note { get; set; } = string.Empty;
}

public class RecordDebtCommandHandler : IRequestHandler<RecordDebtCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public RecordDebtCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(RecordDebtCommand request, CancellationToken cancellationToken)
    {
        var debt = await _context.CustomerDebts.FirstOrDefaultAsync(x => x.CustomerId == request.CustomerId, cancellationToken);
        if (debt == null)
        {
            debt = CustomerDebt.Create(request.CustomerId, "Unknown Customer", null);
            _context.CustomerDebts.Add(debt);
        }
        
        debt.AddDebt(request.Amount);

        var transaction = CustomerDebtTransaction.CreateDebt(request.CustomerId, request.Amount, request.Note);
        _context.CustomerDebtTransactions.Add(transaction);

        await _context.SaveChangesAsync(cancellationToken);
        return debt.Id;
    }
}
