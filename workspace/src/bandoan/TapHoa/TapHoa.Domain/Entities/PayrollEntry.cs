using TapHoa.Domain.Common;

namespace TapHoa.Domain.Entities;

public class PayrollEntry : BaseAuditableEntity<Guid>
{
    public Guid PayrollPeriodId { get; private set; }
    public string Username { get; private set; } = null!;
    public string EmployeeName { get; private set; } = null!;

    // Attendance aggregation
    public int WorkDays { get; private set; }
    public decimal TotalHours { get; private set; }
    public decimal OvertimeHours { get; private set; }

    // Salary components
    public decimal BaseSalary { get; private set; }
    public decimal OvertimePay { get; private set; }
    public decimal Allowance { get; private set; }
    public decimal Bonus { get; private set; }
    public decimal Deduction { get; private set; }
    public decimal NetSalary { get; private set; }

    public string? Notes { get; private set; }

    // Navigation
    public virtual PayrollPeriod PayrollPeriod { get; private set; } = null!;

    private PayrollEntry() { } // EF Core

    public PayrollEntry(Guid payrollPeriodId, string username, string employeeName,
        int workDays, decimal totalHours, decimal overtimeHours,
        decimal baseSalary, decimal overtimePay, decimal allowance)
    {
        Id = Guid.NewGuid();
        PayrollPeriodId = payrollPeriodId;
        Username = username;
        EmployeeName = employeeName;
        WorkDays = workDays;
        TotalHours = totalHours;
        OvertimeHours = overtimeHours;
        BaseSalary = baseSalary;
        OvertimePay = overtimePay;
        Allowance = allowance;
        Bonus = 0;
        Deduction = 0;
        CalculateNetSalary();
    }

    public void UpdateAdjustments(decimal bonus, decimal deduction, decimal allowance, string? notes)
    {
        Bonus = bonus;
        Deduction = deduction;
        Allowance = allowance;
        Notes = notes;
        CalculateNetSalary();
    }

    public void UpdateBaseSalary(decimal baseSalary)
    {
        BaseSalary = baseSalary;
        CalculateNetSalary();
    }

    private void CalculateNetSalary()
    {
        NetSalary = BaseSalary + OvertimePay + Allowance + Bonus - Deduction;
    }
}
