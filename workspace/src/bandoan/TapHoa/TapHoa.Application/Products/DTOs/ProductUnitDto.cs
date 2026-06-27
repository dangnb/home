namespace TapHoa.Application.Products.DTOs;

public class ProductUnitDto
{
    public Guid Id { get; set; }
    public string UnitName { get; set; } = string.Empty;
    public int ConversionFactor { get; set; }
    public string? Barcode { get; set; }
    public decimal Price { get; set; }
}

public class CreateProductUnitDto
{
    public string UnitName { get; set; } = string.Empty;
    public int ConversionFactor { get; set; }
    public string? Barcode { get; set; }
    public decimal Price { get; set; }
}
