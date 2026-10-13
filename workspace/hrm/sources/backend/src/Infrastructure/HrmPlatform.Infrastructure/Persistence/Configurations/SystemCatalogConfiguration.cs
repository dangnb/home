using HrmPlatform.Domain.Entities.Config;
using HrmPlatform.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class SystemCatalogConfiguration : IEntityTypeConfiguration<SystemCatalog>
{
    public void Configure(EntityTypeBuilder<SystemCatalog> builder)
    {
        builder.ToTable("system_catalogs");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id)
            .HasColumnName("id");

        builder.Property(c => c.TenantId)
            .HasColumnName("tenant_id")
            .IsRequired();

        builder.Property(c => c.CatalogType)
            .HasColumnName("catalog_type")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(c => c.Code)
            .HasColumnName("code")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(c => c.Name)
            .HasColumnName("name")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(c => c.Description)
            .HasColumnName("description");

        builder.Property(c => c.SortOrder)
            .HasColumnName("sort_order")
            .HasDefaultValue(0);

        builder.Property(c => c.IsSystemDefault)
            .HasColumnName("is_system_default")
            .HasDefaultValue(false);

        builder.Property(c => c.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(c => c.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(c => c.CreatedBy)
            .HasColumnName("created_by");

        builder.Property(c => c.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(c => c.UpdatedBy)
            .HasColumnName("updated_by");

        builder.HasIndex(c => new { c.TenantId, c.CatalogType, c.Code })
            .IsUnique()
            .HasDatabaseName("uk_system_catalogs_tenant_type_code");

        builder.HasIndex(c => new { c.TenantId, c.CatalogType, c.Status })
            .HasDatabaseName("idx_system_catalogs_tenant_type_status");
    }
}
