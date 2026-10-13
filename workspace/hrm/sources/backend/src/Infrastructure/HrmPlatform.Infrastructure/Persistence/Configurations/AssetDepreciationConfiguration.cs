using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class AssetDepreciationConfiguration : IEntityTypeConfiguration<AssetDepreciation>
{
    public void Configure(EntityTypeBuilder<AssetDepreciation> builder)
    {
        builder.ToTable("asset_depreciations");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.Id)
            .HasColumnName("id");

        builder.Property(d => d.TenantId)
            .HasColumnName("tenant_id")
            .IsRequired();

        builder.Property(d => d.AssetId)
            .HasColumnName("asset_id")
            .IsRequired();

        builder.Property(d => d.PeriodMonth)
            .HasColumnName("period_month")
            .IsRequired();

        builder.Property(d => d.PeriodYear)
            .HasColumnName("period_year")
            .IsRequired();

        builder.Property(d => d.DepreciatedAmount)
            .HasColumnName("depreciated_amount")
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(d => d.RemainingValue)
            .HasColumnName("remaining_value")
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(d => d.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(d => d.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(d => d.CreatedBy)
            .HasColumnName("created_by");

        builder.Property(d => d.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(d => d.UpdatedBy)
            .HasColumnName("updated_by");

        // Unique index: 1 record per asset per month/year
        builder.HasIndex(d => new { d.TenantId, d.AssetId, d.PeriodYear, d.PeriodMonth })
            .IsUnique();

        // Relationships
        builder.HasOne(d => d.Tenant)
            .WithMany()
            .HasForeignKey(d => d.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(d => d.Asset)
            .WithMany(a => a.Depreciations)
            .HasForeignKey(d => d.AssetId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
