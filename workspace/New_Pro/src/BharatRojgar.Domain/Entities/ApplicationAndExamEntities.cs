using BharatRojgar.Domain.Common;
using BharatRojgar.Domain.Enums;

namespace BharatRojgar.Domain.Entities;

public class JobApplication : BaseEntity
{
    public long CandidateProfileId { get; set; }
    public long JobPostId { get; set; }
    public string ApplicationNumber { get; set; } = string.Empty;
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Submitted;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Unpaid;
    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public CandidateProfile CandidateProfile { get; set; } = null!;
    public JobPost JobPost { get; set; } = null!;
}

public class ExamSchedule : BaseEntity
{
    public long? JobPostId { get; set; }
    public string ExamName { get; set; } = string.Empty;
    public string ConductingBody { get; set; } = string.Empty;
    public DateTime ExamDate { get; set; }
    public DateTime? AdmitCardReleaseDate { get; set; }
    public DateTime? ResultReleaseDate { get; set; }

    // Navigation
    public JobPost? JobPost { get; set; }
    public ICollection<AdmitCard> AdmitCards { get; set; } = new List<AdmitCard>();
    public ICollection<ExamResult> ExamResults { get; set; } = new List<ExamResult>();
}

public class AdmitCard : BaseEntity
{
    public long ExamScheduleId { get; set; }
    public long CandidateProfileId { get; set; }
    public string RollNumber { get; set; } = string.Empty;
    public string CenterName { get; set; } = string.Empty;
    public string ExamShift { get; set; } = string.Empty;
    public string? PdfFileUrl { get; set; }

    // Navigation
    public ExamSchedule ExamSchedule { get; set; } = null!;
    public CandidateProfile CandidateProfile { get; set; } = null!;
}

public class ExamResult : BaseEntity
{
    public long ExamScheduleId { get; set; }
    public long CandidateProfileId { get; set; }
    public string RollNumber { get; set; } = string.Empty;
    public decimal ScoreObtained { get; set; }
    public decimal TotalMarks { get; set; }
    public int? Rank { get; set; }
    public QualifyingStatus QualifyingStatus { get; set; } = QualifyingStatus.NotQualified;
    public string? ScorecardUrl { get; set; }

    // Navigation
    public ExamSchedule ExamSchedule { get; set; } = null!;
    public CandidateProfile CandidateProfile { get; set; } = null!;
}
