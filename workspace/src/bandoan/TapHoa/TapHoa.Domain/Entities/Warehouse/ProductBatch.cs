using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities.Warehouse;

public class ProductBatch : BaseAuditableEntity
{
    public Guid Id { get; private set; } = Guid.CreateVersion7();
    public Guid ProductId { get; private set; }
    public virtual Product Product { get; private set; }
    public string BatchNumber { get; private set; }
    public DateTime MfgDate { get; private set; }
    public DateTime ExpiryDate { get; private set; }

    private ProductBatch() { }

    public ProductBatch(Guid productId, string batchNumber, DateTime mfgDate, DateTime expiryDate)
    {
        ProductId = productId;
        BatchNumber = batchNumber;
        MfgDate = mfgDate;
        ExpiryDate = expiryDate;
    }
}
