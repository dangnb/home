namespace ConsBase.Domain.Enums;

public enum UserRole
{
    Admin,
    Director,
    ProjectManager,
    SiteEngineer,
    Accountant,
    PurchasingOfficer,
    Customer
}

public enum CustomerType
{
    Individual,
    Enterprise
}

public enum OpportunityStage
{
    Lead,
    Surveying,
    QuotationSent,
    Negotiating,
    ContractSigned,
    Lost
}

public enum QuotationStatus
{
    Draft,
    Submitted,
    Approved,
    Rejected,
    ConvertedToContract
}

public enum ContractStatus
{
    Draft,
    PendingSign,
    Active,
    Completed,
    Terminated
}

public enum ProjectStatus
{
    Planning,
    InExecution,
    Suspended,
    HandoverPending,
    Completed,
    Warranty
}

public enum TaskStatusEnum
{
    Todo,
    InProgress,
    InReview,
    Completed,
    Delayed
}

public enum TaskPriority
{
    Low,
    Medium,
    High,
    Urgent
}

public enum DailyLogStatus
{
    Draft,
    Submitted,
    Approved,
    Locked
}

public enum PaymentRequestStatus
{
    Draft,
    Submitted,
    Approved,
    Paid,
    Rejected
}

public enum MaterialRequisitionStatus
{
    Draft,
    PendingApproval,
    Approved,
    Procuring,
    Fulfilled,
    Rejected
}

public enum ChangeOrderStatus
{
    Draft,
    Submitted,
    Approved,
    Rejected
}

public enum AcceptanceStatus
{
    Draft,
    PendingApproval,
    Accepted,
    NeedsCorrection
}
