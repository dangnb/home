using HrmPlatform.Domain.Entities.Hrm;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class EquipmentPartConfiguration : IEntityTypeConfiguration<EquipmentPart>
{
    public void Configure(EntityTypeBuilder<EquipmentPart> builder)
    {
        builder.ToTable("equipment_parts");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id)
            .HasColumnName("id");

        builder.Property(p => p.TenantId)
            .HasColumnName("tenant_id")
            .IsRequired();

        builder.Property(p => p.Code)
            .HasColumnName("code")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(p => p.Name)
            .HasColumnName("name")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(p => p.Category)
            .HasColumnName("category")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(p => p.Unit)
            .HasColumnName("unit")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(p => p.StockQuantity)
            .HasColumnName("stock_quantity")
            .IsRequired();

        builder.Property(p => p.MinStockQuantity)
            .HasColumnName("min_stock_quantity")
            .IsRequired();

        builder.Property(p => p.UnitPrice)
            .HasColumnName("unit_price")
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(p => p.Specifications)
            .HasColumnName("specifications");

        builder.Property(p => p.PartStatus)
            .HasColumnName("status")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(p => p.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(p => p.CreatedBy)
            .HasColumnName("created_by");

        builder.Property(p => p.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(p => p.UpdatedBy)
            .HasColumnName("updated_by");

        builder.HasIndex(p => new { p.TenantId, p.Code }).IsUnique();
        builder.HasIndex(p => new { p.TenantId, p.Category });
        builder.HasIndex(p => new { p.TenantId, p.PartStatus });

        builder.HasOne(p => p.Tenant)
            .WithMany()
            .HasForeignKey(p => p.TenantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
