using HrmPlatform.Domain.Entities.Hrm;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class LeaveRequestConfiguration : IEntityTypeConfiguration<LeaveRequest>
{
    public void Configure(EntityTypeBuilder<LeaveRequest> builder)
    {
        builder.ToTable("leave_requests");

        builder.HasKey(lr => lr.Id);
        builder.Property(lr => lr.Id).HasColumnName("id");
        builder.Property(lr => lr.TenantId).HasColumnName("tenant_id").IsRequired();
        builder.Property(lr => lr.UserId).HasColumnName("user_id").IsRequired();
        builder.Property(lr => lr.LeaveType).HasColumnName("leave_type").HasConversion<string>().HasMaxLength(20).IsRequired();
        builder.Property(lr => lr.StartDate).HasColumnName("start_date").IsRequired();
        builder.Property(lr => lr.EndDate).HasColumnName("end_date").IsRequired();
        builder.Property(lr => lr.Reason).HasColumnName("reason").HasColumnType("TEXT");
        builder.Property(lr => lr.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(20).IsRequired();
        builder.Property(lr => lr.ApproverId).HasColumnName("approver_id");
        builder.Property(lr => lr.CreatedAt).HasColumnName("created_at").HasPrecision(6);
        builder.Property(lr => lr.CreatedBy).HasColumnName("created_by");
        builder.Property(lr => lr.UpdatedAt).HasColumnName("updated_at").HasPrecision(6);
        builder.Property(lr => lr.UpdatedBy).HasColumnName("updated_by");

        builder.HasIndex(lr => new { lr.TenantId, lr.Status });
        builder.HasIndex(lr => new { lr.TenantId, lr.UserId });
        builder.HasIndex(lr => lr.ApproverId);

        builder.HasOne(lr => lr.Tenant)
            .WithMany(t => t.LeaveRequests)
            .HasForeignKey(lr => lr.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(lr => lr.User)
            .WithMany(u => u.LeaveRequests)
            .HasForeignKey(lr => lr.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(lr => lr.Approver)
            .WithMany()
            .HasForeignKey(lr => lr.ApproverId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
