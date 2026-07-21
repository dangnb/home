namespace TapHoa.Application.OperatingExpenses.DTOs;

public class OperatingExpenseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public int Type { get; set; }           // 1=Fixed, 2=Variable
    public decimal Amount { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? PaidDate { get; set; }
    public int PaymentStatus { get; set; }  // 1=Pending, 2=Paid, 3=Overdue
    public string? Notes { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? CreatedDate { get; set; }
}

public class ExpenseSummaryDto
{
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal TotalFixed { get; set; }
    public decimal TotalVariable { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal TotalPaid { get; set; }
    public decimal TotalUnpaid { get; set; }
    public List<ExpenseCategorySummary> Categories { get; set; } = new();
}

public class ExpenseCategorySummary
{
    public string Name { get; set; } = "";
    public decimal Amount { get; set; }
    public int PaymentStatus { get; set; }
}
