using Microsoft.EntityFrameworkCore;
using SalesManagement.Application.Interfaces;
using SalesManagement.Domain.Entities;

namespace SalesManagement.Infrastructure.Data;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    
    // WMS Module
    public DbSet<Warehouse> Warehouses => Set<Warehouse>();
    public DbSet<StockBalance> StockBalances => Set<StockBalance>();
    public DbSet<InventoryTransaction> InventoryTransactions => Set<InventoryTransaction>();
    public DbSet<TransactionDetail> TransactionDetails => Set<TransactionDetail>();
    public DbSet<StockLedger> StockLedgers => Set<StockLedger>();

    // Sales & Purchasing Module
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<SalesOrder> SalesOrders => Set<SalesOrder>();
    public DbSet<SalesOrderDetail> SalesOrderDetails => Set<SalesOrderDetail>();
    public DbSet<PurchaseOrder> PurchaseOrders => Set<PurchaseOrder>();
    public DbSet<PurchaseOrderDetail> PurchaseOrderDetails => Set<PurchaseOrderDetail>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Cấu hình entity mapping (Fluent API)
        modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany()
            .HasForeignKey(u => u.RoleId);

        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany()
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        // Lập Unique constraint cho Tồn Kho của Kho-Sản Phẩm
        modelBuilder.Entity<StockBalance>()
            .HasIndex(sb => new { sb.WarehouseId, sb.ProductId })
            .IsUnique();

        // Xóa cascading: Xóa Transaction -> Xóa TransactionDetails
        modelBuilder.Entity<InventoryTransaction>()
            .HasMany(t => t.Details)
            .WithOne(d => d.Transaction)
            .HasForeignKey(d => d.TransactionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SalesOrder>()
            .HasMany(o => o.Details)
            .WithOne(d => d.SalesOrder)
            .HasForeignKey(d => d.SalesOrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<PurchaseOrder>()
            .HasMany(o => o.Details)
            .WithOne(d => d.PurchaseOrder)
            .HasForeignKey(d => d.PurchaseOrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // Seeding Data
        var adminRoleId = Guid.NewGuid();
        modelBuilder.Entity<Role>().HasData(new 
        {
            Id = adminRoleId,
            Name = "Admin"
        });

        modelBuilder.Entity<User>().HasData(new 
        {
            Id = Guid.NewGuid(),
            Username = "admin",
            PasswordHash = "password", // In a real app, hash this appropriately!
            RoleId = adminRoleId
        });
    }
}
