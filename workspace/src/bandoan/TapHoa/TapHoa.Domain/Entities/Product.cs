using TapHoa.Domain.Exceptions;

namespace TapHoa.Domain.Entities;

public class Product
{
    public int Id { get; private set; }
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

    // Usually DDD provides separated methods like AddStock, DecreaseStock
    public void DecreaseStock(int quantity)
    {
        if (quantity < 0) throw new DomainException("Số lượng giảm không hợp lệ.");
        if (StockQuantity < quantity) throw new DomainException("Số lượng tồn kho không đủ.");
        
        StockQuantity -= quantity;
        if (StockQuantity == 0)
        {
            Status = "Hết hàng";
        }
        else if (StockQuantity < 10)
        {
            Status = "Sắp hết";
        }
    }
}
