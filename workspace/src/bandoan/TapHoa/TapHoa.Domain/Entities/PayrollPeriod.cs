using TapHoa.Domain.Common;
using TapHoa.Domain.Enums;

namespace TapHoa.Domain.Entities;

public class PayrollPeriod : BaseAuditableEntity<Guid>
{
    public int Month { get; private set; }
    public int Year { get; private set; }
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public PayrollPeriodStatus Status { get; private set; }
    public string? Notes { get; private set; }

    public virtual ICollection<PayrollEntry> Entries { get; private set; } = new List<PayrollEntry>();

    private PayrollPeriod() { } // EF Core

    public PayrollPeriod(int month, int year, string? notes = null)
    {
        Id = Guid.NewGuid();
        Month = month;
        Year = year;
        StartDate = new DateTime(year, month, 1);
        EndDate = StartDate.AddMonths(1).AddDays(-1);
        Status = PayrollPeriodStatus.Draft;
        Notes = notes;
    }

    public void MarkCalculated()
    {
        if (Status != PayrollPeriodStatus.Draft)
            throw new InvalidOperationException("Only Draft periods can be calculated.");
        Status = PayrollPeriodStatus.Calculated;
    }

    public void Approve()
    {
        if (Status != PayrollPeriodStatus.Calculated)
            throw new InvalidOperationException("Only Calculated periods can be approved.");
        Status = PayrollPeriodStatus.Approved;
    }

    public void MarkPaid()
    {
        if (Status != PayrollPeriodStatus.Approved)
            throw new InvalidOperationException("Only Approved periods can be marked as paid.");
        Status = PayrollPeriodStatus.Paid;
    }

    /// <summary>
    /// Reset to Draft so it can be recalculated.
    /// </summary>
    public void ResetToDraft()
    {
        Status = PayrollPeriodStatus.Draft;
    }
}
