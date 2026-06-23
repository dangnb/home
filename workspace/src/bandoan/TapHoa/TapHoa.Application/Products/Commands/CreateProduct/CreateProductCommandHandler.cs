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
            request.Category,
            request.Price,
            request.StockQuantity,
            request.Unit,
            request.ImageIcon,
            request.ImageColor,
            request.Status
        );

        await _repository.AddAsync(product, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Category = product.Category,
            ImageIcon = product.ImageIcon,
            ImageColor = product.ImageColor,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            Unit = product.Unit,
            Status = product.Status
        };
    }
}
