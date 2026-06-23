using SalesManagement.Domain.Enums;

namespace SalesManagement.Domain.Entities;

public class PurchaseOrder
{
    public Guid Id { get; private set; }
    public string Code { get; private set; }
    public Guid SupplierId { get; private set; }
    public Supplier? Supplier { get; private set; }
    
    public DateTime OrderDate { get; private set; }
    public OrderStatus Status { get; set; }
    public decimal TotalAmount { get; private set; }
    public string Note { get; private set; }

    public ICollection<PurchaseOrderDetail> Details { get; set; } = new List<PurchaseOrderDetail>();

    private PurchaseOrder() { }

    public PurchaseOrder(string code, Guid supplierId, DateTime orderDate, string note)
    {
        Id = Guid.NewGuid();
        Code = code;
        SupplierId = supplierId;
        OrderDate = orderDate;
        Note = note;
        Status = OrderStatus.DRAFT;
        TotalAmount = 0;
    }

    public void CalculateTotal()
    {
        TotalAmount = Details.Sum(d => d.Quantity * d.UnitPrice);
    }
}

public class PurchaseOrderDetail
{
    public Guid Id { get; set; }
    public Guid PurchaseOrderId { get; set; }
    public PurchaseOrder? PurchaseOrder { get; set; }
    
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}
