using System;
using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities;

public enum SupplierDebtTransactionType
{
    Debt = 0,
    Payment = 1
}

public class SupplierDebtTransaction : BaseAuditableEntity<Guid>
{
    public Guid SupplierId { get; private set; }
    public SupplierDebtTransactionType Type { get; private set; }
    public decimal Amount { get; private set; }
    public decimal PaidAmount { get; private set; }
    public string? Note { get; private set; }
    public Guid? RelatedDebtId { get; private set; }
    public DateTime? DueDate { get; private set; }

    public virtual Supplier? Supplier { get; private set; }

    private SupplierDebtTransaction() { }

    public static SupplierDebtTransaction CreateDebt(Guid supplierId, decimal amount, string? note, DateTime? dueDate = null)
    {
        return new SupplierDebtTransaction
        {
            Id = Guid.NewGuid(),
            SupplierId = supplierId,
            Type = SupplierDebtTransactionType.Debt,
            Amount = amount,
            PaidAmount = 0,
            Note = note,
            DueDate = dueDate
        };
    }

    public static SupplierDebtTransaction CreatePayment(Guid supplierId, decimal amount, string? note, Guid? relatedDebtId = null)
    {
        return new SupplierDebtTransaction
        {
            Id = Guid.NewGuid(),
            SupplierId = supplierId,
            Type = SupplierDebtTransactionType.Payment,
            Amount = amount,
            PaidAmount = 0, // Not applicable for payment
            Note = note,
            RelatedDebtId = relatedDebtId
        };
    }

    public void AddPayment(decimal amount)
    {
        if (Type != SupplierDebtTransactionType.Debt) throw new InvalidOperationException("Can only add payment to a debt transaction.");
        if (PaidAmount + amount > Amount) throw new InvalidOperationException("Payment exceeds total amount of this debt.");
        PaidAmount += amount;
    }
}
