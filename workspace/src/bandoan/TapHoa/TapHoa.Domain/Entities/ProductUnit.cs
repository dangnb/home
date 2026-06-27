using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities;

public class ProductUnit : BaseEntity<Guid>
{
    public Guid ProductId { get; private set; }
    public virtual Product Product { get; private set; }
    
    public string UnitName { get; private set; }
    public int ConversionFactor { get; private set; }
    public string? Barcode { get; private set; }
    public decimal Price { get; private set; }

    private ProductUnit() { }

    public ProductUnit(Guid productId, string unitName, int conversionFactor, decimal price, string? barcode = null)
    {
        ProductId = productId;
        UnitName = unitName;
        ConversionFactor = conversionFactor;
        Price = price;
        Barcode = barcode;
    }
    
    public void Update(string unitName, int conversionFactor, decimal price, string? barcode = null)
    {
        UnitName = unitName;
        ConversionFactor = conversionFactor;
        Price = price;
        Barcode = barcode;
    }
}
