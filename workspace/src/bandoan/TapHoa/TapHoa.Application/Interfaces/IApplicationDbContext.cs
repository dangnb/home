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
    DbSet<Promotion> Promotions { get; }
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
    DbSet<Shift> Shifts { get; }
    DbSet<EmployeeShift> EmployeeShifts { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderDetail> OrderDetails { get; }
    DbSet<ReturnOrder> ReturnOrders { get; }
    DbSet<ReturnOrderDetail> ReturnOrderDetails { get; }
    DbSet<PurchaseOrder> PurchaseOrders { get; }
    DbSet<PurchaseOrderDetail> PurchaseOrderDetails { get; }
    DbSet<Attendance> Attendances { get; }
    DbSet<PayrollPeriod> PayrollPeriods { get; }
    DbSet<PayrollEntry> PayrollEntries { get; }
    DbSet<SalaryTemplate> SalaryTemplates { get; }
    DbSet<Employee> Employees { get; }
    DbSet<Department> Departments { get; }
    DbSet<Position> Positions { get; }

    Guid CurrentCompanyId { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
