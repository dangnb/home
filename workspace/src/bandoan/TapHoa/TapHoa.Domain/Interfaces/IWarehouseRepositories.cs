using TapHoa.Domain.Entities.Warehouse;
using TapHoa.Domain.Interfaces;

namespace TapHoa.Domain.Interfaces;

public interface IInventoryTransactionRepository : IBaseRepository<InventoryTransaction>
{
    Task<List<InventoryTransaction>> GetAllWithLinesAsync(CancellationToken cancellationToken = default);
    Task<InventoryTransaction?> GetWithLinesAsync(int id, CancellationToken cancellationToken = default);
    Task<string> GenerateNextCodeAsync(CancellationToken cancellationToken = default);
}

public interface IStockLevelRepository : IBaseRepository<StockLevel>
{
    Task<StockLevel?> GetByProductIdAsync(int productId, CancellationToken cancellationToken = default);
}
