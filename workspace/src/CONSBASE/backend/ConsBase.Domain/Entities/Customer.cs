using System;

using ConsBase.Domain.Common;
using ConsBase.Domain.Enums;

namespace ConsBase.Domain.Entities;

public class Customer : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public CustomerType Type { get; set; } = CustomerType.Individual;
    public string TaxCode { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Representative { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}

public class Opportunity : BaseEntity
{
    public Guid CustomerId { get; set; }
    public Customer? Customer { get; set; }

    public string Title { get; set; } = string.Empty;
    public decimal EstimatedValue { get; set; }
    public OpportunityStage Stage { get; set; } = OpportunityStage.Lead;
    public DateTime? SurveyDate { get; set; }
    public string SurveyNotes { get; set; } = string.Empty;
    public Guid? AssignedUserId { get; set; }
    public User? AssignedUser { get; set; }
}
