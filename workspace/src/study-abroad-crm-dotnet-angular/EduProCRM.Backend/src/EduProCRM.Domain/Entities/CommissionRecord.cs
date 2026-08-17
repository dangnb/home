namespace EduProCRM.Domain.Entities;

public class CommissionRecord
{
    public Guid Id { get; private set; }
    public string StaffCode { get; private set; } = string.Empty;
    public string StaffName { get; private set; } = string.Empty;
    public string Role { get; private set; } = string.Empty; // "Senior Mentor", "Counselor / Sale Du Học"
    public decimal CollectedRevenue { get; private set; }
    public decimal CommissionRatePercentage { get; private set; }
    public decimal MilestoneBonus { get; private set; }
    public decimal TotalEarnings => (CollectedRevenue * CommissionRatePercentage / 100) + MilestoneBonus;
    public string Status { get; private set; } = "Chờ quyết toán";

    public CommissionRecord() { }

    public static CommissionRecord Create(
        string staffCode,
        string staffName,
        string role,
        decimal collectedRevenue,
        decimal commissionRatePercentage,
        decimal milestoneBonus)
    {
        return new CommissionRecord
        {
            Id = Guid.NewGuid(),
            StaffCode = staffCode,
            StaffName = staffName,
            Role = role,
            CollectedRevenue = collectedRevenue,
            CommissionRatePercentage = commissionRatePercentage,
            MilestoneBonus = milestoneBonus,
            Status = "Chờ quyết toán"
        };
    }
}
