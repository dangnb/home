using System;
using System.Collections.Generic;
using ConsBase.Domain.Common;
using ConsBase.Domain.Enums;

namespace ConsBase.Domain.Entities;

public class Project : BaseEntity
{
    public string ProjectCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public Guid ContractId { get; set; }
    public Contract? Contract { get; set; }
    public Guid CustomerId { get; set; }
    public Customer? Customer { get; set; }

    public decimal Budget { get; set; }
    public decimal ActualCost { get; set; }
    public decimal ProgressPercentage { get; set; }
    public ProjectStatus Status { get; set; } = ProjectStatus.Planning;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime? ActualEndDate { get; set; }

    public Guid? ProjectManagerId { get; set; }
    public User? ProjectManager { get; set; }

    public List<ProjectMember> Members { get; set; } = new();
    public List<ProjectTask> Tasks { get; set; } = new();
}

public class ProjectMember : BaseEntity
{
    public Guid ProjectId { get; set; }
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public string ProjectRole { get; set; } = "Member";
}

public class ProjectTask : BaseEntity
{
    public Guid ProjectId { get; set; }
    public string TaskCode { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal PlannedVolume { get; set; }
    public decimal ActualVolume { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal ProgressPercentage { get; set; }
    public TaskStatusEnum Status { get; set; } = TaskStatusEnum.Todo;
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;

    public Guid? AssignedUserId { get; set; }
    public User? AssignedUser { get; set; }
    public Guid? PredecessorTaskId { get; set; }
}
