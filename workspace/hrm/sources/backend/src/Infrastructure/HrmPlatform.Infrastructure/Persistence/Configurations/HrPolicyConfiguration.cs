using HrmPlatform.Domain.Entities.Hrm;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class HrPolicyConfiguration : IEntityTypeConfiguration<HrPolicy>
{
    public void Configure(EntityTypeBuilder<HrPolicy> builder)
    {
        builder.ToTable("hr_policies");

        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasColumnName("id");
        builder.Property(p => p.TenantId).HasColumnName("tenant_id").IsRequired();
        builder.Property(p => p.PolicyCode).HasColumnName("policy_code").HasMaxLength(100).IsRequired();
        builder.Property(p => p.Title).HasColumnName("title").HasMaxLength(255).IsRequired();
        builder.Property(p => p.Category).HasColumnName("category").HasConversion<string>().HasMaxLength(50).IsRequired();
        builder.Property(p => p.EffectiveDate).HasColumnName("effective_date").IsRequired();
        builder.Property(p => p.ExpiryDate).HasColumnName("expiry_date");
        builder.Property(p => p.Summary).HasColumnName("summary").HasMaxLength(500);
        builder.Property(p => p.Content).HasColumnName("content");
        builder.Property(p => p.AttachmentUrl).HasColumnName("attachment_url").HasMaxLength(500);
        builder.Property(p => p.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(20).IsRequired();
        builder.Property(p => p.CreatedAt).HasColumnName("created_at").HasPrecision(6);
        builder.Property(p => p.CreatedBy).HasColumnName("created_by");
        builder.Property(p => p.UpdatedAt).HasColumnName("updated_at").HasPrecision(6);
        builder.Property(p => p.UpdatedBy).HasColumnName("updated_by");

        builder.HasIndex(p => new { p.TenantId, p.PolicyCode }).IsUnique();
        builder.HasIndex(p => new { p.TenantId, p.Category });
        builder.HasIndex(p => new { p.TenantId, p.Status });

        builder.HasOne(p => p.Tenant)
            .WithMany()
            .HasForeignKey(p => p.TenantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
