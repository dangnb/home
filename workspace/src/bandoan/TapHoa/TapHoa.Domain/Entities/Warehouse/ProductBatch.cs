using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities.Warehouse;

public class ProductBatch : BaseAuditableEntity<Guid>
{
    public Guid ProductId { get; private set; }
    public virtual Product Product { get; private set; }
    public string BatchNumber { get; private set; }
    public DateTime MfgDate { get; private set; }
    public DateTime ExpiryDate { get; private set; }
    public int StockQuantity { get; private set; }
    public bool IsActive { get; private set; }

    private ProductBatch() { }

    public ProductBatch(Guid productId, string batchNumber, DateTime mfgDate, DateTime expiryDate)
    {
        ProductId = productId;
        BatchNumber = batchNumber;
        MfgDate = mfgDate;
        ExpiryDate = expiryDate;
        StockQuantity = 0;
        IsActive = true;
    }

    public void AddStock(int quantity)
    {
        if (quantity < 0) throw new ArgumentException("Quantity cannot be negative");
        StockQuantity += quantity;
        if (StockQuantity > 0) IsActive = true;
    }

    public void RemoveStock(int quantity)
    {
        if (quantity < 0) throw new ArgumentException("Quantity cannot be negative");
        if (StockQuantity < quantity) throw new InvalidOperationException("Not enough stock in this batch");
        StockQuantity -= quantity;
        if (StockQuantity == 0) IsActive = false;
    }
}
