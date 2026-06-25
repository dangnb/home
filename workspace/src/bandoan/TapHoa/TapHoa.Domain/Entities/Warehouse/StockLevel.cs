using System.ComponentModel.DataAnnotations;

namespace TapHoa.Domain.Entities.Warehouse;

public class StockLevel
{
    public Guid ProductId { get; private set; }
    public virtual Product Product { get; private set; }
    
    // Multi-branch
    public Guid StoreId { get; private set; }

    public int QuantityOnHand { get; private set; }
    public int AvailableQuantity { get; private set; }
    public int ReorderPoint { get; private set; }
    public decimal MovingAverageCost { get; private set; }
    public DateTime LastRestockedAt { get; private set; }

    private StockLevel() { } // For EF Core

    public StockLevel(Guid productId, Guid storeId, int reorderPoint = 10)
    {
        ProductId = productId;
        StoreId = storeId;
        QuantityOnHand = 0;
        AvailableQuantity = 0;
        ReorderPoint = reorderPoint;
        MovingAverageCost = 0;
    }

    public void IncreaseStock(int quantity, decimal unitCost)
    {
        if (quantity < 0) throw new ArgumentException("Quantity must be positive.");
        
        // Calculate Moving Average Cost
        var totalCurrentValue = QuantityOnHand * MovingAverageCost;
        var totalNewValue = quantity * unitCost;
        var newTotalQuantity = QuantityOnHand + quantity;
        
        if (newTotalQuantity > 0)
        {
            MovingAverageCost = (totalCurrentValue + totalNewValue) / newTotalQuantity;
        }

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
    
    public bool IsLowStock()
    {
        return AvailableQuantity <= ReorderPoint;
    }
}
