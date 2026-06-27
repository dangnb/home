using MediatR;
using TapHoa.Application.Products.DTOs;

namespace TapHoa.Application.Products.Commands.CreateProduct;

public class CreateProductCommand : IRequest<ProductDto>
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? MainImageUrl { get; set; }
    public List<string> AdditionalImages { get; set; } = new();
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string Unit { get; set; } = "kg";
    public string? Barcode { get; set; }
    public string Status { get; set; } = "Đang bán";
    public List<CreateProductUnitDto> Units { get; set; } = new();
}
