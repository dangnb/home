using System;
using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities;

public enum CustomerDebtTransactionType
{
    Debt = 0,
    Payment = 1
}

public class CustomerDebtTransaction : BaseAuditableEntity<Guid>
{
    public Guid CustomerId { get; private set; }
    public CustomerDebtTransactionType Type { get; private set; }
    public decimal Amount { get; private set; }
    public decimal PaidAmount { get; private set; }
    public string? Note { get; private set; }
    public Guid? RelatedDebtId { get; private set; }
    public DateTime? DueDate { get; private set; }

    public virtual Customer? Customer { get; private set; }

    private CustomerDebtTransaction() { }

    public static CustomerDebtTransaction CreateDebt(Guid customerId, decimal amount, string? note, DateTime? dueDate = null)
    {
        return new CustomerDebtTransaction
        {
            Id = Guid.NewGuid(),
            CustomerId = customerId,
            Type = CustomerDebtTransactionType.Debt,
            Amount = amount,
            PaidAmount = 0,
            Note = note,
            DueDate = dueDate
        };
    }

    public static CustomerDebtTransaction CreatePayment(Guid customerId, decimal amount, string? note, Guid? relatedDebtId = null)
    {
        return new CustomerDebtTransaction
        {
            Id = Guid.NewGuid(),
            CustomerId = customerId,
            Type = CustomerDebtTransactionType.Payment,
            Amount = amount,
            PaidAmount = 0, // Not applicable for payment
            Note = note,
            RelatedDebtId = relatedDebtId
        };
    }

    public void AddPayment(decimal amount)
    {
        if (Type != CustomerDebtTransactionType.Debt) throw new InvalidOperationException("Can only add payment to a debt transaction.");
        if (PaidAmount + amount > Amount) throw new InvalidOperationException("Payment exceeds total amount of this debt.");
        PaidAmount += amount;
    }
}
