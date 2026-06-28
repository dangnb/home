using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.CustomerLedger.Commands;

public class PayDebtCommand : IRequest<bool>
{
    public Guid DebtId { get; set; }
    public decimal Amount { get; set; }
}

public class PayDebtCommandHandler : IRequestHandler<PayDebtCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public PayDebtCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(PayDebtCommand request, CancellationToken cancellationToken)
    {
        var debt = await _context.CustomerDebts.FirstOrDefaultAsync(x => x.CustomerId == request.DebtId, cancellationToken);
        if (debt == null) return false;

        debt.PayDebt(request.Amount);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
