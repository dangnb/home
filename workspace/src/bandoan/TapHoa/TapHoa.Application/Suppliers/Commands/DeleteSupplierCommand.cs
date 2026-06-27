using MediatR;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Interfaces;

namespace TapHoa.Application.Suppliers.Commands;

public class DeleteSupplierCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

public class DeleteSupplierCommandHandler : IRequestHandler<DeleteSupplierCommand, bool>
{
    private readonly IBaseRepository<Supplier> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteSupplierCommandHandler(IBaseRepository<Supplier> repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteSupplierCommand request, CancellationToken cancellationToken)
    {
        var supplier = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (supplier == null)
            return false;

        _repository.Remove(supplier);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }
}
