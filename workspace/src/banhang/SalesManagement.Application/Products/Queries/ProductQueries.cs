using MediatR;
using SalesManagement.Application.Interfaces;
using SalesManagement.Application.Products.Dtos;
using SalesManagement.Domain.Entities;

namespace SalesManagement.Application.Products.Queries;

public record GetProductsQuery() : IRequest<List<ProductDto>>;
public record GetProductByIdQuery(Guid Id) : IRequest<ProductDto?>;

public class ProductQueryHandlers : 
    IRequestHandler<GetProductsQuery, List<ProductDto>>,
    IRequestHandler<GetProductByIdQuery, ProductDto?>
{
    private readonly IRepository<Product> _repository;

    public ProductQueryHandlers(IRepository<Product> repository)
    {
        _repository = repository;
    }

    public async Task<List<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var products = await _repository.GetAllAsync();
        return products.Select(p => new ProductDto(p.Id, p.Name, p.Sku, p.Price, p.Description, p.Unit, p.CategoryId)).ToList();
    }

    public async Task<ProductDto?> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await _repository.GetByIdAsync(request.Id);
        if (product == null) return null;
        
        return new ProductDto(product.Id, product.Name, product.Sku, product.Price, product.Description, product.Unit, product.CategoryId);
    }
}
