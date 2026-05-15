namespace SalesManagement.Domain.Entities;

public class StockBalance
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid WarehouseId { get; set; }
    public Warehouse? Warehouse { get; set; }

    public Guid ProductId { get; set; }
    public Product? Product { get; set; }

    public int Quantity { get; set; }
    
    public DateTime LastUpdatedAt { get; set; } = DateTime.UtcNow;
}
