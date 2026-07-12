using TapHoa.Domain.Common;
using TapHoa.Domain.Enums;

namespace TapHoa.Domain.Entities;

public class PurchaseOrder : BaseAuditableEntity<Guid>
{
    public string OrderCode { get; private set; } = null!;
    
    public Guid SupplierId { get; private set; }
    public virtual Supplier Supplier { get; private set; } = null!;

    public DateTime OrderDate { get; private set; }
    public DateTime? ExpectedDeliveryDate { get; private set; }
    
    public decimal TotalAmount { get; private set; }
    public decimal AmountPaid { get; private set; }
    
    public PurchaseOrderStatus Status { get; private set; }
    
    public string? Notes { get; private set; }

    public virtual ICollection<PurchaseOrderDetail> PurchaseOrderDetails { get; private set; } = new List<PurchaseOrderDetail>();

    private PurchaseOrder() { } // EF Core

    public PurchaseOrder(string orderCode, Guid supplierId, DateTime? expectedDeliveryDate, string? notes)
    {
        Id = Guid.NewGuid();
        OrderCode = orderCode;
        SupplierId = supplierId;
        OrderDate = DateTime.UtcNow;
        ExpectedDeliveryDate = expectedDeliveryDate;
        Status = PurchaseOrderStatus.Draft;
        Notes = notes;
    }

    public void AddDetail(Guid productId, int quantity, decimal costPrice)
    {
        var detail = new PurchaseOrderDetail(Id, productId, quantity, costPrice);
        PurchaseOrderDetails.Add(detail);
        CalculateTotal();
    }

    public void RemoveDetail(Guid detailId)
    {
        var detail = PurchaseOrderDetails.FirstOrDefault(d => d.Id == detailId);
        if (detail != null)
        {
            PurchaseOrderDetails.Remove(detail);
            CalculateTotal();
        }
    }

    public void CalculateTotal()
    {
        TotalAmount = PurchaseOrderDetails.Sum(d => d.SubTotal);
    }

    public void UpdateStatus(PurchaseOrderStatus newStatus)
    {
        Status = newStatus;
    }

    public void UpdateAmountPaid(decimal amountPaid)
    {
        AmountPaid = amountPaid;
    }

    public void UpdateDetails(Guid supplierId, DateTime? expectedDeliveryDate, string? notes)
    {
        SupplierId = supplierId;
        ExpectedDeliveryDate = expectedDeliveryDate;
        Notes = notes;
    }
}
