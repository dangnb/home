using HrmPlatform.Domain.Entities.Hrm;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class AttendanceConfiguration : IEntityTypeConfiguration<Attendance>
{
    public void Configure(EntityTypeBuilder<Attendance> builder)
    {
        builder.ToTable("attendances");

        builder.HasKey(a => a.Id);
        builder.Property(a => a.Id).HasColumnName("id");
        builder.Property(a => a.TenantId).HasColumnName("tenant_id").IsRequired();
        builder.Property(a => a.UserId).HasColumnName("user_id").IsRequired();
        builder.Property(a => a.WorkDate).HasColumnName("work_date").IsRequired();
        builder.Property(a => a.CheckIn).HasColumnName("check_in").HasPrecision(6);
        builder.Property(a => a.CheckOut).HasColumnName("check_out").HasPrecision(6);
        builder.Property(a => a.LateMinutes).HasColumnName("late_minutes").IsRequired();
        builder.Property(a => a.EarlyMinutes).HasColumnName("early_minutes").IsRequired();
        builder.Property(a => a.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(20).IsRequired();
        builder.Property(a => a.CreatedAt).HasColumnName("created_at").HasPrecision(6);
        builder.Property(a => a.CreatedBy).HasColumnName("created_by");
        builder.Property(a => a.UpdatedAt).HasColumnName("updated_at").HasPrecision(6);
        builder.Property(a => a.UpdatedBy).HasColumnName("updated_by");

        builder.HasIndex(a => new { a.TenantId, a.UserId, a.WorkDate }).IsUnique();
        builder.HasIndex(a => new { a.TenantId, a.WorkDate });
        builder.HasIndex(a => new { a.UserId, a.WorkDate });

        builder.HasOne(a => a.Tenant)
            .WithMany(t => t.Attendances)
            .HasForeignKey(a => a.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.User)
            .WithMany(u => u.Attendances)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
