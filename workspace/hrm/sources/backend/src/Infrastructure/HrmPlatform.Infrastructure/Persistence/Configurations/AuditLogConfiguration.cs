using HrmPlatform.Domain.Entities.Audit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("audit_logs");

        builder.HasKey(al => al.Id);
        builder.Property(al => al.Id).HasColumnName("id");
        builder.Property(al => al.TenantId).HasColumnName("tenant_id");
        builder.Property(al => al.UserId).HasColumnName("user_id");
        builder.Property(al => al.Action).HasColumnName("action").HasMaxLength(50).IsRequired();
        builder.Property(al => al.EntityName).HasColumnName("entity_name").HasMaxLength(100).IsRequired();
        builder.Property(al => al.EntityId).HasColumnName("entity_id").HasMaxLength(100).IsRequired();
        builder.Property(al => al.OldData).HasColumnName("old_data").HasColumnType("LONGTEXT");
        builder.Property(al => al.NewData).HasColumnName("new_data").HasColumnType("LONGTEXT");
        builder.Property(al => al.IpAddress).HasColumnName("ip_address").HasMaxLength(50);
        builder.Property(al => al.Status).HasColumnName("status").HasMaxLength(20).IsRequired();
        builder.Property(al => al.CreatedAt).HasColumnName("created_at").HasPrecision(6);

        builder.HasIndex(al => new { al.TenantId, al.EntityName, al.EntityId });
        builder.HasIndex(al => new { al.UserId, al.CreatedAt });

        builder.HasOne(al => al.Tenant)
            .WithMany()
            .HasForeignKey(al => al.TenantId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(al => al.User)
            .WithMany()
            .HasForeignKey(al => al.UserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
