namespace SalesManagement.Application.Interfaces;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using SalesManagement.Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Role> Roles { get; }
    DbSet<Category> Categories { get; }
    DbSet<Product> Products { get; }
    
    DbSet<Warehouse> Warehouses { get; }
    DbSet<StockBalance> StockBalances { get; }
    DbSet<InventoryTransaction> InventoryTransactions { get; }
    DbSet<TransactionDetail> TransactionDetails { get; }
    DbSet<StockLedger> StockLedgers { get; }

    DbSet<Customer> Customers { get; }
    DbSet<Supplier> Suppliers { get; }
    DbSet<SalesOrder> SalesOrders { get; }
    DbSet<SalesOrderDetail> SalesOrderDetails { get; }
    DbSet<PurchaseOrder> PurchaseOrders { get; }
    DbSet<PurchaseOrderDetail> PurchaseOrderDetails { get; }

    DatabaseFacade Database { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
