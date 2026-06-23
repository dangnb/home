using MediatR;
using TapHoa.Application.Products.DTOs;

namespace TapHoa.Application.Products.Commands.CreateProduct;

public class CreateProductCommand : IRequest<ProductDto>
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ImageIcon { get; set; } = "📦";
    public string ImageColor { get; set; } = "#f3f4f6";
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string Unit { get; set; } = "kg";
    public string Status { get; set; } = "Đang bán";
}
