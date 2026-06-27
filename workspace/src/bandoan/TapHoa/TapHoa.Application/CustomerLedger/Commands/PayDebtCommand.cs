using MediatR;
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
    private readonly IBaseRepository<CustomerDebt> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public PayDebtCommandHandler(IBaseRepository<CustomerDebt> repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(PayDebtCommand request, CancellationToken cancellationToken)
    {
        var debt = await _repository.GetByIdAsync(request.DebtId, cancellationToken);
        if (debt == null) return false;

        debt.PayDebt(request.Amount);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}
