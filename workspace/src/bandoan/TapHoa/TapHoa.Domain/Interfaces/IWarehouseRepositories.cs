using TapHoa.Domain.Entities.Warehouse;
using TapHoa.Domain.Interfaces;

namespace TapHoa.Domain.Interfaces;

public interface IInventoryTransactionRepository : IBaseRepository<InventoryTransaction>
{
    Task<List<InventoryTransaction>> GetAllWithLinesAsync(CancellationToken cancellationToken = default);
    Task<InventoryTransaction?> GetWithLinesAsync(Guid id, CancellationToken cancellationToken = default);
    Task<string> GenerateNextCodeAsync(CancellationToken cancellationToken = default);
}

public interface IStockLevelRepository : IBaseRepository<StockLevel>
{
    Task<StockLevel?> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken = default); // Keep for backwards compat
    Task<StockLevel?> GetByProductIdAndStoreIdAsync(Guid productId, Guid storeId, CancellationToken cancellationToken = default);
}
