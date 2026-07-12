using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities;

public class PurchaseOrderDetail : BaseAuditableEntity<Guid>
{
    public Guid PurchaseOrderId { get; private set; }
    public virtual PurchaseOrder PurchaseOrder { get; private set; } = null!;

    public Guid ProductId { get; private set; }
    public virtual Product Product { get; private set; } = null!;

    public int Quantity { get; private set; }
    public decimal CostPrice { get; private set; }
    public decimal SubTotal { get; private set; }

    private PurchaseOrderDetail() { } // EF Core

    public PurchaseOrderDetail(Guid purchaseOrderId, Guid productId, int quantity, decimal costPrice)
    {
        Id = Guid.NewGuid();
        PurchaseOrderId = purchaseOrderId;
        ProductId = productId;
        Quantity = quantity;
        CostPrice = costPrice;
        CalculateSubTotal();
    }

    public void Update(int quantity, decimal costPrice)
    {
        Quantity = quantity;
        CostPrice = costPrice;
        CalculateSubTotal();
    }

    private void CalculateSubTotal()
    {
        SubTotal = Quantity * CostPrice;
    }
}
