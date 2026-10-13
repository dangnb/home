using BharatRojgar.Domain.Common;
using BharatRojgar.Domain.Enums;

namespace BharatRojgar.Domain.Entities;

public class JobPost : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public int Vacancies { get; set; }
    public decimal ApplicationFee { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public JobRequirement? Requirement { get; set; }
    public ICollection<JobMilestone> Milestones { get; set; } = new List<JobMilestone>();
    public ICollection<CandidateSavedJob> SavedByCandidates { get; set; } = new List<CandidateSavedJob>();
    public ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    public ICollection<ExamSchedule> ExamSchedules { get; set; } = new List<ExamSchedule>();
}

public class JobRequirement : BaseEntity
{
    public long JobPostId { get; set; }
    public string MinimumDegree { get; set; } = string.Empty;
    public int MinAge { get; set; }
    public int MaxAge { get; set; }
    public string? EligibleState { get; set; }
    public CandidateCategory? EligibleCategory { get; set; }

    // Navigation
    public JobPost JobPost { get; set; } = null!;
}

public class JobMilestone : BaseEntity
{
    public long JobPostId { get; set; }
    public MilestoneType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime DeadlineDate { get; set; }
    public bool AlertDispatched { get; set; } = false;

    // Navigation
    public JobPost JobPost { get; set; } = null!;
}

public class CandidateSavedJob
{
    public long CandidateProfileId { get; set; }
    public CandidateProfile CandidateProfile { get; set; } = null!;

    public long JobPostId { get; set; }
    public JobPost JobPost { get; set; } = null!;

    public DateTime SavedAt { get; set; } = DateTime.UtcNow;
}
