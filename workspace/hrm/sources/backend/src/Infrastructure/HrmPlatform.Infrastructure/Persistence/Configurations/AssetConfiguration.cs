using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class AssetConfiguration : IEntityTypeConfiguration<Asset>
{
    public void Configure(EntityTypeBuilder<Asset> builder)
    {
        builder.ToTable("assets");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Id)
            .HasColumnName("id");

        builder.Property(a => a.TenantId)
            .HasColumnName("tenant_id")
            .IsRequired();

        builder.Property(a => a.AssetCode)
            .HasColumnName("asset_code")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(a => a.Name)
            .HasColumnName("name")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(a => a.Category)
            .HasColumnName("category")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(a => a.SerialNumber)
            .HasColumnName("serial_number")
            .HasMaxLength(100);

        builder.Property(a => a.PurchaseDate)
            .HasColumnName("purchase_date");

        builder.Property(a => a.PurchasePrice)
            .HasColumnName("purchase_price")
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(a => a.CurrentValue)
            .HasColumnName("current_value")
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(a => a.AssigneeId)
            .HasColumnName("assignee_id");

        builder.Property(a => a.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(a => a.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(a => a.CreatedBy)
            .HasColumnName("created_by");

        builder.Property(a => a.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(a => a.UpdatedBy)
            .HasColumnName("updated_by");

        // Unique constraint: asset_code per tenant
        builder.HasIndex(a => new { a.TenantId, a.AssetCode })
            .IsUnique();

        // Foreign keys & Relationships
        builder.HasOne(a => a.Tenant)
            .WithMany()
            .HasForeignKey(a => a.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.Assignee)
            .WithMany()
            .HasForeignKey(a => a.AssigneeId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(a => a.Transactions)
            .WithOne(t => t.Asset)
            .HasForeignKey(t => t.AssetId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(a => a.MaintenanceTickets)
            .WithOne(m => m.Asset)
            .HasForeignKey(m => m.AssetId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(a => a.Depreciations)
            .WithOne(d => d.Asset)
            .HasForeignKey(d => d.AssetId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
