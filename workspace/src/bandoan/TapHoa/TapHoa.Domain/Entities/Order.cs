using TapHoa.Domain.Common;
using TapHoa.Domain.Enums;

namespace TapHoa.Domain.Entities;

public class Order : BaseAuditableEntity<Guid>
{
    public string OrderCode { get; private set; }
    
    public Guid? CustomerId { get; private set; }
    public virtual Customer? Customer { get; private set; }

    public DateTime OrderDate { get; private set; }
    
    // Financials
    public decimal SubTotal { get; private set; }
    public decimal DiscountAmount { get; private set; }
    public decimal TotalAmount { get; private set; } // SubTotal - DiscountAmount
    public decimal AmountPaid { get; private set; }

    public PaymentMethod PaymentMethod { get; private set; }
    public OrderStatus Status { get; private set; }

    // Optional Promotion applied
    public Guid? PromotionId { get; private set; }
    public virtual Promotion? Promotion { get; private set; }

    public string CreatedBy { get; private set; }
    public string? Notes { get; private set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; private set; }

    private Order() { } // For EF Core

    public Order(string orderCode, Guid? customerId, PaymentMethod paymentMethod, string createdBy, string notes = "")
    {
        OrderCode = orderCode;
        CustomerId = customerId;
        OrderDate = DateTime.UtcNow;
        PaymentMethod = paymentMethod;
        Status = OrderStatus.Pending;
        CreatedBy = createdBy;
        Notes = notes;
        OrderDetails = new List<OrderDetail>();
    }

    public void AddDetail(Guid productId, int quantity, decimal unitPrice)
    {
        var detail = new OrderDetail(this, productId, quantity, unitPrice);
        OrderDetails.Add(detail);
        CalculateTotals();
    }

    public void ApplyDiscount(decimal discountAmount, Guid? promotionId = null)
    {
        DiscountAmount = discountAmount;
        PromotionId = promotionId;
        CalculateTotals();
    }

    private void CalculateTotals()
    {
        SubTotal = OrderDetails.Sum(x => x.SubTotal);
        TotalAmount = Math.Max(0, SubTotal - DiscountAmount);
    }

    public void Complete(decimal amountPaid)
    {
        if (Status != OrderStatus.Pending)
            throw new InvalidOperationException("Only pending orders can be completed.");

        AmountPaid = amountPaid;
        Status = OrderStatus.Completed;
    }

    public void Cancel()
    {
        if (Status == OrderStatus.Completed)
            throw new InvalidOperationException("Cannot cancel a completed order.");
            
        Status = OrderStatus.Cancelled;
    }
}
