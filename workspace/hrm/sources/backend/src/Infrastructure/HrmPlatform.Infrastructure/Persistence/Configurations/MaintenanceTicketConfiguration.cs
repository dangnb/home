using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class MaintenanceTicketConfiguration : IEntityTypeConfiguration<MaintenanceTicket>
{
    public void Configure(EntityTypeBuilder<MaintenanceTicket> builder)
    {
        builder.ToTable("maintenance_tickets");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.Id)
            .HasColumnName("id");

        builder.Property(m => m.TenantId)
            .HasColumnName("tenant_id")
            .IsRequired();

        builder.Property(m => m.AssetId)
            .HasColumnName("asset_id")
            .IsRequired();

        builder.Property(m => m.ReportedBy)
            .HasColumnName("reported_by")
            .IsRequired();

        builder.Property(m => m.TechnicianId)
            .HasColumnName("technician_id");

        builder.Property(m => m.IssueDescription)
            .HasColumnName("issue_description")
            .IsRequired();

        builder.Property(m => m.ResolutionNotes)
            .HasColumnName("resolution_notes");

        builder.Property(m => m.RepairCost)
            .HasColumnName("repair_cost")
            .HasPrecision(18, 2)
            .IsRequired();

        builder.Property(m => m.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(m => m.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(m => m.CreatedBy)
            .HasColumnName("created_by");

        builder.Property(m => m.UpdatedAt)
            .HasColumnName("updated_at");

        builder.Property(m => m.UpdatedBy)
            .HasColumnName("updated_by");

        // Relationships
        builder.HasOne(m => m.Tenant)
            .WithMany()
            .HasForeignKey(m => m.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(m => m.Asset)
            .WithMany(a => a.MaintenanceTickets)
            .HasForeignKey(m => m.AssetId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(m => m.Reporter)
            .WithMany()
            .HasForeignKey(m => m.ReportedBy)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(m => m.Technician)
            .WithMany()
            .HasForeignKey(m => m.TechnicianId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
