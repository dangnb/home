namespace SalesManagement.Domain.Entities;

public class StockLedger
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid WarehouseId { get; set; }
    public Warehouse? Warehouse { get; set; }

    public Guid ProductId { get; set; }
    public Product? Product { get; set; }

    public Guid TransactionId { get; set; }
    public InventoryTransaction? Transaction { get; set; }

    public int ChangeQuantity { get; set; }
    public int BalanceAfter { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
