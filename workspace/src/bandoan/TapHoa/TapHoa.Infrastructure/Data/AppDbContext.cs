using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Entities.Identity;
using TapHoa.Domain.Entities.Warehouse;

namespace TapHoa.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    
    // Warehouse
    public DbSet<InventoryTransaction> InventoryTransactions => Set<InventoryTransaction>();
    public DbSet<InventoryTransactionLine> InventoryTransactionLines => Set<InventoryTransactionLine>();
    public DbSet<StockLevel> StockLevels => Set<StockLevel>();

    public Guid CurrentCompanyId => this.GetService<TapHoa.Application.Interfaces.ICurrentUserService>()?.CompanyId ?? Guid.Empty;

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var currentUserService = this.GetService<TapHoa.Application.Interfaces.ICurrentUserService>();
        var userName = currentUserService?.UserName ?? "System";
        var companyId = currentUserService?.CompanyId ?? Guid.Empty;

        foreach (var entry in ChangeTracker.Entries<TapHoa.Domain.Common.BaseAuditableEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedBy = userName;
                    entry.Entity.CreatedDate = DateTime.UtcNow;
                    entry.Entity.CompanyId = companyId;
                    break;
                case EntityState.Modified:
                    entry.Entity.ModifiedBy = userName;
                    entry.Entity.ModifiedDate = DateTime.UtcNow;
                    break;
                case EntityState.Deleted:
                    entry.State = EntityState.Modified;
                    entry.Entity.IsDeleted = true;
                    entry.Entity.DeletedBy = userName;
                    entry.Entity.DeletedDate = DateTime.UtcNow;
                    break;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Global query filters for soft delete and multi-tenancy
        modelBuilder.Entity<Product>().HasQueryFilter(x => !x.IsDeleted && x.CompanyId == CurrentCompanyId);
        modelBuilder.Entity<Category>().HasQueryFilter(x => !x.IsDeleted && x.CompanyId == CurrentCompanyId);

        // StockLevel composite key
        modelBuilder.Entity<StockLevel>().HasKey(x => new { x.ProductId, x.StoreId });

        var companyId = Guid.CreateVersion7();
        var adminRoleId = Guid.CreateVersion7();
        var managerRoleId = Guid.CreateVersion7();
        var cashierRoleId = Guid.CreateVersion7();
        var adminUserId = Guid.CreateVersion7();

        // RBAC Relationships Setup
        modelBuilder.Entity<User>()
            .HasMany(u => u.Roles)
            .WithMany(r => r.Users)
            .UsingEntity(j => j.ToTable("UserRoles").HasData(new { UsersId = adminUserId, RolesId = adminRoleId }));

        modelBuilder.Entity<InventoryTransactionLine>()
            .HasOne(l => l.Transaction)
            .WithMany(t => t.Lines)
            .HasForeignKey(l => l.TransactionId);

        modelBuilder.Entity<InventoryTransactionLine>()
            .HasOne(l => l.Product)
            .WithMany()
            .HasForeignKey(l => l.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        // Seed Roles with Bitwise Permissions
        var allPermissions = (long)TapHoa.Domain.Enums.AppPermissions.All;
        var managerPermissions = (long)(TapHoa.Domain.Enums.AppPermissions.ViewProducts | TapHoa.Domain.Enums.AppPermissions.CreateProducts | TapHoa.Domain.Enums.AppPermissions.UpdateProducts | TapHoa.Domain.Enums.AppPermissions.ViewCategories | TapHoa.Domain.Enums.AppPermissions.ViewUsers);
        var cashierPermissions = (long)(TapHoa.Domain.Enums.AppPermissions.ViewProducts | TapHoa.Domain.Enums.AppPermissions.ViewCategories);

        modelBuilder.Entity<Role>().HasData(
            new { Id = adminRoleId, Name = "Admin", Description = "System Administrator", Permissions = allPermissions },
            new { Id = managerRoleId, Name = "Manager", Description = "Store Manager", Permissions = managerPermissions },
            new { Id = cashierRoleId, Name = "Cashier", Description = "Store Cashier", Permissions = cashierPermissions }
        );

        // Hash "admin123" with BCrypt
        var adminPasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123");

        modelBuilder.Entity<User>().HasData(
            new { Id = adminUserId, Username = "admin", PasswordHash = adminPasswordHash, FullName = "System Admin", Email = "admin@taphoa.com", IsActive = true, CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), CompanyId = companyId }
        );

        // Seed initial data using anonymous objects since Product has private setters
        modelBuilder.Entity<Category>().HasData(
            new { Id = Guid.CreateVersion7(), Name = "Trái cây", Description = "Hoa quả tươi các loại", Icon = "🍎", CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), IsDeleted = false, CompanyId = companyId },
            new { Id = Guid.CreateVersion7(), Name = "Rau củ", Description = "Rau củ sạch nông trại", Icon = "🥬", CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), IsDeleted = false, CompanyId = companyId },
            new { Id = Guid.CreateVersion7(), Name = "Thịt cá", Description = "Thịt tươi sống và hải sản", Icon = "🥩", CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), IsDeleted = false, CompanyId = companyId }
        );

        modelBuilder.Entity<Product>().HasData(
            new { Id = Guid.CreateVersion7(), Name = "Táo New Zealand size to", Category = "Trái cây", Price = 75000m, StockQuantity = 150, Unit = "kg", Status = "Đang bán", MainImageUrl = (string?)null, AdditionalImages = new List<string>(), CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), IsDeleted = false, CompanyId = companyId },
            new { Id = Guid.CreateVersion7(), Name = "Rau cải thìa hữu cơ", Category = "Rau củ", Price = 15000m, StockQuantity = 30, Unit = "bó", Status = "Đang bán", MainImageUrl = (string?)null, AdditionalImages = new List<string>(), CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), IsDeleted = false, CompanyId = companyId },
            new { Id = Guid.CreateVersion7(), Name = "Thịt bò thăn Úc tươi sạch", Category = "Thịt cá", Price = 350000m, StockQuantity = 5, Unit = "kg", Status = "Sắp hết", MainImageUrl = (string?)null, AdditionalImages = new List<string>(), CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), IsDeleted = false, CompanyId = companyId }
        );
    }
}
