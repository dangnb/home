using MediatR;
using TapHoa.Domain.Interfaces;
using TapHoa.Domain.Entities;
using TapHoa.Application.Customers.DTOs;

namespace TapHoa.Application.Customers.Commands;

public class CreateCustomerCommand : IRequest<CustomerDto>
{
    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string? Notes { get; set; }
    public string? Email { get; set; }
    public string? BankAccountNumber { get; set; }
    public string? BankName { get; set; }
}

public class CreateCustomerCommandHandler : IRequestHandler<CreateCustomerCommand, CustomerDto>
{
    private readonly IBaseRepository<Customer> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateCustomerCommandHandler(IBaseRepository<Customer> repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<CustomerDto> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
    {
        var customer = Customer.Create(request.FullName, request.PhoneNumber, request.Address, request.Notes, request.Email, request.BankAccountNumber, request.BankName);
        
        await _repository.AddAsync(customer, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new CustomerDto
        {
            Id = customer.Id,
            FullName = customer.FullName,
            PhoneNumber = customer.PhoneNumber,
            Address = customer.Address,
            Notes = customer.Notes,
            Email = customer.Email,
            BankAccountNumber = customer.BankAccountNumber,
            BankName = customer.BankName
        };
    }
}
