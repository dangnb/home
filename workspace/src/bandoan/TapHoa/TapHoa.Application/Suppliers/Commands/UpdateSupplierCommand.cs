using MediatR;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Interfaces;

namespace TapHoa.Application.Suppliers.Commands;

public class UpdateSupplierCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string? Notes { get; set; }
}

public class UpdateSupplierCommandHandler : IRequestHandler<UpdateSupplierCommand, bool>
{
    private readonly IBaseRepository<Supplier> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateSupplierCommandHandler(IBaseRepository<Supplier> repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(UpdateSupplierCommand request, CancellationToken cancellationToken)
    {
        var supplier = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (supplier == null)
            return false;

        supplier.Update(request.FullName, request.PhoneNumber, request.Address, request.Notes);
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
