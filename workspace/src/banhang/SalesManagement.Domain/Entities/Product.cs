namespace SalesManagement.Domain.Entities;

public class Product
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Sku { get; private set; }
    public decimal Price { get; private set; }
    public string Description { get; private set; }
    public string Unit { get; private set; } = "Cái"; // Mặc định
    
    public Guid? CategoryId { get; private set; }
    public Category? Category { get; private set; }

    private Product() { } // EF Core constructor

    public Product(string name, string sku, decimal price, string description, string unit = "Cái", Guid? categoryId = null)
    {
        Id = Guid.NewGuid();
        Name = name;
        Sku = sku;
        Price = price;
        Description = description;
        Unit = unit;
        CategoryId = categoryId;
    }

    public void Update(string name, string sku, decimal price, string description, string unit = "Cái", Guid? categoryId = null)
    {
        Name = name;
        Sku = sku;
        Price = price;
        Stock = stock;
        Description = description;
        Unit = unit;
        CategoryId = categoryId;
    }
}
