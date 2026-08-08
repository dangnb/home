using Microsoft.EntityFrameworkCore;
using ConsBase.Domain.Entities;

namespace ConsBase.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Opportunity> Opportunities => Set<Opportunity>();
    public DbSet<Quotation> Quotations => Set<Quotation>();
    public DbSet<QuotationItem> QuotationItems => Set<QuotationItem>();
    public DbSet<Contract> Contracts => Set<Contract>();
    public DbSet<ContractPaymentTerm> ContractPaymentTerms => Set<ContractPaymentTerm>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectMember> ProjectMembers => Set<ProjectMember>();
    public DbSet<ProjectTask> ProjectTasks => Set<ProjectTask>();
    public DbSet<DailyLog> DailyLogs => Set<DailyLog>();
    public DbSet<DailyLogWorker> DailyLogWorkers => Set<DailyLogWorker>();
    public DbSet<DailyLogMaterial> DailyLogMaterials => Set<DailyLogMaterial>();
    public DbSet<DailyLogEquipment> DailyLogEquipments => Set<DailyLogEquipment>();
    public DbSet<DailyLogPhoto> DailyLogPhotos => Set<DailyLogPhoto>();
    public DbSet<PaymentRequest> PaymentRequests => Set<PaymentRequest>();
    public DbSet<DebtRecord> DebtRecords => Set<DebtRecord>();
    public DbSet<MaterialRequisition> MaterialRequisitions => Set<MaterialRequisition>();
    public DbSet<MaterialRequisitionItem> MaterialRequisitionItems => Set<MaterialRequisitionItem>();
    public DbSet<Warehouse> Warehouses => Set<Warehouse>();
    public DbSet<InventoryStock> InventoryStocks => Set<InventoryStock>();
    public DbSet<ChangeOrder> ChangeOrders => Set<ChangeOrder>();
    public DbSet<AcceptanceRecord> AcceptanceRecords => Set<AcceptanceRecord>();
    public DbSet<DocumentRecord> DocumentRecords => Set<DocumentRecord>();
    public DbSet<QcHseIncident> QcHseIncidents => Set<QcHseIncident>();
    public DbSet<Subcontractor> Subcontractors => Set<Subcontractor>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<Customer>().HasIndex(c => c.Code).IsUnique();
        modelBuilder.Entity<Quotation>().HasIndex(q => q.QuotationCode).IsUnique();
        modelBuilder.Entity<Contract>().HasIndex(c => c.ContractNumber).IsUnique();
        modelBuilder.Entity<Project>().HasIndex(p => p.ProjectCode).IsUnique();

        // Enforce 1 Contract -> 1 Project relationship
        modelBuilder.Entity<Contract>()
            .HasOne(c => c.Quotation)
            .WithMany()
            .HasForeignKey(c => c.QuotationId);
    }
}
