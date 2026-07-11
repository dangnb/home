using TapHoa.Domain.Common;
using TapHoa.Domain.Enums;

namespace TapHoa.Domain.Entities;

public class OrderDetail : BaseAuditableEntity<Guid>
{
    public Guid OrderId { get; private set; }
    public virtual Order Order { get; private set; }

    public Guid ProductId { get; private set; }
    public virtual Product Product { get; private set; }

    public int Quantity { get; private set; }
    public decimal UnitPrice { get; private set; }
    public decimal SubTotal { get; private set; } // Quantity * UnitPrice

    private OrderDetail() { } // For EF Core

    public OrderDetail(Order order, Guid productId, int quantity, decimal unitPrice)
    {
        Order = order;
        ProductId = productId;
        Quantity = quantity;
        UnitPrice = unitPrice;
        SubTotal = quantity * unitPrice;
    }
}
