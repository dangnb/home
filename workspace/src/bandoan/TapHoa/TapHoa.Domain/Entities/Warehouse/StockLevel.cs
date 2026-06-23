using System.ComponentModel.DataAnnotations;

namespace TapHoa.Domain.Entities.Warehouse;

public class StockLevel
{
    [Key]
    public int ProductId { get; private set; }
    public virtual Product Product { get; private set; }

    public int QuantityOnHand { get; private set; }
    public int AvailableQuantity { get; private set; }
    public DateTime LastRestockedAt { get; private set; }

    private StockLevel() { } // For EF Core

    public StockLevel(int productId)
    {
        ProductId = productId;
        QuantityOnHand = 0;
        AvailableQuantity = 0;
    }

    public void IncreaseStock(int quantity)
    {
        if (quantity < 0) throw new ArgumentException("Quantity must be positive.");
        QuantityOnHand += quantity;
        AvailableQuantity += quantity;
        LastRestockedAt = DateTime.UtcNow;
    }

    public void DecreaseStock(int quantity)
    {
        if (quantity < 0) throw new ArgumentException("Quantity must be positive.");
        QuantityOnHand -= quantity;
        AvailableQuantity -= quantity;
    }

    public void ReserveStock(int quantity)
    {
        if (quantity < 0) throw new ArgumentException("Quantity must be positive.");
        if (AvailableQuantity < quantity) throw new InvalidOperationException("Insufficient available stock to reserve.");
        
        AvailableQuantity -= quantity;
    }

    public void ReleaseReservedStock(int quantity)
    {
        if (quantity < 0) throw new ArgumentException("Quantity must be positive.");
        AvailableQuantity += quantity;
    }
}
