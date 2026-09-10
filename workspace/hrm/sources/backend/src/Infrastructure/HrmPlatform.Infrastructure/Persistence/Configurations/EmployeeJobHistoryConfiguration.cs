using HrmPlatform.Domain.Entities.Hrm;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class EmployeeJobHistoryConfiguration : IEntityTypeConfiguration<EmployeeJobHistory>
{
    public void Configure(EntityTypeBuilder<EmployeeJobHistory> builder)
    {
        builder.ToTable("employee_job_history");

        builder.HasKey(j => j.Id);
        builder.Property(j => j.Id).HasColumnName("id");
        builder.Property(j => j.TenantId).HasColumnName("tenant_id").IsRequired();
        builder.Property(j => j.EmployeeId).HasColumnName("employee_id").IsRequired();
        builder.Property(j => j.DecisionNumber).HasColumnName("decision_number").HasMaxLength(100);
        builder.Property(j => j.ChangeType).HasColumnName("change_type").HasConversion<string>().HasMaxLength(50).IsRequired();
        builder.Property(j => j.OldDepartmentId).HasColumnName("old_department_id");
        builder.Property(j => j.NewDepartmentId).HasColumnName("new_department_id");
        builder.Property(j => j.OldJobTitle).HasColumnName("old_job_title").HasMaxLength(150);
        builder.Property(j => j.NewJobTitle).HasColumnName("new_job_title").HasMaxLength(150);
        builder.Property(j => j.OldManagerId).HasColumnName("old_manager_id");
        builder.Property(j => j.NewManagerId).HasColumnName("new_manager_id");
        builder.Property(j => j.EffectiveDate).HasColumnName("effective_date").IsRequired();
        builder.Property(j => j.Note).HasColumnName("note");
        builder.Property(j => j.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(20).IsRequired();
        builder.Property(j => j.ApprovalStatus).HasColumnName("approval_status").HasConversion<string>().HasMaxLength(30).IsRequired();
        builder.Property(j => j.ApproverId).HasColumnName("approver_id");
        builder.Property(j => j.ApprovedAt).HasColumnName("approved_at").HasPrecision(6);
        builder.Property(j => j.RejectionReason).HasColumnName("rejection_reason").HasMaxLength(500);

        builder.Property(j => j.CurrentStep).HasColumnName("current_step").HasDefaultValue(1);
        builder.Property(j => j.CurrentManagerStatus).HasColumnName("current_manager_status").HasMaxLength(30);
        builder.Property(j => j.CurrentManagerNote).HasColumnName("current_manager_note");
        builder.Property(j => j.CurrentManagerApprovedAt).HasColumnName("current_manager_approved_at").HasPrecision(6);
        builder.Property(j => j.NewManagerStatus).HasColumnName("new_manager_status").HasMaxLength(30);
        builder.Property(j => j.NewManagerNote).HasColumnName("new_manager_note");
        builder.Property(j => j.NewManagerApprovedAt).HasColumnName("new_manager_approved_at").HasPrecision(6);
        builder.Property(j => j.HrStatus).HasColumnName("hr_status").HasMaxLength(30);
        builder.Property(j => j.HrNote).HasColumnName("hr_note");
        builder.Property(j => j.HrApprovedAt).HasColumnName("hr_approved_at").HasPrecision(6);
        builder.Property(j => j.DirectorStatus).HasColumnName("director_status").HasMaxLength(30);
        builder.Property(j => j.DirectorNote).HasColumnName("director_note");
        builder.Property(j => j.DirectorApprovedAt).HasColumnName("director_approved_at").HasPrecision(6);
        builder.Property(j => j.EmployeeAckStatus).HasColumnName("employee_ack_status").HasMaxLength(30);
        builder.Property(j => j.EmployeeAckNote).HasColumnName("employee_ack_note");
        builder.Property(j => j.EmployeeAcknowledgedAt).HasColumnName("employee_acknowledged_at").HasPrecision(6);

        builder.Property(j => j.CreatedAt).HasColumnName("created_at").HasPrecision(6);
        builder.Property(j => j.CreatedBy).HasColumnName("created_by");
        builder.Property(j => j.UpdatedAt).HasColumnName("updated_at").HasPrecision(6);
        builder.Property(j => j.UpdatedBy).HasColumnName("updated_by");

        builder.HasIndex(j => new { j.TenantId, j.EmployeeId });
        builder.HasIndex(j => new { j.TenantId, j.ApprovalStatus });

        builder.HasOne(j => j.Tenant)
            .WithMany()
            .HasForeignKey(j => j.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(j => j.Employee)
            .WithMany()
            .HasForeignKey(j => j.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(j => j.Approver)
            .WithMany()
            .HasForeignKey(j => j.ApproverId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
