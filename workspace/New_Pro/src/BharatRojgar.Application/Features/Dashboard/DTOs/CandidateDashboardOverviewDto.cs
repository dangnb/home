namespace BharatRojgar.Application.Features.Dashboard.DTOs;

public class CandidateDashboardOverviewDto
{
    public CandidateProfileDto Profile { get; set; } = new();
    public List<EducationItemDto> Educations { get; set; } = new();
    public List<string> Skills { get; set; } = new();
    public DashboardStatsDto Stats { get; set; } = new();
    public List<UpcomingExamDto> UpcomingExams { get; set; } = new();
    public List<RecentJobDto> RecentJobs { get; set; } = new();
    public List<NotificationItemDto> RecentNotifications { get; set; } = new();
}

public class CandidateProfileDto
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}".Trim();
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? AvatarUrl { get; set; }
    public string? State { get; set; }
    public string? Gender { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? DateOfBirth { get; set; }
    public int ProfileCompletionRate { get; set; }
}

public class EducationItemDto
{
    public long Id { get; set; }
    public string Degree { get; set; } = string.Empty;
    public string Institution { get; set; } = string.Empty;
    public int StartYear { get; set; }
    public int EndYear { get; set; }
    public decimal Percentage { get; set; }
}

public class DashboardStatsDto
{
    public int TotalApplications { get; set; }
    public int UnderReviewCount { get; set; }
    public int ShortlistedCount { get; set; }
    public int AdmitCardsCount { get; set; }
    public int SavedJobsCount { get; set; }
    public int MockTestsAttempted { get; set; }
}

public class UpcomingExamDto
{
    public long Id { get; set; }
    public string ExamName { get; set; } = string.Empty;
    public string ConductingBody { get; set; } = string.Empty;
    public DateTime ExamDate { get; set; }
    public int RemainingDays { get; set; }
    public string RollNumber { get; set; } = string.Empty;
    public string CenterName { get; set; } = string.Empty;
    public string ExamShift { get; set; } = string.Empty;
    public string? PdfFileUrl { get; set; }
}

public class RecentJobDto
{
    public long Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public int Vacancies { get; set; }
    public decimal ApplicationFee { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsNew { get; set; }
    public bool HasApplied { get; set; }
}

public class NotificationItemDto
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "info"; // warning, success, info, danger
    public DateTime Timestamp { get; set; }
    public string TimeAgo { get; set; } = string.Empty;
}
