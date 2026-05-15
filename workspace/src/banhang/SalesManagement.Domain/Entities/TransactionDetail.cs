namespace SalesManagement.Domain.Entities;

public class TransactionDetail
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid TransactionId { get; set; }
    public InventoryTransaction? Transaction { get; set; }
    
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
    
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}
