using MediatR;
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
    private readonly IBaseRepository<CustomerDebt> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public RecordDebtCommandHandler(IBaseRepository<CustomerDebt> repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(RecordDebtCommand request, CancellationToken cancellationToken)
    {
        // For simplicity, assuming CustomerId is the debt ID if it's 1:1, or we look it up
        var debt = await _repository.GetByIdAsync(request.CustomerId, cancellationToken);
        if (debt == null)
        {
            debt = CustomerDebt.Create(request.CustomerId, "Unknown Customer", null);
            await _repository.AddAsync(debt, cancellationToken);
        }
        
        debt.AddDebt(request.Amount);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return debt.Id;
    }
}
