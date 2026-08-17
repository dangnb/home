using System;
using System.Collections.Generic;
using ConsBase.Domain.Common;
using ConsBase.Domain.Enums;

namespace ConsBase.Domain.Entities;

public class DailyLog : BaseEntity
{
    public Guid ProjectId { get; set; }
    public Project? Project { get; set; }
    public DateTime LogDate { get; set; }
    public string Weather { get; set; } = "Nắng ráo";
    public string Shift { get; set; } = "Ca ngày";
    public string GeneralNotes { get; set; } = string.Empty;
    public string IncidentReport { get; set; } = string.Empty;
    public DailyLogStatus Status { get; set; } = DailyLogStatus.Draft;
    
    public Guid CreatedById { get; set; }
    public User? CreatedByUser { get; set; }
    public Guid? ApprovedById { get; set; }
    public User? ApprovedByUser { get; set; }

    public List<DailyLogWorker> Workers { get; set; } = new();
    public List<DailyLogMaterial> Materials { get; set; } = new();
    public List<DailyLogEquipment> Equipments { get; set; } = new();
    public List<DailyLogPhoto> Photos { get; set; } = new();
}

public class DailyLogWorker : BaseEntity
{
    public Guid DailyLogId { get; set; }
    public string TeamName { get; set; } = string.Empty; // Tổ đội thi công
    public int WorkerCount { get; set; }
    public string WorkDescription { get; set; } = string.Empty;
    public decimal HoursWorked { get; set; } = 8;
}

public class DailyLogMaterial : BaseEntity
{
    public Guid DailyLogId { get; set; }
    public string MaterialName { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string Supplier { get; set; } = string.Empty;
}

public class DailyLogEquipment : BaseEntity
{
    public Guid DailyLogId { get; set; }
    public string EquipmentName { get; set; } = string.Empty;
    public decimal OperatingHours { get; set; }
    public string OperatorName { get; set; } = string.Empty;
}

public class DailyLogPhoto : BaseEntity
{
    public Guid DailyLogId { get; set; }
    public string PhotoUrl { get; set; } = string.Empty;
    public string Caption { get; set; } = string.Empty;
}
