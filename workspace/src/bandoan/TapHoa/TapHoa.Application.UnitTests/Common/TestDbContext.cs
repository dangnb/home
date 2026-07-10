using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Entities.Identity;
using TapHoa.Domain.Entities.Warehouse;

namespace TapHoa.Application.UnitTests.Common;

public class TestDbContext : DbContext, IApplicationDbContext
{
    public TestDbContext(DbContextOptions<TestDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserToken> UserTokens => Set<UserToken>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<CustomerDebt> CustomerDebts => Set<CustomerDebt>();
    public DbSet<CustomerDebtTransaction> CustomerDebtTransactions => Set<CustomerDebtTransaction>();
    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<SupplierDebt> SupplierDebts => Set<SupplierDebt>();
    public DbSet<SupplierDebtTransaction> SupplierDebtTransactions => Set<SupplierDebtTransaction>();
    public DbSet<InventoryTransaction> InventoryTransactions => Set<InventoryTransaction>();
    public DbSet<InventoryTransactionLine> InventoryTransactionLines => Set<InventoryTransactionLine>();
    public DbSet<StockLevel> StockLevels => Set<StockLevel>();
    public DbSet<WarehouseLocation> WarehouseLocations => Set<WarehouseLocation>();
    public DbSet<ProductBatch> ProductBatches => Set<ProductBatch>();
    public DbSet<StockTake> StockTakes => Set<StockTake>();
    public DbSet<StockTakeLine> StockTakeLines => Set<StockTakeLine>();

    public Guid CurrentCompanyId { get; set; } = Guid.Parse("01950000-0000-7000-8000-000000000000");

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return base.SaveChangesAsync(cancellationToken);
    }
}
