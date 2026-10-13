using BharatRojgar.Domain.Common;
using BharatRojgar.Domain.Enums;

namespace BharatRojgar.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public UserRole Role { get; set; } = UserRole.Candidate;
    public UserStatus Status { get; set; } = UserStatus.Active;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation
    public CandidateProfile? CandidateProfile { get; set; }
}

public class CandidateProfile : BaseEntity
{
    public long UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? State { get; set; }
    public CandidateCategory Category { get; set; } = CandidateCategory.General;
    public int ProfileCompletionRate { get; set; } = 0;

    // Navigation
    public User User { get; set; } = null!;
    public ICollection<CandidateEducation> Educations { get; set; } = new List<CandidateEducation>();
    public ICollection<CandidateSkill> CandidateSkills { get; set; } = new List<CandidateSkill>();
    public ICollection<CandidateSavedJob> SavedJobs { get; set; } = new List<CandidateSavedJob>();
    public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    public ICollection<AdmitCard> AdmitCards { get; set; } = new List<AdmitCard>();
    public ICollection<ExamResult> ExamResults { get; set; } = new List<ExamResult>();
    public ICollection<CandidateExamAttempt> ExamAttempts { get; set; } = new List<CandidateExamAttempt>();
}

public class CandidateEducation : BaseEntity
{
    public long CandidateProfileId { get; set; }
    public string Degree { get; set; } = string.Empty;
    public string Institution { get; set; } = string.Empty;
    public int StartYear { get; set; }
    public int EndYear { get; set; }
    public decimal Percentage { get; set; }

    // Navigation
    public CandidateProfile CandidateProfile { get; set; } = null!;
}

public class Skill : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    // Navigation
    public ICollection<CandidateSkill> CandidateSkills { get; set; } = new List<CandidateSkill>();
}

public class CandidateSkill
{
    public long CandidateProfileId { get; set; }
    public CandidateProfile CandidateProfile { get; set; } = null!;

    public long SkillId { get; set; }
    public Skill Skill { get; set; } = null!;
}
