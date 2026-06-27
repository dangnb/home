using MediatR;
using TapHoa.Application.Products.DTOs;

namespace TapHoa.Application.Products.Commands.CreateProduct;

public class CreateProductCommand : IRequest<ProductDto>
{
    public string Name { get; set; } = string.Empty;
    public Guid? CategoryId { get; set; }
    public string? MainImageUrl { get; set; }
    public List<string> AdditionalImages { get; set; } = new();
    public decimal CostPrice { get; set; }
    public decimal WholesalePrice { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string Unit { get; set; } = "kg";
    public string? Barcode { get; set; }
    [System.Text.Json.Serialization.JsonConverter(typeof(System.Text.Json.Serialization.JsonStringEnumConverter))]
    public TapHoa.Domain.Enums.ProductStatus Status { get; set; } = TapHoa.Domain.Enums.ProductStatus.Active;
    public List<CreateProductUnitDto> Units { get; set; } = new();
}
