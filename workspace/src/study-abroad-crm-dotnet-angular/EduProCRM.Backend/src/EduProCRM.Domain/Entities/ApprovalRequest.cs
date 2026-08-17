namespace EduProCRM.Domain.Entities;

public class ApprovalRequest
{
    public Guid Id { get; private set; }
    public string RequestType { get; private set; } = string.Empty; // "Phiếu thu lớn", "Hoàn cọc bảo đảm"
    public Guid StudentId { get; private set; }
    public string StudentName { get; private set; } = string.Empty;
    public Guid ContractId { get; private set; }
    public decimal Amount { get; private set; }
    public string ProposerName { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; }
    public string StatusLevel1 { get; private set; } = "Kế toán: ĐÃ DUYỆT";
    public string StatusLevel2 { get; private set; } = "Chờ Giám Đốc Phê Duyệt";
    public string Status { get; private set; } = "Chờ duyệt"; // "Chờ duyệt", "Đã duyệt", "Từ chối"

    public ApprovalRequest() { }

    public static ApprovalRequest Create(
        string requestType,
        Guid studentId,
        string studentName,
        Guid contractId,
        decimal amount,
        string proposerName)
    {
        return new ApprovalRequest
        {
            Id = Guid.NewGuid(),
            RequestType = requestType,
            StudentId = studentId,
            StudentName = studentName,
            ContractId = contractId,
            Amount = amount,
            ProposerName = proposerName,
            CreatedAt = DateTime.UtcNow,
            StatusLevel1 = "Kế toán: ĐÃ DUYỆT",
            StatusLevel2 = "Chờ Giám Đốc Phê Duyệt",
            Status = "Chờ duyệt"
        };
    }

    public void ApproveByDirector()
    {
        StatusLevel2 = "Giám Đốc: ĐÃ PHÊ DUYỆT";
        Status = "Đã duyệt";
    }

    public void RejectByDirector(string reason)
    {
        StatusLevel2 = $"Giám Đốc: TỪ CHỐI ({reason})";
        Status = "Từ chối";
    }
}
