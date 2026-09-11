using HrmPlatform.Domain.Entities.Hrm;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class RewardDisciplineConfiguration : IEntityTypeConfiguration<RewardDiscipline>
{
    public void Configure(EntityTypeBuilder<RewardDiscipline> builder)
    {
        builder.ToTable("reward_disciplines");

        builder.HasKey(r => r.Id);
        builder.Property(r => r.Id).HasColumnName("id");
        builder.Property(r => r.TenantId).HasColumnName("tenant_id").IsRequired();
        builder.Property(r => r.EmployeeId).HasColumnName("employee_id").IsRequired();
        builder.Property(r => r.Type).HasColumnName("type").HasConversion<string>().HasMaxLength(20).IsRequired();
        builder.Property(r => r.Category).HasColumnName("category").HasConversion<string>().HasMaxLength(50).IsRequired();
        builder.Property(r => r.Title).HasColumnName("title").HasMaxLength(255).IsRequired();
        builder.Property(r => r.DecisionNumber).HasColumnName("decision_number").HasMaxLength(100);
        builder.Property(r => r.DecisionDate).HasColumnName("decision_date").IsRequired();
        builder.Property(r => r.EffectiveDate).HasColumnName("effective_date").IsRequired();
        builder.Property(r => r.Amount).HasColumnName("amount").HasPrecision(15, 2).IsRequired();
        builder.Property(r => r.Reason).HasColumnName("reason");
        builder.Property(r => r.AttachmentUrl).HasColumnName("attachment_url").HasMaxLength(500);
        builder.Property(r => r.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(20).IsRequired();
        builder.Property(r => r.ApproverId).HasColumnName("approver_id");
        builder.Property(r => r.ApprovedAt).HasColumnName("approved_at").HasPrecision(6);
        builder.Property(r => r.RejectionReason).HasColumnName("rejection_reason").HasMaxLength(500);
        builder.Property(r => r.CreatedAt).HasColumnName("created_at").HasPrecision(6);
        builder.Property(r => r.CreatedBy).HasColumnName("created_by");
        builder.Property(r => r.UpdatedAt).HasColumnName("updated_at").HasPrecision(6);
        builder.Property(r => r.UpdatedBy).HasColumnName("updated_by");

        builder.HasIndex(r => new { r.TenantId, r.Status });
        builder.HasIndex(r => new { r.TenantId, r.EmployeeId });
        builder.HasIndex(r => new { r.TenantId, r.Type });
        builder.HasIndex(r => new { r.TenantId, r.DecisionNumber }).IsUnique();

        builder.HasOne(r => r.Tenant)
            .WithMany()
            .HasForeignKey(r => r.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Employee)
            .WithMany()
            .HasForeignKey(r => r.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.Approver)
            .WithMany()
            .HasForeignKey(r => r.ApproverId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
