using Microsoft.EntityFrameworkCore;
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
    
    // Warehouse
    public DbSet<InventoryTransaction> InventoryTransactions => Set<InventoryTransaction>();
    public DbSet<InventoryTransactionLine> InventoryTransactionLines => Set<InventoryTransactionLine>();
    public DbSet<StockLevel> StockLevels => Set<StockLevel>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // RBAC Relationships Setup
        modelBuilder.Entity<User>()
            .HasMany(u => u.Roles)
            .WithMany(r => r.Users)
            .UsingEntity(j => j.ToTable("UserRoles").HasData(new { UsersId = 1, RolesId = 1 }));

        modelBuilder.Entity<InventoryTransactionLine>()
            .HasOne(l => l.Transaction)
            .WithMany(t => t.Lines)
            .HasForeignKey(l => l.TransactionId);

        modelBuilder.Entity<InventoryTransactionLine>()
            .HasOne(l => l.Product)
            .WithMany()
            .HasForeignKey(l => l.ProductId)
            .OnDelete(DeleteBehavior.Restrict); // Don't allow deleting a product if it has transaction history

        // Seed Roles with Bitwise Permissions
        var allPermissions = (long)TapHoa.Domain.Enums.AppPermissions.All;
        var managerPermissions = (long)(TapHoa.Domain.Enums.AppPermissions.ViewProducts | TapHoa.Domain.Enums.AppPermissions.CreateProducts | TapHoa.Domain.Enums.AppPermissions.UpdateProducts | TapHoa.Domain.Enums.AppPermissions.ViewCategories | TapHoa.Domain.Enums.AppPermissions.ViewUsers);
        var cashierPermissions = (long)(TapHoa.Domain.Enums.AppPermissions.ViewProducts | TapHoa.Domain.Enums.AppPermissions.ViewCategories);

        modelBuilder.Entity<Role>().HasData(
            new { Id = 1, Name = "Admin", Description = "System Administrator", Permissions = allPermissions },
            new { Id = 2, Name = "Manager", Description = "Store Manager", Permissions = managerPermissions },
            new { Id = 3, Name = "Cashier", Description = "Store Cashier", Permissions = cashierPermissions }
        );

        // Hash "admin123" with BCrypt
        var adminPasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123");

        modelBuilder.Entity<User>().HasData(
            new { Id = 1, Username = "admin", PasswordHash = adminPasswordHash, FullName = "System Admin", Email = "admin@taphoa.com", IsActive = true, CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );

        // Seed a Dummy Category and Product for testing Inbound transaction
        modelBuilder.Entity<Category>().HasData(
            new { Id = 1, Name = "Nước Giải Khát", Description = "Đồ uống các loại", CreatedAt = DateTime.UtcNow }
        );

        modelBuilder.Entity<Product>().HasData(
            new { Id = 1, Name = "Cocacola 330ml", Barcode = "893456789", Price = 10000m, CategoryId = 1, CreatedAt = DateTime.UtcNow }
        );

        // Seed initial data using anonymous objects since Product has private setters
        modelBuilder.Entity<Category>().HasData(
            new { Id = 1, Name = "Trái cây", Description = "Hoa quả tươi các loại", Icon = "🍎" },
            new { Id = 2, Name = "Rau củ", Description = "Rau củ sạch nông trại", Icon = "🥬" },
            new { Id = 3, Name = "Thịt cá", Description = "Thịt tươi sống và hải sản", Icon = "🥩" }
        );

        modelBuilder.Entity<Product>().HasData(
            new { Id = 1, Name = "Táo New Zealand size to", Category = "Trái cây", Price = 75000m, StockQuantity = 150, Unit = "kg", Status = "Đang bán", ImageIcon = "🍏", ImageColor = "#ffd7d7" },
            new { Id = 2, Name = "Rau cải thìa hữu cơ", Category = "Rau củ", Price = 15000m, StockQuantity = 30, Unit = "bó", Status = "Đang bán", ImageIcon = "🥬", ImageColor = "#d7ffd9" },
            new { Id = 3, Name = "Thịt bò thăn Úc tươi sạch", Category = "Thịt cá", Price = 350000m, StockQuantity = 5, Unit = "kg", Status = "Sắp hết", ImageIcon = "🥩", ImageColor = "#ffe3d7" }
        );
    }
}
