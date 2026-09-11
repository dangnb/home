using HrmPlatform.Domain.Entities.Hrm;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class EquipmentRepairConfiguration : IEntityTypeConfiguration<EquipmentRepair>
{
    public void Configure(EntityTypeBuilder<EquipmentRepair> builder)
    {
        builder.ToTable("equipment_repairs");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .HasColumnName("id");

        builder.Property(e => e.TenantId)
            .HasColumnName("tenant_id")
            .IsRequired();

        builder.Property(e => e.Code)
            .HasColumnName("code")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.EquipmentId)
            .HasColumnName("equipment_id")
            .IsRequired();

        builder.Property(e => e.ReporterUserId)
            .HasColumnName("reporter_user_id")
            .IsRequired();

        builder.Property(e => e.ReportedDate)
            .HasColumnName("reported_date")
            .IsRequired();

        builder.Property(e => e.IssueDescription)
            .HasColumnName("issue_description")
            .IsRequired();

        builder.Property(e => e.Priority)
            .HasColumnName("priority")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(e => e.TechnicianUserId)
            .HasColumnName("technician_user_id");

        builder.Property(e => e.AssignedDate)
            .HasColumnName("assigned_date");

        builder.Property(e => e.RepairStatus)
            .HasColumnName("status")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.ActualError)
            .HasColumnName("actual_error");

        builder.Property(e => e.SolutionDetail)
            .HasColumnName("solution_detail");

        builder.Property(e => e.ReplacedParts)
            .HasColumnName("replaced_parts");

        builder.Property(e => e.RepairCost)
            .HasColumnName("repair_cost")
            .HasPrecision(18, 2);

        builder.Property(e => e.StartedAt)
            .HasColumnName("started_at");

        builder.Property(e => e.CompletedAt)
            .HasColumnName("completed_at");

        builder.Property(e => e.Note)
            .HasColumnName("note");

        builder.Property(e => e.Status)
            .HasColumnName("status_entity")
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(e => e.CreatedBy)
            .HasColumnName("created_by");

        builder.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(e => e.UpdatedBy)
            .HasColumnName("updated_by");

        builder.HasOne(e => e.Tenant)
            .WithMany()
            .HasForeignKey(e => e.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Equipment)
            .WithMany()
            .HasForeignKey(e => e.EquipmentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.ReporterUser)
            .WithMany()
            .HasForeignKey(e => e.ReporterUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.TechnicianUser)
            .WithMany()
            .HasForeignKey(e => e.TechnicianUserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
