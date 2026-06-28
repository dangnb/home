using MediatR;
using TapHoa.Domain.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.Customers.Commands;

public class UpdateCustomerCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string? Notes { get; set; }
    public string? Email { get; set; }
    public string? BankAccountNumber { get; set; }
    public string? BankName { get; set; }
}

public class UpdateCustomerCommandHandler : IRequestHandler<UpdateCustomerCommand, bool>
{
    private readonly IBaseRepository<Customer> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCustomerCommandHandler(IBaseRepository<Customer> repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(UpdateCustomerCommand request, CancellationToken cancellationToken)
    {
        var customer = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (customer == null)
            return false;

        customer.Update(request.FullName, request.PhoneNumber, request.Address, request.Notes, request.Email, request.BankAccountNumber, request.BankName);
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
