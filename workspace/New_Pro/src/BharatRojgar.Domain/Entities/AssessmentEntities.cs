using BharatRojgar.Domain.Common;
using BharatRojgar.Domain.Enums;

namespace BharatRojgar.Domain.Entities;

public class Question : BaseEntity
{
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string OptionA { get; set; } = string.Empty;
    public string OptionB { get; set; } = string.Empty;
    public string OptionC { get; set; } = string.Empty;
    public string OptionD { get; set; } = string.Empty;
    public string CorrectOption { get; set; } = string.Empty; // Single CHAR(1): 'A', 'B', 'C', 'D'
    public string? Explanation { get; set; }
    public QuestionDifficulty Difficulty { get; set; } = QuestionDifficulty.Medium;
}

public class MockTest : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public int TotalQuestions { get; set; }
    public decimal TotalScore { get; set; }
    public MockTestType Type { get; set; } = MockTestType.MockTest;

    // Navigation
    public ICollection<CandidateExamAttempt> Attempts { get; set; } = new List<CandidateExamAttempt>();
}

public class CandidateExamAttempt : BaseEntity
{
    public long CandidateProfileId { get; set; }
    public long MockTestId { get; set; }
    public DateTime StartTime { get; set; } = DateTime.UtcNow;
    public DateTime? EndTime { get; set; }
    public decimal Score { get; set; }
    public int CorrectAnswersCount { get; set; }
    public int WrongAnswersCount { get; set; }
    public ExamAttemptStatus Status { get; set; } = ExamAttemptStatus.InProgress;

    // Navigation
    public CandidateProfile CandidateProfile { get; set; } = null!;
    public MockTest MockTest { get; set; } = null!;
}
