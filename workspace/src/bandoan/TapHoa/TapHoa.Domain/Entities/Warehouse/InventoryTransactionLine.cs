namespace TapHoa.Domain.Entities.Warehouse;

public class InventoryTransactionLine
{
    public int Id { get; private set; }
    
    public int TransactionId { get; private set; }
    public virtual InventoryTransaction Transaction { get; private set; }

    public int ProductId { get; private set; }
    public virtual Product Product { get; private set; }

    public int Quantity { get; private set; } // > 0 for Inbound, < 0 for Outbound
    public decimal UnitCost { get; private set; }

    private InventoryTransactionLine() { } // For EF Core

    internal InventoryTransactionLine(InventoryTransaction transaction, int productId, int quantity, decimal unitCost)
    {
        Transaction = transaction;
        ProductId = productId;
        Quantity = quantity;
        UnitCost = unitCost;
    }
}
