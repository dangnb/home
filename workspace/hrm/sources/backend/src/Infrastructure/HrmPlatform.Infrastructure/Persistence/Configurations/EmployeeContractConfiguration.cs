using HrmPlatform.Domain.Entities.Hrm;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HrmPlatform.Infrastructure.Persistence.Configurations;

public class EmployeeContractConfiguration : IEntityTypeConfiguration<EmployeeContract>
{
    public void Configure(EntityTypeBuilder<EmployeeContract> builder)
    {
        builder.ToTable("employee_contracts");

        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasColumnName("id");
        builder.Property(c => c.TenantId).HasColumnName("tenant_id").IsRequired();
        builder.Property(c => c.EmployeeId).HasColumnName("employee_id").IsRequired();
        builder.Property(c => c.ContractNumber).HasColumnName("contract_number").HasMaxLength(100).IsRequired();
        builder.Property(c => c.ContractType).HasColumnName("contract_type").HasConversion<string>().HasMaxLength(50).IsRequired();
        builder.Property(c => c.SignDate).HasColumnName("sign_date").IsRequired();
        builder.Property(c => c.StartDate).HasColumnName("start_date").IsRequired();
        builder.Property(c => c.EndDate).HasColumnName("end_date");
        builder.Property(c => c.BasicSalary).HasColumnName("basic_salary").HasPrecision(15, 2).IsRequired();
        builder.Property(c => c.InsuranceSalary).HasColumnName("insurance_salary").HasPrecision(15, 2).IsRequired();
        builder.Property(c => c.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(20).IsRequired();
        builder.Property(c => c.Note).HasColumnName("note");
        builder.Property(c => c.AttachmentUrl).HasColumnName("attachment_url").HasMaxLength(500);
        builder.Property(c => c.CreatedAt).HasColumnName("created_at").HasPrecision(6);
        builder.Property(c => c.CreatedBy).HasColumnName("created_by");
        builder.Property(c => c.UpdatedAt).HasColumnName("updated_at").HasPrecision(6);
        builder.Property(c => c.UpdatedBy).HasColumnName("updated_by");

        builder.HasIndex(c => new { c.TenantId, c.ContractNumber }).IsUnique();
        builder.HasIndex(c => new { c.TenantId, c.EmployeeId });
        builder.HasIndex(c => new { c.TenantId, c.EndDate, c.Status });

        builder.HasOne(c => c.Tenant)
            .WithMany()
            .HasForeignKey(c => c.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.Employee)
            .WithMany()
            .HasForeignKey(c => c.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
