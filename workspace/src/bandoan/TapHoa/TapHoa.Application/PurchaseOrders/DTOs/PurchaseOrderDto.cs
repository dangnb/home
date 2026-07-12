using TapHoa.Domain.Enums;

namespace TapHoa.Application.PurchaseOrders.DTOs;

public class PurchaseOrderDto
{
    public Guid Id { get; set; }
    public string OrderCode { get; set; } = string.Empty;
    public Guid SupplierId { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public DateTime? ExpectedDeliveryDate { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal AmountPaid { get; set; }
    public PurchaseOrderStatus Status { get; set; }
    public string? Notes { get; set; }
    public List<PurchaseOrderDetailDto> Details { get; set; } = new();
}

public class PurchaseOrderDetailDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal CostPrice { get; set; }
    public decimal SubTotal { get; set; }
}

public class CreatePurchaseOrderDto
{
    public Guid SupplierId { get; set; }
    public DateTime? ExpectedDeliveryDate { get; set; }
    public string? Notes { get; set; }
    public List<CreatePurchaseOrderDetailDto> Details { get; set; } = new();
}

public class CreatePurchaseOrderDetailDto
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal CostPrice { get; set; }
}

public class UpdatePurchaseOrderStatusDto
{
    public PurchaseOrderStatus Status { get; set; }
    public decimal? AmountPaid { get; set; }
}
