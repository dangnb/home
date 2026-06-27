using TapHoa.Domain.Common;
using TapHoa.Domain.Exceptions;

namespace TapHoa.Domain.Entities;

public class Product : BaseAuditableEntity<Guid>
{
    public string Name { get; private set; }
    public Guid? CategoryId { get; private set; }
    public virtual Category? CategoryObj { get; private set; }
    public string? MainImageUrl { get; private set; }
    public List<string> AdditionalImages { get; private set; } = new();
    public decimal CostPrice { get; private set; }
    public decimal WholesalePrice { get; private set; }
    public decimal Price { get; private set; }
    public int StockQuantity { get; private set; }
    public string Unit { get; private set; }
    public string? Barcode { get; private set; }
    public string Status { get; private set; }

    private readonly List<ProductUnit> _units = new();
    public IReadOnlyCollection<ProductUnit> Units => _units.AsReadOnly();

    // Private parameterless constructor for EF Core
    private Product() { }

    private Product(string name, Guid? categoryId, decimal costPrice, decimal wholesalePrice, decimal price, int stockQuantity, string unit, string? mainImageUrl, List<string> additionalImages, string status, string? barcode = null)
    {
        Name = name;
        CategoryId = categoryId;
        CostPrice = costPrice;
        WholesalePrice = wholesalePrice;
        Price = price;
        StockQuantity = stockQuantity;
        Unit = unit;
        Barcode = barcode;
        MainImageUrl = mainImageUrl;
        AdditionalImages = additionalImages ?? new List<string>();
        Status = status;
    }

    public static Product Create(string name, Guid? categoryId, decimal costPrice, decimal wholesalePrice, decimal price, int stockQuantity, string unit, string? mainImageUrl, List<string> additionalImages, string status, string? barcode = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên sản phẩm không được để trống.");

        if (price < 0 || costPrice < 0 || wholesalePrice < 0)
            throw new DomainException("Giá trị không thể là số âm.");

        if (stockQuantity < 0)
            throw new DomainException("Số lượng tồn kho không thể là số âm.");

        return new Product(name, categoryId, costPrice, wholesalePrice, price, stockQuantity, unit, mainImageUrl, additionalImages, status, barcode);
    }

    public void Update(string name, Guid? categoryId, decimal costPrice, decimal wholesalePrice, decimal price, int stockQuantity, string unit, string? mainImageUrl, List<string> additionalImages, string status, string? barcode = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên sản phẩm không được để trống.");

        if (price < 0 || costPrice < 0 || wholesalePrice < 0)
            throw new DomainException("Giá trị không thể là số âm.");

        if (stockQuantity < 0)
            throw new DomainException("Số lượng tồn kho không thể là số âm.");

        Name = name;
        CategoryId = categoryId;
        CostPrice = costPrice;
        WholesalePrice = wholesalePrice;
        Price = price;
        StockQuantity = stockQuantity;
        Unit = unit;
        Barcode = barcode;
        MainImageUrl = mainImageUrl;
        AdditionalImages = additionalImages ?? new List<string>();
        Status = status;
    }

    public void UpdateStatus(string status)
    {
        Status = status;
    }
    
    public void UpdateStockCache(int newTotalStock)
    {
        StockQuantity = newTotalStock;
    }

    public void AddUnit(string unitName, int conversionFactor, decimal price, string? barcode = null)
    {
        if (conversionFactor <= 0) throw new DomainException("Conversion factor must be > 0.");
        _units.Add(new ProductUnit(Id, unitName, conversionFactor, price, barcode));
    }

    public void ClearUnits()
    {
        _units.Clear();
    }
}
