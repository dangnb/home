using Microsoft.EntityFrameworkCore;
using TapHoa.Domain.Entities.Warehouse;
using TapHoa.Domain.Interfaces;
using TapHoa.Infrastructure.Data;

namespace TapHoa.Infrastructure.Repositories;

public class InventoryTransactionRepository : BaseRepository<InventoryTransaction>, IInventoryTransactionRepository
{
    public InventoryTransactionRepository(AppDbContext context) : base(context) { }

    public async Task<List<InventoryTransaction>> GetAllWithLinesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.Include(x => x.Lines).ToListAsync(cancellationToken);
    }

    public async Task<InventoryTransaction?> GetWithLinesAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbSet.Include(x => x.Lines)
                           .ThenInclude(l => l.Product)
                           .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<string> GenerateNextCodeAsync(CancellationToken cancellationToken = default)
    {
        var count = await _dbSet.CountAsync(cancellationToken);
        return $"TX-{DateTime.UtcNow:yyyyMMdd}-{(count + 1):D4}";
    }
}

public class StockLevelRepository : BaseRepository<StockLevel>, IStockLevelRepository
{
    public StockLevelRepository(AppDbContext context) : base(context) { }

    public async Task<StockLevel?> GetByProductIdAsync(int productId, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(x => x.ProductId == productId, cancellationToken);
    }
}
