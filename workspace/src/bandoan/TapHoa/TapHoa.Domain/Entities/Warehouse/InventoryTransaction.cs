using TapHoa.Domain.Enums;

namespace TapHoa.Domain.Entities.Warehouse;

public class InventoryTransaction
{
    public Guid Id { get; private set; } = Guid.CreateVersion7();
    public string Code { get; private set; }
    public TransactionType Type { get; private set; }
    public TransactionStatus Status { get; private set; }
    public string ReferenceId { get; private set; } // PO Number, Order Number
    public string Notes { get; private set; }
    
    public DateTime CreatedAt { get; private set; }
    public string CreatedBy { get; private set; }
    
    public DateTime? ApprovedAt { get; private set; }
    public string? ApprovedBy { get; private set; }

    public virtual ICollection<InventoryTransactionLine> Lines { get; private set; }

    private InventoryTransaction() { } // For EF Core

    public InventoryTransaction(string code, TransactionType type, string referenceId, string createdBy, string notes = "")
    {
        Code = code;
        Type = type;
        Status = TransactionStatus.Draft;
        ReferenceId = referenceId;
        CreatedBy = createdBy;
        CreatedAt = DateTime.UtcNow;
        Notes = notes;
        Lines = new List<InventoryTransactionLine>();
    }

    public void AddLine(Guid productId, int quantity, decimal unitCost)
    {
        if (Status != TransactionStatus.Draft)
            throw new InvalidOperationException("Can only add lines to Draft transactions.");
            
        Lines.Add(new InventoryTransactionLine(this, productId, quantity, unitCost));
    }

    public void SubmitForApproval()
    {
        if (Status != TransactionStatus.Draft)
            throw new InvalidOperationException("Only Draft transactions can be submitted.");
        
        if (!Lines.Any())
            throw new InvalidOperationException("Cannot submit an empty transaction.");

        Status = TransactionStatus.PendingApproval;
    }

    public void Approve(string approvedBy)
    {
        if (Status != TransactionStatus.PendingApproval)
            throw new InvalidOperationException("Transaction must be PendingApproval to be approved.");

        Status = TransactionStatus.Completed;
        ApprovedAt = DateTime.UtcNow;
        ApprovedBy = approvedBy;
    }

    public void Cancel()
    {
        if (Status == TransactionStatus.Completed)
            throw new InvalidOperationException("Cannot cancel a completed transaction.");

        Status = TransactionStatus.Cancelled;
    }
}
