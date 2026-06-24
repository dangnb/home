using MediatR;
using TapHoa.Domain.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.Products.Commands.UpdateProduct;

public class UpdateProductCommand : IRequest<bool>
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? MainImageUrl { get; set; }
    public List<string> AdditionalImages { get; set; } = new();
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, bool>
{
    private readonly IProductRepository _repository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateProductCommandHandler(IProductRepository repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken);
        if (entity == null) return false;

        entity.Update(
            request.Name,
            request.Category,
            request.Price,
            request.StockQuantity,
            request.Unit,
            request.MainImageUrl,
            request.AdditionalImages,
            request.Status
        );

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}
