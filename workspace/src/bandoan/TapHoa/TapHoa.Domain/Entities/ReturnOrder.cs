using TapHoa.Domain.Common;
using TapHoa.Domain.Enums;

namespace TapHoa.Domain.Entities;

public class ReturnOrder : BaseAuditableEntity<Guid>
{
    public Guid OriginalOrderId { get; private set; }
    public virtual Order? OriginalOrder { get; private set; }

    public string ReturnCode { get; private set; }
    public DateTime ReturnDate { get; private set; }
    public string? Reason { get; private set; }
    
    public ReturnStatus Status { get; private set; }
    public decimal RefundAmount { get; private set; }
    public string CreatedBy { get; private set; }

    public virtual ICollection<ReturnOrderDetail> ReturnOrderDetails { get; private set; }

    private ReturnOrder() { } // For EF Core

    public ReturnOrder(Guid originalOrderId, string returnCode, string createdBy, string? reason = null)
    {
        OriginalOrderId = originalOrderId;
        ReturnCode = returnCode;
        ReturnDate = DateTime.UtcNow;
        Reason = reason;
        Status = ReturnStatus.Pending;
        CreatedBy = createdBy;
        ReturnOrderDetails = new List<ReturnOrderDetail>();
    }

    public void AddDetail(Guid productId, int quantity, decimal refundPrice)
    {
        var detail = new ReturnOrderDetail(this, productId, quantity, refundPrice);
        ReturnOrderDetails.Add(detail);
        CalculateTotal();
    }

    private void CalculateTotal()
    {
        RefundAmount = ReturnOrderDetails.Sum(x => x.SubTotal);
    }

    public void Approve()
    {
        if (Status != ReturnStatus.Pending)
            throw new InvalidOperationException("Only pending return orders can be approved.");

        Status = ReturnStatus.Approved;
    }

    public void Cancel()
    {
        if (Status == ReturnStatus.Approved)
            throw new InvalidOperationException("Cannot cancel an approved return order.");
            
        Status = ReturnStatus.Cancelled;
    }
}
