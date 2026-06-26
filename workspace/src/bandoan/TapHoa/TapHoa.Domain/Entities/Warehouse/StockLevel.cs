using System.ComponentModel.DataAnnotations;

namespace TapHoa.Domain.Entities.Warehouse;

public class StockLevel
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid ProductId { get; private set; }
    public virtual Product Product { get; private set; }

    public Guid? LocationId { get; private set; }
    public virtual WarehouseLocation Location { get; private set; }

    public Guid? BatchId { get; private set; }
    public virtual ProductBatch Batch { get; private set; }

    // Multi-branch
    public Guid StoreId { get; private set; }

    public int QuantityOnHand { get; private set; }
    public int AvailableQuantity { get; private set; }
    public int ReservedQuantity { get; private set; }
    public int ReorderPoint { get; private set; }
    public decimal MovingAverageCost { get; private set; }
    public DateTime LastRestockedAt { get; private set; }

    [Timestamp]
    public byte[] RowVersion { get; private set; }

    private StockLevel() { } // For EF Core

    public StockLevel(Guid productId, Guid storeId, Guid? locationId = null, Guid? batchId = null, int reorderPoint = 10)
    {
        ProductId = productId;
        StoreId = storeId;
        LocationId = locationId;
        BatchId = batchId;
        QuantityOnHand = 0;
        AvailableQuantity = 0;
        ReservedQuantity = 0;
        ReorderPoint = reorderPoint;
        MovingAverageCost = 0;
        RowVersion = Guid.NewGuid().ToByteArray();
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
        RowVersion = Guid.NewGuid().ToByteArray();
    }

    public void DecreaseStock(int quantity)
    {
        if (quantity < 0) throw new ArgumentException("Quantity must be positive.");
        if (QuantityOnHand < quantity) throw new InvalidOperationException("Not enough stock.");

        // Decreasing stock completely removes it from on-hand.
        // It must have been reserved first, OR it decrees available directly (for adjustments).
        QuantityOnHand -= quantity;
        
        // Safety bounds
        if (AvailableQuantity < 0) AvailableQuantity = 0;
        if (ReservedQuantity < 0) ReservedQuantity = 0;
        
        RowVersion = Guid.NewGuid().ToByteArray();
    }

    public void ReserveStock(int quantity)
    {
        if (quantity < 0) throw new ArgumentException("Quantity must be positive.");
        if (AvailableQuantity < quantity) throw new InvalidOperationException("Insufficient available stock to reserve.");
        
        AvailableQuantity -= quantity;
        ReservedQuantity += quantity;
    }

    public void ReleaseReservedStock(int quantity)
    {
        if (quantity < 0) throw new ArgumentException("Quantity must be positive.");
        if (ReservedQuantity < quantity) throw new InvalidOperationException("Not enough reserved stock to release.");

        ReservedQuantity -= quantity;
        AvailableQuantity += quantity;
    }
    
    public bool IsLowStock()
    {
        return AvailableQuantity <= ReorderPoint;
    }
}
