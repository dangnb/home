using System;
using ConsBase.Domain.Common;
using ConsBase.Domain.Enums;

namespace ConsBase.Domain.Entities;

public class PaymentRequest : BaseEntity
{
    public string RequestCode { get; set; } = string.Empty;
    public Guid ProjectId { get; set; }
    public Project? Project { get; set; }
    public string PayeeName { get; set; } = string.Empty; // Người thụ hưởng (Nhà cung cấp/Thầu phụ/NV)
    public decimal RequestedAmount { get; set; }
    public decimal ApprovedAmount { get; set; }
    public string Reason { get; set; } = string.Empty;
    public PaymentRequestStatus Status { get; set; } = PaymentRequestStatus.Draft;
    public DateTime RequestDate { get; set; } = DateTime.UtcNow;
    public DateTime? PaymentDate { get; set; }
}

public class DebtRecord : BaseEntity
{
    public Guid ProjectId { get; set; }
    public Project? Project { get; set; }
    public string PartnerName { get; set; } = string.Empty; // Khách hàng hoặc Nhà cung cấp
    public string Type { get; set; } = "Receivable"; // Receivable (Phải thu) or Payable (Phải trả)
    public decimal OriginalAmount { get; set; }
    public decimal PaidAmount { get; set; }
    public decimal RemainingDebt => OriginalAmount - PaidAmount;
    public DateTime DueDate { get; set; }
}
