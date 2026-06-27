using MediatR;
using TapHoa.Application.Suppliers.DTOs;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Interfaces;

namespace TapHoa.Application.Suppliers.Commands;

public class CreateSupplierCommand : IRequest<SupplierDto>
{
    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string? Notes { get; set; }
}

public class CreateSupplierCommandHandler : IRequestHandler<CreateSupplierCommand, SupplierDto>
{
    private readonly IBaseRepository<Supplier> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateSupplierCommandHandler(IBaseRepository<Supplier> repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<SupplierDto> Handle(CreateSupplierCommand request, CancellationToken cancellationToken)
    {
        var supplier = new Supplier(request.FullName, request.PhoneNumber, request.Address, request.Notes);

        await _repository.AddAsync(supplier, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new SupplierDto
        {
            Id = supplier.Id,
            FullName = supplier.FullName,
            PhoneNumber = supplier.PhoneNumber,
            Address = supplier.Address,
            Notes = supplier.Notes
        };
    }
}
