namespace TapHoa.Application.Products.DTOs;

public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid? CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? MainImageUrl { get; set; }
    public List<string> AdditionalImages { get; set; } = new();
    public decimal CostPrice { get; set; }
    public decimal WholesalePrice { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public string? Barcode { get; set; }
    public string Status { get; set; } = string.Empty;
    public List<ProductUnitDto> Units { get; set; } = new();
}
