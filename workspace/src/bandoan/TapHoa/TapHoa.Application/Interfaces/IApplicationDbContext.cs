using Microsoft.EntityFrameworkCore;
using TapHoa.Domain.Entities;
using TapHoa.Domain.Entities.Identity;
using TapHoa.Domain.Entities.Warehouse;

namespace TapHoa.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Product> Products { get; }
    DbSet<Category> Categories { get; }
    DbSet<User> Users { get; }
    DbSet<Role> Roles { get; }
    DbSet<UserToken> UserTokens { get; }
    DbSet<AuditLog> AuditLogs { get; }
    DbSet<Customer> Customers { get; }
    DbSet<CustomerDebt> CustomerDebts { get; }
    DbSet<CustomerDebtTransaction> CustomerDebtTransactions { get; }
    DbSet<Supplier> Suppliers { get; }
    DbSet<SupplierDebt> SupplierDebts { get; }
    DbSet<SupplierDebtTransaction> SupplierDebtTransactions { get; }
    DbSet<InventoryTransaction> InventoryTransactions { get; }
    DbSet<InventoryTransactionLine> InventoryTransactionLines { get; }
    DbSet<StockLevel> StockLevels { get; }
    DbSet<WarehouseLocation> WarehouseLocations { get; }
    DbSet<ProductBatch> ProductBatches { get; }
    DbSet<StockTake> StockTakes { get; }
    DbSet<StockTakeLine> StockTakeLines { get; }

    Guid CurrentCompanyId { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
