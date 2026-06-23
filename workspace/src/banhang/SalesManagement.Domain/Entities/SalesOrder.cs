using SalesManagement.Domain.Enums;

namespace SalesManagement.Domain.Entities;

public class SalesOrder
{
    public Guid Id { get; private set; }
    public string Code { get; private set; }
    public Guid CustomerId { get; private set; }
    public Customer? Customer { get; private set; }
    
    public DateTime OrderDate { get; private set; }
    public OrderStatus Status { get; set; }
    public decimal TotalAmount { get; private set; }
    public string Note { get; private set; }

    public ICollection<SalesOrderDetail> Details { get; set; } = new List<SalesOrderDetail>();

    private SalesOrder() { }

    public SalesOrder(string code, Guid customerId, DateTime orderDate, string note)
    {
        Id = Guid.NewGuid();
        Code = code;
        CustomerId = customerId;
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

public class SalesOrderDetail
{
    public Guid Id { get; set; }
    public Guid SalesOrderId { get; set; }
    public SalesOrder? SalesOrder { get; set; }
    
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }

    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}
