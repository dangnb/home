using EduProCRM.Domain.Enums;

namespace EduProCRM.Domain.Entities;

public class LegalJournal
{
    public Guid Id { get; private set; }
    public Guid StudentId { get; private set; }
    public Guid ContractId { get; private set; }
    public ContractClause ContractClause { get; private set; }
    public DateTime ActionDateTime { get; private set; }
    public string Summary { get; private set; } = string.Empty;
    public string DetailedContent { get; private set; } = string.Empty;
    public string? PortalUrl { get; private set; }
    public Guid MentorId { get; private set; }
    public bool IsLocked { get; private set; }
    public DateTime LockedAt { get; private set; }
    public string SignatureHash { get; private set; } = string.Empty;

    public LegalJournal() { }

    public static LegalJournal Create(
        Guid studentId,
        Guid contractId,
        ContractClause clause,
        DateTime actionDateTime,
        string summary,
        string content,
        string? portalUrl,
        Guid mentorId)
    {
        var journal = new LegalJournal
        {
            Id = Guid.NewGuid(),
            StudentId = studentId,
            ContractId = contractId,
            ContractClause = clause,
            ActionDateTime = actionDateTime,
            Summary = summary,
            DetailedContent = content,
            PortalUrl = portalUrl,
            MentorId = mentorId,
            IsLocked = true,
            LockedAt = DateTime.UtcNow,
            SignatureHash = Guid.NewGuid().ToString("N") // Simulation of cryptographic proof signature
        };

        return journal;
    }
}
