using HrmPlatform.Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
{
    public void Configure(EntityTypeBuilder<UserRole> builder)
    {
        builder.ToTable("user_roles");

        builder.HasKey(ur => ur.Id);
        builder.Property(ur => ur.Id).HasColumnName("id");
        builder.Property(ur => ur.UserId).HasColumnName("user_id").IsRequired();
        builder.Property(ur => ur.RoleId).HasColumnName("role_id").IsRequired();
        builder.Property(ur => ur.TenantId).HasColumnName("tenant_id");
        builder.Property(ur => ur.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(20).IsRequired();
        builder.Property(ur => ur.CreatedAt).HasColumnName("created_at").HasPrecision(6);
        builder.Property(ur => ur.CreatedBy).HasColumnName("created_by");
        builder.Property(ur => ur.UpdatedAt).HasColumnName("updated_at").HasPrecision(6);
        builder.Property(ur => ur.UpdatedBy).HasColumnName("updated_by");

        builder.HasIndex(ur => new { ur.UserId, ur.RoleId, ur.TenantId }).IsUnique();
        builder.HasIndex(ur => new { ur.TenantId, ur.UserId });

        builder.HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ur => ur.Tenant)
            .WithMany()
            .HasForeignKey(ur => ur.TenantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
