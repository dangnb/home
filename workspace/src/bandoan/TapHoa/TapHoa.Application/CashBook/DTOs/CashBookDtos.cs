namespace TapHoa.Application.CashBook.DTOs;

public class CashBookEntryDto
{
    public Guid Id { get; set; }
    public DateTime EntryDate { get; set; }
    public int Type { get; set; }          // 1=Income, 2=Expense
    public string Category { get; set; } = "";
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public string? ReferenceId { get; set; }
    public string? ReferenceType { get; set; }
    public Guid? ShiftId { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? CreatedDate { get; set; }
}

public class CashBookSummaryDto
{
    public decimal TotalIncome { get; set; }
    public decimal TotalExpense { get; set; }
    public decimal Balance { get; set; }
    public decimal OpeningBalance { get; set; }
    public decimal ClosingBalance { get; set; }
    public List<CashBookCategoryBreakdown> IncomeBreakdown { get; set; } = new();
    public List<CashBookCategoryBreakdown> ExpenseBreakdown { get; set; } = new();
}

public class CashBookCategoryBreakdown
{
    public string Category { get; set; } = "";
    public decimal Amount { get; set; }
    public int Count { get; set; }
}
