using TapHoa.Domain.Common;
using TapHoa.Domain.Exceptions;

namespace TapHoa.Domain.Entities;

public class Product : BaseAuditableEntity<Guid>
{
    public string Name { get; private set; }
    public string Category { get; private set; }
    public string? MainImageUrl { get; private set; }
    public List<string> AdditionalImages { get; private set; } = new();
    public decimal Price { get; private set; }
    public int StockQuantity { get; private set; }
    public string Unit { get; private set; }
    public string Status { get; private set; }

    // Private parameterless constructor for EF Core
    private Product() { }

    private Product(string name, string category, decimal price, int stockQuantity, string unit, string? mainImageUrl, List<string> additionalImages, string status)
    {
        Name = name;
        Category = category;
        Price = price;
        StockQuantity = stockQuantity;
        Unit = unit;
        MainImageUrl = mainImageUrl;
        AdditionalImages = additionalImages ?? new List<string>();
        Status = status;
    }

    public static Product Create(string name, string category, decimal price, int stockQuantity, string unit, string? mainImageUrl, List<string> additionalImages, string status)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên sản phẩm không được để trống.");

        if (price < 0)
            throw new DomainException("Giá bán không thể là số âm.");

        if (stockQuantity < 0)
            throw new DomainException("Số lượng tồn kho không thể là số âm.");

        return new Product(name, category, price, stockQuantity, unit, mainImageUrl, additionalImages, status);
    }

    public void Update(string name, string category, decimal price, int stockQuantity, string unit, string? mainImageUrl, List<string> additionalImages, string status)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên sản phẩm không được để trống.");

        if (price < 0)
            throw new DomainException("Giá bán không thể là số âm.");

        if (stockQuantity < 0)
            throw new DomainException("Số lượng tồn kho không thể là số âm.");

        Name = name;
        Category = category;
        Price = price;
        StockQuantity = stockQuantity;
        Unit = unit;
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
}
