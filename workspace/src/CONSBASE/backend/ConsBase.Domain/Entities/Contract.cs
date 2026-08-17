using System;
using System.Collections.Generic;
using ConsBase.Domain.Common;
using ConsBase.Domain.Enums;

namespace ConsBase.Domain.Entities;

public class Contract : BaseEntity
{
    public string ContractNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public Guid QuotationId { get; set; }
    public Quotation? Quotation { get; set; }

    public decimal TotalValue { get; set; }
    public decimal AdvancePayment { get; set; }
    public DateTime SignedDate { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public ContractStatus Status { get; set; } = ContractStatus.Draft;
    
    // Links to the generated Project (1-to-1 strict relationship)
    public Guid? ProjectId { get; set; }

    public List<ContractPaymentTerm> PaymentTerms { get; set; } = new();
}

public class ContractPaymentTerm : BaseEntity
{
    public Guid ContractId { get; set; }
    public int StageNumber { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Percentage { get; set; }
    public decimal Amount { get; set; }
    public DateTime DueDate { get; set; }
    public bool IsPaid { get; set; } = false;
    public DateTime? PaidDate { get; set; }
}
