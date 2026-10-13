using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class AssetTransactionConfiguration : IEntityTypeConfiguration<AssetTransaction>
{
    public void Configure(EntityTypeBuilder<AssetTransaction> builder)
    {
        builder.ToTable("asset_transactions");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id)
            .HasColumnName("id");

        builder.Property(t => t.TenantId)
            .HasColumnName("tenant_id")
            .IsRequired();

        builder.Property(t => t.AssetId)
            .HasColumnName("asset_id")
            .IsRequired();

        builder.Property(t => t.ActionType)
            .HasColumnName("action_type")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(t => t.FromUserId)
            .HasColumnName("from_user_id");

        builder.Property(t => t.ToUserId)
            .HasColumnName("to_user_id");

        builder.Property(t => t.TransactionDate)
            .HasColumnName("transaction_date")
            .IsRequired();

        builder.Property(t => t.ConditionNotes)
            .HasColumnName("condition_notes");

        builder.Property(t => t.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(t => t.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(t => t.CreatedBy)
            .HasColumnName("created_by");

        builder.Property(t => t.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(t => t.UpdatedBy)
            .HasColumnName("updated_by");

        // Relationships
        builder.HasOne(t => t.Tenant)
            .WithMany()
            .HasForeignKey(t => t.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(t => t.Asset)
            .WithMany(a => a.Transactions)
            .HasForeignKey(t => t.AssetId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(t => t.FromUser)
            .WithMany()
            .HasForeignKey(t => t.FromUserId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(t => t.ToUser)
            .WithMany()
            .HasForeignKey(t => t.ToUserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
