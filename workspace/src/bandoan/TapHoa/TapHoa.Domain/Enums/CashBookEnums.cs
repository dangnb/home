namespace TapHoa.Domain.Enums;

/// <summary>
/// Loại bút toán sổ quỹ: Thu hoặc Chi
/// </summary>
public enum CashBookEntryType
{
    Income = 1,   // Thu
    Expense = 2   // Chi
}

/// <summary>
/// Loại chi phí vận hành: Cố định hoặc Phát sinh
/// </summary>
public enum OperatingExpenseType
{
    Fixed = 1,     // Cố định (thuê mặt bằng, internet...)
    Variable = 2   // Phát sinh (sửa chữa, mua dụng cụ...)
}

/// <summary>
/// Trạng thái thanh toán chi phí
/// </summary>
public enum ExpensePaymentStatus
{
    Pending = 1,
    Paid = 2,
    Overdue = 3
}
