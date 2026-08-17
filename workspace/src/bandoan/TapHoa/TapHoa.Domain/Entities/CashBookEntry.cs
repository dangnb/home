using TapHoa.Domain.Common;
using TapHoa.Domain.Enums;

namespace TapHoa.Domain.Entities;

/// <summary>
/// Sổ quỹ tiền mặt — ghi nhận mọi khoản Thu/Chi trong ngày.
/// Liên kết với ca làm việc (Shift) và có thể tham chiếu đến đơn hàng, phiếu nợ, v.v.
/// </summary>
public class CashBookEntry : BaseAuditableEntity<Guid>
{
    public DateTime EntryDate { get; private set; }
    public CashBookEntryType Type { get; private set; }
    public string Category { get; private set; }       // "Bán hàng", "Thu nợ KH", "Trả NCC", "Tiền điện"...
    public decimal Amount { get; private set; }
    public string Description { get; private set; }
    public string? ReferenceId { get; private set; }    // ID đơn hàng, phiếu nợ, etc.
    public string? ReferenceType { get; private set; }  // "Order", "CustomerDebt", "SupplierDebt", "OperatingExpense"
    public Guid? ShiftId { get; private set; }          // Ca làm việc hiện tại

    private CashBookEntry() { } // EF Core

    public CashBookEntry(
        DateTime entryDate,
        CashBookEntryType type,
        string category,
        decimal amount,
        string description,
        string? referenceId = null,
        string? referenceType = null,
        Guid? shiftId = null)
    {
        EntryDate = entryDate;
        Type = type;
        Category = category;
        Amount = amount;
        Description = description;
        ReferenceId = referenceId;
        ReferenceType = referenceType;
        ShiftId = shiftId;
    }

    public static CashBookEntry Create(
        DateTime entryDate,
        CashBookEntryType type,
        string category,
        decimal amount,
        string description,
        string? referenceId = null,
        string? referenceType = null,
        Guid? shiftId = null)
    {
        if (string.IsNullOrWhiteSpace(category))
            throw new ArgumentException("Danh mục không được để trống.", nameof(category));
        if (amount <= 0)
            throw new ArgumentException("Số tiền phải lớn hơn 0.", nameof(amount));

        return new CashBookEntry(entryDate, type, category, amount, description, referenceId, referenceType, shiftId);
    }

    public void Update(
        DateTime entryDate,
        CashBookEntryType type,
        string category,
        decimal amount,
        string description,
        string? referenceId = null,
        string? referenceType = null,
        Guid? shiftId = null)
    {
        EntryDate = entryDate;
        Type = type;
        Category = category;
        Amount = amount;
        Description = description;
        ReferenceId = referenceId;
        ReferenceType = referenceType;
        ShiftId = shiftId;
    }
}
