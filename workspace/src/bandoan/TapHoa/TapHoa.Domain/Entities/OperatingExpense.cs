using TapHoa.Domain.Common;
using TapHoa.Domain.Enums;

namespace TapHoa.Domain.Entities;

/// <summary>
/// Chi phí vận hành cửa hàng: thuê mặt bằng, điện, nước, internet, sửa chữa...
/// Theo dõi theo tháng/năm, trạng thái thanh toán.
/// </summary>
public class OperatingExpense : BaseAuditableEntity<Guid>
{
    public string Name { get; private set; }
    public OperatingExpenseType Type { get; private set; }
    public decimal Amount { get; private set; }
    public int Month { get; private set; }
    public int Year { get; private set; }
    public DateTime? DueDate { get; private set; }
    public DateTime? PaidDate { get; private set; }
    public ExpensePaymentStatus PaymentStatus { get; private set; }
    public string? Notes { get; private set; }

    private OperatingExpense() { } // EF Core

    public OperatingExpense(
        string name,
        OperatingExpenseType type,
        decimal amount,
        int month,
        int year,
        DateTime? dueDate = null,
        string? notes = null)
    {
        Name = name;
        Type = type;
        Amount = amount;
        Month = month;
        Year = year;
        DueDate = dueDate;
        Notes = notes;
        PaymentStatus = ExpensePaymentStatus.Pending;
    }

    public static OperatingExpense Create(
        string name,
        OperatingExpenseType type,
        decimal amount,
        int month,
        int year,
        DateTime? dueDate = null,
        string? notes = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Tên chi phí không được để trống.", nameof(name));
        if (amount <= 0)
            throw new ArgumentException("Số tiền phải lớn hơn 0.", nameof(amount));
        if (month < 1 || month > 12)
            throw new ArgumentException("Tháng phải từ 1-12.", nameof(month));

        return new OperatingExpense(name, type, amount, month, year, dueDate, notes);
    }

    public void Update(
        string name,
        OperatingExpenseType type,
        decimal amount,
        int month,
        int year,
        DateTime? dueDate = null,
        string? notes = null)
    {
        Name = name;
        Type = type;
        Amount = amount;
        Month = month;
        Year = year;
        DueDate = dueDate;
        Notes = notes;
    }

    public void MarkAsPaid(DateTime paidDate)
    {
        PaidDate = paidDate;
        PaymentStatus = ExpensePaymentStatus.Paid;
    }

    public void MarkAsOverdue()
    {
        if (PaymentStatus != ExpensePaymentStatus.Paid)
            PaymentStatus = ExpensePaymentStatus.Overdue;
    }
}
