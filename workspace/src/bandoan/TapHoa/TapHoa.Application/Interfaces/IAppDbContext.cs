using System.Data;
using Microsoft.EntityFrameworkCore;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.Interfaces;

public interface IAppDbContext
{
    DbSet<Product> Products { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    
    // For Transaction Behavior
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}

public interface ISqlConnectionFactory
{
    IDbConnection CreateConnection();
}
