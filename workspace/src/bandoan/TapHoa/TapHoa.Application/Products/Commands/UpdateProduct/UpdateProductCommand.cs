using MediatR;
using TapHoa.Domain.Interfaces;
using TapHoa.Domain.Entities;
using TapHoa.Application.Products.DTOs;

namespace TapHoa.Application.Products.Commands.UpdateProduct;

public class UpdateProductCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid? CategoryId { get; set; }
    public string? MainImageUrl { get; set; }
    public List<string> AdditionalImages { get; set; } = new();
    public decimal CostPrice { get; set; }
    public decimal WholesalePrice { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public string? Barcode { get; set; }
    [System.Text.Json.Serialization.JsonConverter(typeof(System.Text.Json.Serialization.JsonStringEnumConverter))]
    public TapHoa.Domain.Enums.ProductStatus Status { get; set; } = TapHoa.Domain.Enums.ProductStatus.Active;
    public List<CreateProductUnitDto> Units { get; set; } = new();
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
            request.CategoryId,
            request.CostPrice,
            request.WholesalePrice,
            request.Price,
            request.StockQuantity,
            request.Unit,
            request.MainImageUrl,
            request.AdditionalImages,
            request.Status,
            request.Barcode
        );

        entity.ClearUnits();
        foreach (var unit in request.Units)
        {
            entity.AddUnit(unit.UnitName, unit.ConversionFactor, unit.Price, unit.Barcode);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}
