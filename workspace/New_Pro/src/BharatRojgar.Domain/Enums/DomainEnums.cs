namespace BharatRojgar.Domain.Enums;

public enum UserRole
{
    Candidate = 1,
    Admin = 2
}

public enum UserStatus
{
    Active = 1,
    Suspended = 2
}

public enum CandidateCategory
{
    General = 1,
    OBC = 2,
    SC = 3,
    ST = 4,
    EWS = 5
}

public enum MilestoneType
{
    RegistrationEnd = 1,
    FeePaymentEnd = 2,
    AdmitCardRelease = 3,
    ExamDate = 4
}

public enum ApplicationStatus
{
    Submitted = 1,
    UnderReview = 2,
    AdmitCardIssued = 3,
    Shortlisted = 4,
    Rejected = 5
}

public enum PaymentStatus
{
    Unpaid = 1,
    Paid = 2,
    Exempted = 3
}

public enum QualifyingStatus
{
    Qualified = 1,
    NotQualified = 2
}

public enum QuestionDifficulty
{
    Easy = 1,
    Medium = 2,
    Hard = 3
}

public enum MockTestType
{
    QuickTest = 1,
    MockTest = 2
}

public enum ExamAttemptStatus
{
    InProgress = 1,
    Completed = 2
}
