using MediatR;
using TapHoa.Domain.Interfaces;
using TapHoa.Domain.Entities;
using TapHoa.Application.Products.DTOs;

namespace TapHoa.Application.Products.Commands.CreateProduct;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ProductDto>
{
    private readonly IProductRepository _repository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateProductCommandHandler(IProductRepository repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var product = Product.Create(
            request.Name,
            request.CategoryId,
            request.SupplierId,
            request.CostPrice,
            request.WholesalePrice,
            request.Price,
            request.StockQuantity,
            request.Unit,
            request.MainImageUrl,
            request.AdditionalImages,
            request.Status,
            request.Barcode,
            request.MinStockLevel,
            request.MaxStockLevel
        );

        foreach (var unit in request.Units)
        {
            product.AddUnit(unit.UnitName, unit.ConversionFactor, unit.Price, unit.Barcode);
        }

        await _repository.AddAsync(product, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            CategoryId = product.CategoryId,
            CategoryName = product.CategoryObj?.Name ?? string.Empty,
            SupplierId = product.SupplierId,
            SupplierName = product.SupplierObj?.FullName ?? string.Empty,
            MainImageUrl = product.MainImageUrl,
            AdditionalImages = product.AdditionalImages,
            CostPrice = product.CostPrice,
            WholesalePrice = product.WholesalePrice,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            Unit = product.Unit,
            Barcode = product.Barcode,
            Status = product.Status,
            Units = product.Units.Select(u => new ProductUnitDto
            {
                Id = u.Id,
                UnitName = u.UnitName,
                ConversionFactor = u.ConversionFactor,
                Barcode = u.Barcode,
                Price = u.Price
            }).ToList()
        };
    }
}
