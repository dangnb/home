namespace SalesManagement.Application.Products.Dtos;

public record ProductDto(Guid Id, string Name, string Sku, decimal Price, string Description, string Unit, Guid? CategoryId);

public record CreateProductDto(string Name, string Sku, decimal Price, string Description, string Unit, Guid? CategoryId);

public record UpdateProductDto(Guid Id, string Name, string Sku, decimal Price, string Description, string Unit, Guid? CategoryId);
