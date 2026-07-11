using TapHoa.Domain.Enums;

namespace TapHoa.Application.ReturnOrders.DTOs;

public class ReturnOrderDto
{
    public Guid Id { get; set; }
    public string ReturnCode { get; set; } = default!;
    public Guid OriginalOrderId { get; set; }
    public string OriginalOrderCode { get; set; } = default!;
    public string CustomerName { get; set; } = default!;
    public DateTime ReturnDate { get; set; }
    public string? Reason { get; set; }
    public ReturnStatus Status { get; set; }
    public decimal RefundAmount { get; set; }
    public string CreatedBy { get; set; } = default!;
    
    public List<ReturnOrderDetailDto> Details { get; set; } = new();
}

public class ReturnOrderDetailDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = default!;
    public string Unit { get; set; } = default!;
    public int Quantity { get; set; }
    public decimal RefundPrice { get; set; }
    public decimal SubTotal { get; set; }
}
