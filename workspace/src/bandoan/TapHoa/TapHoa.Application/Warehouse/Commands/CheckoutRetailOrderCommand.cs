using MediatR;

namespace TapHoa.Application.Warehouse.Commands;

public class CheckoutRetailOrderCommand : IRequest<bool>
{
    public Guid StoreId { get; set; }
    public string OrderReference { get; set; } = string.Empty;
    public List<RetailOrderItem> Items { get; set; } = new();
}

public class RetailOrderItem
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal SellingPrice { get; set; }
}
