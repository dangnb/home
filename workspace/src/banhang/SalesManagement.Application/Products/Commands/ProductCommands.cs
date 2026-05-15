using MediatR;
using SalesManagement.Application.Interfaces;
using SalesManagement.Application.Products.Dtos;
using SalesManagement.Domain.Entities;
using System.Text.Json;

namespace SalesManagement.Application.Products.Commands;

public record CreateProductCommand(CreateProductDto Dto) : IRequest<ProductDto>;
public record UpdateProductCommand(UpdateProductDto Dto) : IRequest<ProductDto>;
public record DeleteProductCommand(Guid Id) : IRequest<bool>;
public record BulkUploadProductsCommand(List<CreateProductDto> Products) : IRequest<bool>;

public class ProductCommandHandlers : 
    IRequestHandler<CreateProductCommand, ProductDto>,
    IRequestHandler<UpdateProductCommand, ProductDto>,
    IRequestHandler<DeleteProductCommand, bool>,
    IRequestHandler<BulkUploadProductsCommand, bool>
{
    private readonly IRepository<Product> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public ProductCommandHandlers(IRepository<Product> repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var unit = string.IsNullOrEmpty(request.Dto.Unit) ? "Cái" : request.Dto.Unit;
        var product = new Product(request.Dto.Name, request.Dto.Sku, request.Dto.Price, request.Dto.Description, unit, request.Dto.CategoryId);
        await _repository.AddAsync(product);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        return new ProductDto(product.Id, product.Name, product.Sku, product.Price, product.Description, product.Unit, product.CategoryId);
    }

    public async Task<ProductDto> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _repository.GetByIdAsync(request.Dto.Id);
        if (product == null) throw new Exception("Product not found");

        var unit = string.IsNullOrEmpty(request.Dto.Unit) ? "Cái" : request.Dto.Unit;
        product.Update(request.Dto.Name, request.Dto.Sku, request.Dto.Price, request.Dto.Description, unit, request.Dto.CategoryId);
        _repository.Update(product);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new ProductDto(product.Id, product.Name, product.Sku, product.Price, product.Description, product.Unit, product.CategoryId);
    }

    public async Task<bool> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _repository.GetByIdAsync(request.Id);
        if (product == null) return false;

        _repository.Remove(product);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> Handle(BulkUploadProductsCommand request, CancellationToken cancellationToken)
    {
        foreach (var dto in request.Products)
        {
            var unit = string.IsNullOrEmpty(dto.Unit) ? "Cái" : dto.Unit;
            var product = new Product(dto.Name, dto.Sku, dto.Price, dto.Description, unit, dto.CategoryId);
            await _repository.AddAsync(product);
        }
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}
