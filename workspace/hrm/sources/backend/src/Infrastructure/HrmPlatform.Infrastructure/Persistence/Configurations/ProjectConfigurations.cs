using HrmPlatform.Domain.Entities.Hrm;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ToTable("projects");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id).HasColumnName("id");
        builder.Property(p => p.TenantId).HasColumnName("tenant_id").IsRequired();

        builder.Property(p => p.Code)
            .HasColumnName("code").HasMaxLength(30).IsRequired();
        builder.HasIndex(p => new { p.TenantId, p.Code }).IsUnique();

        builder.Property(p => p.Name)
            .HasColumnName("name").HasMaxLength(255).IsRequired();

        builder.Property(p => p.CustomerName)
            .HasColumnName("customer_name").HasMaxLength(255).IsRequired();

        builder.Property(p => p.CustomerContactName)
            .HasColumnName("customer_contact_name").HasMaxLength(100);

        builder.Property(p => p.CustomerPhone)
            .HasColumnName("customer_phone").HasMaxLength(20);

        builder.Property(p => p.CustomerEmail)
            .HasColumnName("customer_email").HasMaxLength(100);

        builder.Property(p => p.SalesUserId).HasColumnName("sales_user_id").IsRequired();
        builder.Property(p => p.SalesDepartmentId).HasColumnName("sales_department_id").IsRequired();
        builder.Property(p => p.TechLeadUserId).HasColumnName("tech_lead_user_id");
        builder.Property(p => p.TechDepartmentId).HasColumnName("tech_department_id");

        builder.Property(p => p.ProjectType)
            .HasColumnName("project_type").HasConversion<string>().HasMaxLength(30).IsRequired();

        builder.Property(p => p.SalesStatus)
            .HasColumnName("sales_status").HasConversion<string>().HasMaxLength(30).IsRequired();

        builder.Property(p => p.TechStatus)
            .HasColumnName("tech_status").HasConversion<string>().HasMaxLength(30).IsRequired();

        builder.Property(p => p.Priority)
            .HasColumnName("priority").HasConversion<string>().HasMaxLength(20).IsRequired();

        builder.Property(p => p.Status)
            .HasColumnName("status").HasConversion<string>().HasMaxLength(20).IsRequired();

        builder.Property(p => p.QuotedValue).HasColumnName("quoted_value").HasPrecision(18, 2);
        builder.Property(p => p.ContractValue).HasColumnName("contract_value").HasPrecision(18, 2);
        builder.Property(p => p.ContractSignedDate).HasColumnName("contract_signed_date");
        builder.Property(p => p.ContractFileRef).HasColumnName("contract_file_ref").HasMaxLength(500);
        builder.Property(p => p.WarrantyMonths).HasColumnName("warranty_months").HasDefaultValue(0);
        builder.Property(p => p.WarrantyEndDate).HasColumnName("warranty_end_date");

        builder.Property(p => p.PlannedStartDate).HasColumnName("planned_start_date");
        builder.Property(p => p.PlannedEndDate).HasColumnName("planned_end_date");
        builder.Property(p => p.ActualStartDate).HasColumnName("actual_start_date");
        builder.Property(p => p.ActualEndDate).HasColumnName("actual_end_date");

        builder.Property(p => p.OverallProgressPercent)
            .HasColumnName("overall_progress_percent").HasDefaultValue(0);

        builder.Property(p => p.Description).HasColumnName("description");
        builder.Property(p => p.InternalNote).HasColumnName("internal_note");
        builder.Property(p => p.CancelledReason).HasColumnName("cancelled_reason").HasMaxLength(500);

        builder.Property(p => p.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(p => p.CreatedBy).HasColumnName("created_by");
        builder.Property(p => p.UpdatedAt).HasColumnName("updated_at");
        builder.Property(p => p.UpdatedBy).HasColumnName("updated_by");

        builder.HasOne(p => p.Tenant)
            .WithMany().HasForeignKey(p => p.TenantId).OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.SalesUser)
            .WithMany().HasForeignKey(p => p.SalesUserId).OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.Milestones)
            .WithOne(m => m.Project).HasForeignKey(m => m.ProjectId).OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Tasks)
            .WithOne(t => t.Project).HasForeignKey(t => t.ProjectId).OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Members)
            .WithOne(m => m.Project).HasForeignKey(m => m.ProjectId).OnDelete(DeleteBehavior.Cascade);
    }
}

public class ProjectMilestoneConfiguration : IEntityTypeConfiguration<ProjectMilestone>
{
    public void Configure(EntityTypeBuilder<ProjectMilestone> builder)
    {
        builder.ToTable("project_milestones");

        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id).HasColumnName("id");
        builder.Property(m => m.ProjectId).HasColumnName("project_id").IsRequired();

        builder.Property(m => m.Title).HasColumnName("title").HasMaxLength(200).IsRequired();
        builder.Property(m => m.Description).HasColumnName("description");
        builder.Property(m => m.SortOrder).HasColumnName("sort_order").HasDefaultValue(0);
        builder.Property(m => m.DueDate).HasColumnName("due_date");

        builder.Property(m => m.MilestoneStatus)
            .HasColumnName("milestone_status").HasConversion<string>().HasMaxLength(20).IsRequired();

