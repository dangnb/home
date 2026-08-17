using System;
using ConsBase.Domain.Common;
using ConsBase.Domain.Enums;

namespace ConsBase.Domain.Entities;

public class ChangeOrder : BaseEntity
{
    public string ChangeOrderCode { get; set; } = string.Empty;
    public Guid ProjectId { get; set; }
    public Project? Project { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal AdditionalCost { get; set; }
    public int ExtensionDays { get; set; }
    public ChangeOrderStatus Status { get; set; } = ChangeOrderStatus.Draft;
}

public class AcceptanceRecord : BaseEntity
{
    public string RecordCode { get; set; } = string.Empty;
    public Guid ProjectId { get; set; }
    public Project? Project { get; set; }
    public string WorkCategory { get; set; } = string.Empty; // Hạng mục nghiệm thu
    public decimal AcceptedVolume { get; set; }
    public DateTime AcceptanceDate { get; set; } = DateTime.UtcNow;
    public AcceptanceStatus Status { get; set; } = AcceptanceStatus.Draft;
    public string InspectionReport { get; set; } = string.Empty;
}

public class DocumentRecord : BaseEntity
{
    public string DocumentName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string FileExtension { get; set; } = string.Empty;
    public long FileSizeBytes { get; set; }
    public string Category { get; set; } = "Drawing"; // Drawing, Contract, Minutes, Technical
    public Guid? ProjectId { get; set; }
    public int Version { get; set; } = 1;
}

public class QcHseIncident : BaseEntity
{
    public Guid ProjectId { get; set; }
    public Project? Project { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Severity { get; set; } = "Low"; // Low, Medium, High, Critical
    public string Description { get; set; } = string.Empty;
    public string CorrectiveAction { get; set; } = string.Empty;
    public bool IsResolved { get; set; } = false;
    public DateTime ReportedDate { get; set; } = DateTime.UtcNow;
}

public class Subcontractor : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty; // M&E, Thạch cao, Sơn bả, Điện nước...
    public string Phone { get; set; } = string.Empty;
    public string TaxCode { get; set; } = string.Empty;
}

public class AuditLog : BaseEntity
{
    public string Action { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string UserFullName { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
}
