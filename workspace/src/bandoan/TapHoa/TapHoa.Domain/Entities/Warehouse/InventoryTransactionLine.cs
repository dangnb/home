namespace TapHoa.Domain.Entities.Warehouse;

public class InventoryTransactionLine
{
    public Guid Id { get; private set; } = Guid.CreateVersion7();
    
    public Guid TransactionId { get; private set; }
    public virtual InventoryTransaction Transaction { get; private set; }

    public Guid ProductId { get; private set; }
    public virtual Product Product { get; private set; }

    public int Quantity { get; private set; } // > 0 for Inbound, < 0 for Outbound
    public decimal UnitCost { get; private set; }

    private InventoryTransactionLine() { } // For EF Core

    internal InventoryTransactionLine(InventoryTransaction transaction, Guid productId, int quantity, decimal unitCost)
    {
        Transaction = transaction;
        ProductId = productId;
        Quantity = quantity;
        UnitCost = unitCost;
    }
}
