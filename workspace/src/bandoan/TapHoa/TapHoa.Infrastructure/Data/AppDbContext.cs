using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Entities.Identity;
using TapHoa.Domain.Entities.Warehouse;

namespace TapHoa.Infrastructure.Data;

public class AppDbContext : DbContext, TapHoa.Application.Interfaces.IApplicationDbContext
{
    private readonly TapHoa.Application.Interfaces.ICurrentUserService? _currentUserService;

    public AppDbContext(
        DbContextOptions<AppDbContext> options,
        TapHoa.Application.Interfaces.ICurrentUserService? currentUserService = null) : base(options) 
    { 
        _currentUserService = currentUserService;
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserToken> UserTokens => Set<UserToken>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<ProductUnit> ProductUnits => Set<ProductUnit>();
    public DbSet<CustomerDebt> CustomerDebts => Set<CustomerDebt>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Supplier> Suppliers => Set<Supplier>();
    
    // Warehouse
    public DbSet<InventoryTransaction> InventoryTransactions => Set<InventoryTransaction>();
    public DbSet<InventoryTransactionLine> InventoryTransactionLines => Set<InventoryTransactionLine>();
    public DbSet<StockLevel> StockLevels => Set<StockLevel>();
    public DbSet<WarehouseLocation> WarehouseLocations => Set<WarehouseLocation>();
    public DbSet<ProductBatch> ProductBatches => Set<ProductBatch>();

    public Guid CurrentCompanyId => _currentUserService?.CompanyId ?? Guid.Parse("01950000-0000-7000-8000-000000000000");

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var userName = _currentUserService?.UserName ?? "System";
        var companyId = _currentUserService?.CompanyId ?? Guid.Parse("01950000-0000-7000-8000-000000000000");

        foreach (var entry in ChangeTracker.Entries<TapHoa.Domain.Common.BaseAuditableEntity<Guid>>())
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

        modelBuilder.Entity<Product>()
            .Property(p => p.AdditionalImages)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()
            );

        modelBuilder.Entity<Product>()
            .HasMany(p => p.Units)
            .WithOne(u => u.Product)
            .HasForeignKey(u => u.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CustomerDebt>().HasQueryFilter(x => !x.IsDeleted && x.CompanyId == CurrentCompanyId);

        // WMS StockLevel keys
        modelBuilder.Entity<StockLevel>().HasKey(x => x.Id);
        modelBuilder.Entity<StockLevel>()
            .HasIndex(x => new { x.ProductId, x.LocationId, x.BatchId });

        modelBuilder.Entity<StockLevel>()
            .Property(x => x.RowVersion)
            .IsConcurrencyToken()
            .ValueGeneratedNever();

        var companyId = Guid.Parse("01950000-0000-7000-8000-000000000000");
        var adminRoleId = Guid.Parse("01950000-0000-7000-8000-000000000001");
        var managerRoleId = Guid.Parse("01950000-0000-7000-8000-000000000002");
        var cashierRoleId = Guid.Parse("01950000-0000-7000-8000-000000000003");
        var adminUserId = Guid.Parse("01950000-0000-7000-8000-000000000004");

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

        // Hash "admin123" with BCrypt (Hardcoded to prevent EF Model changes on every run)
        var adminPasswordHash = "$2a$11$8rpnI.9n7caa2N3lLrkVeOyfSDUH1LlRGHt4.64Z6c0uGaFs8q0xy";

        modelBuilder.Entity<User>().HasData(
            new { Id = adminUserId, Username = "admin", PasswordHash = adminPasswordHash, FullName = "System Admin", Email = "admin@taphoa.com", PhoneNumber = (string?)null, CitizenId = (string?)null, Address = (string?)null, IsActive = true, CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), CompanyId = companyId }
        );

        // Seed initial data using anonymous objects since Product has private setters
        modelBuilder.Entity<Category>().HasData(
            new { Id = Guid.Parse("01950000-0000-7000-8000-000000001001"), Name = "Trái cây", Description = "Hoa quả tươi các loại", Icon = "🍎", ParentId = (Guid?)null, CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), IsDeleted = false, CompanyId = companyId },
            new { Id = Guid.Parse("01950000-0000-7000-8000-000000001002"), Name = "Rau củ", Description = "Rau củ sạch nông trại", Icon = "🥬", ParentId = (Guid?)null, CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), IsDeleted = false, CompanyId = companyId },
            new { Id = Guid.Parse("01950000-0000-7000-8000-000000001003"), Name = "Thịt cá", Description = "Thịt tươi sống và hải sản", Icon = "🥩", ParentId = (Guid?)null, CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), IsDeleted = false, CompanyId = companyId }
        );

        modelBuilder.Entity<Product>().HasData(
            new { Id = Guid.Parse("01950000-0000-7000-8000-000000002001"), Name = "Táo New Zealand size to", Category = "Trái cây", Price = 75000m, StockQuantity = 150, Unit = "kg", Status = "Đang bán", MainImageUrl = (string?)null, AdditionalImages = new List<string>(), CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), IsDeleted = false, CompanyId = companyId },
            new { Id = Guid.Parse("01950000-0000-7000-8000-000000002002"), Name = "Rau cải thìa hữu cơ", Category = "Rau củ", Price = 15000m, StockQuantity = 30, Unit = "bó", Status = "Đang bán", MainImageUrl = (string?)null, AdditionalImages = new List<string>(), CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), IsDeleted = false, CompanyId = companyId },
            new { Id = Guid.Parse("01950000-0000-7000-8000-000000002003"), Name = "Thịt bò thăn Úc tươi sạch", Category = "Thịt cá", Price = 350000m, StockQuantity = 5, Unit = "kg", Status = "Sắp hết", MainImageUrl = (string?)null, AdditionalImages = new List<string>(), CreatedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc), IsDeleted = false, CompanyId = companyId }
        );
    }
}
