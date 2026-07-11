using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities;

public class ReturnOrderDetail : BaseAuditableEntity<Guid>
{
    public Guid ReturnOrderId { get; private set; }
    public virtual ReturnOrder? ReturnOrder { get; private set; }

    public Guid ProductId { get; private set; }
    public virtual Product? Product { get; private set; }

    public int Quantity { get; private set; }
    public decimal RefundPrice { get; private set; }
    
    public decimal SubTotal => Quantity * RefundPrice;

    private ReturnOrderDetail() { } // For EF Core

    internal ReturnOrderDetail(ReturnOrder returnOrder, Guid productId, int quantity, decimal refundPrice)
    {
        ReturnOrderId = returnOrder.Id;
        ReturnOrder = returnOrder;
        ProductId = productId;
        Quantity = quantity;
        RefundPrice = refundPrice;
    }
}
