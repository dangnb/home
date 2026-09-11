using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class EquipmentConfiguration : IEntityTypeConfiguration<Equipment>
{
    public void Configure(EntityTypeBuilder<Equipment> builder)
    {
        builder.ToTable("equipments");

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

        builder.Property(e => e.Name)
            .HasColumnName("name")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(e => e.Category)
            .HasColumnName("category")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.SerialNumber)
            .HasColumnName("serial_number")
            .HasMaxLength(100);

        builder.Property(e => e.Specifications)
            .HasColumnName("specifications");

        builder.Property(e => e.PurchaseDate)
            .HasColumnName("purchase_date");

        builder.Property(e => e.WarrantyEndDate)
            .HasColumnName("warranty_end_date");

        builder.Property(e => e.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.CurrentUserId)
            .HasColumnName("current_user_id");

        builder.Property(e => e.CurrentDepartmentId)
            .HasColumnName("current_department_id");

        builder.Property(e => e.AssignedDate)
            .HasColumnName("assigned_date");

        builder.Property(e => e.Note)
            .HasColumnName("note");

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

        builder.HasOne(e => e.CurrentUser)
            .WithMany()
            .HasForeignKey(e => e.CurrentUserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(e => e.CurrentDepartment)
            .WithMany()
            .HasForeignKey(e => e.CurrentDepartmentId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(e => e.Histories)
            .WithOne(h => h.Equipment)
            .HasForeignKey(h => h.EquipmentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
