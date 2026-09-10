using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class EquipmentHistoryConfiguration : IEntityTypeConfiguration<EquipmentHistory>
{
    public void Configure(EntityTypeBuilder<EquipmentHistory> builder)
    {
        builder.ToTable("equipment_histories");

        builder.HasKey(h => h.Id);

        builder.Property(h => h.Id)
            .HasColumnName("id");

        builder.Property(h => h.TenantId)
            .HasColumnName("tenant_id")
            .IsRequired();

        builder.Property(h => h.EquipmentId)
            .HasColumnName("equipment_id")
            .IsRequired();

        builder.Property(h => h.UserId)
            .HasColumnName("user_id");

        builder.Property(h => h.DepartmentId)
            .HasColumnName("department_id");

        builder.Property(h => h.TargetType)
            .HasColumnName("target_type")
            .HasMaxLength(50);

        builder.Property(h => h.ActionType)
            .HasColumnName("action_type")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(h => h.ActionDate)
            .HasColumnName("action_date")
            .IsRequired();

        builder.Property(h => h.ConditionStatus)
            .HasColumnName("condition_status")
            .HasMaxLength(255);

        builder.Property(h => h.PerformedBy)
            .HasColumnName("performed_by");

        builder.Property(h => h.Note)
            .HasColumnName("note");

        builder.Property(h => h.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(h => h.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(h => h.CreatedBy)
            .HasColumnName("created_by");

        builder.Property(h => h.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(h => h.UpdatedBy)
            .HasColumnName("updated_by");

        builder.HasOne(h => h.Tenant)
            .WithMany()
            .HasForeignKey(h => h.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(h => h.User)
            .WithMany()
            .HasForeignKey(h => h.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(h => h.Department)
            .WithMany()
            .HasForeignKey(h => h.DepartmentId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(h => h.PerformedByUser)
            .WithMany()
            .HasForeignKey(h => h.PerformedBy)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