        builder.Property(m => m.Status)
            .HasColumnName("status").HasConversion<string>().HasMaxLength(20).IsRequired();

        builder.Property(m => m.PaymentPercent).HasColumnName("payment_percent").HasPrecision(5, 2);
        builder.Property(m => m.PaymentAmount).HasColumnName("payment_amount").HasPrecision(18, 2);
        builder.Property(m => m.IsPaymentReceived).HasColumnName("is_payment_received").HasDefaultValue(false);
        builder.Property(m => m.CompletedDate).HasColumnName("completed_date");

        builder.Property(m => m.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(m => m.CreatedBy).HasColumnName("created_by");
        builder.Property(m => m.UpdatedAt).HasColumnName("updated_at");
        builder.Property(m => m.UpdatedBy).HasColumnName("updated_by");

        builder.HasOne(m => m.Project)
            .WithMany(p => p.Milestones).HasForeignKey(m => m.ProjectId).OnDelete(DeleteBehavior.Cascade);
    }
}

public class ProjectTaskConfiguration : IEntityTypeConfiguration<ProjectTask>
{
    public void Configure(EntityTypeBuilder<ProjectTask> builder)
    {
        builder.ToTable("project_tasks");

        builder.HasKey(t => t.Id);
        builder.Property(t => t.Id).HasColumnName("id");
        builder.Property(t => t.ProjectId).HasColumnName("project_id").IsRequired();
        builder.Property(t => t.MilestoneId).HasColumnName("milestone_id");

        builder.Property(t => t.Title).HasColumnName("title").HasMaxLength(255).IsRequired();
        builder.Property(t => t.Description).HasColumnName("description");
        builder.Property(t => t.AssigneeUserId).HasColumnName("assignee_user_id");
        builder.Property(t => t.AssignedByUserId).HasColumnName("assigned_by_user_id");

        builder.Property(t => t.TaskType)
            .HasColumnName("task_type").HasConversion<string>().HasMaxLength(30).IsRequired();

        builder.Property(t => t.Priority)
            .HasColumnName("priority").HasConversion<string>().HasMaxLength(20).IsRequired();

        builder.Property(t => t.TaskStatus)
            .HasColumnName("task_status").HasConversion<string>().HasMaxLength(20).IsRequired();

        builder.Property(t => t.Status)
            .HasColumnName("status").HasConversion<string>().HasMaxLength(20).IsRequired();

        builder.Property(t => t.EstimatedHours).HasColumnName("estimated_hours").HasPrecision(8, 2);
        builder.Property(t => t.ActualHours).HasColumnName("actual_hours").HasPrecision(8, 2);
        builder.Property(t => t.ProgressPercent).HasColumnName("progress_percent").HasDefaultValue(0);
        builder.Property(t => t.StartDate).HasColumnName("start_date");
        builder.Property(t => t.DueDate).HasColumnName("due_date");
        builder.Property(t => t.CompletedDate).HasColumnName("completed_date");
        builder.Property(t => t.BlockedReason).HasColumnName("blocked_reason").HasMaxLength(500);
        builder.Property(t => t.Tags).HasColumnName("tags").HasMaxLength(255);

        builder.Property(t => t.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(t => t.CreatedBy).HasColumnName("created_by");
        builder.Property(t => t.UpdatedAt).HasColumnName("updated_at");
        builder.Property(t => t.UpdatedBy).HasColumnName("updated_by");

        builder.HasOne(t => t.Project)
            .WithMany(p => p.Tasks).HasForeignKey(t => t.ProjectId).OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(t => t.Milestone)
            .WithMany().HasForeignKey(t => t.MilestoneId).OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(t => t.Assignee)
            .WithMany().HasForeignKey(t => t.AssigneeUserId).OnDelete(DeleteBehavior.SetNull);
    }
}

public class ProjectMemberConfiguration : IEntityTypeConfiguration<ProjectMember>
{
    public void Configure(EntityTypeBuilder<ProjectMember> builder)
    {
        builder.ToTable("project_members");

        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id).HasColumnName("id");
        builder.Property(m => m.ProjectId).HasColumnName("project_id").IsRequired();
        builder.Property(m => m.UserId).HasColumnName("user_id").IsRequired();

        builder.Property(m => m.Role).HasColumnName("role").HasMaxLength(50).IsRequired();
        builder.Property(m => m.JoinedDate).HasColumnName("joined_date").IsRequired();
        builder.Property(m => m.LeftDate).HasColumnName("left_date");
        builder.Property(m => m.Note).HasColumnName("note").HasMaxLength(500);

        builder.Property(m => m.Status)
            .HasColumnName("status").HasConversion<string>().HasMaxLength(20).IsRequired();

        builder.Property(m => m.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(m => m.CreatedBy).HasColumnName("created_by");
        builder.Property(m => m.UpdatedAt).HasColumnName("updated_at");
        builder.Property(m => m.UpdatedBy).HasColumnName("updated_by");

        builder.HasOne(m => m.Project)
            .WithMany(p => p.Members).HasForeignKey(m => m.ProjectId).OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(m => m.User)
            .WithMany().HasForeignKey(m => m.UserId).OnDelete(DeleteBehavior.Restrict);
    }
}
