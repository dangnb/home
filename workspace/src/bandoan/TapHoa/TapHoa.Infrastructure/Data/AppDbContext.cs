using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Infrastructure.Data;

public class AppDbContext : DbContext, IAppDbContext
{
    private IDbContextTransaction? _currentTransaction;

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();

    public async Task BeginTransactionAsync()
    {
        if (_currentTransaction != null) return;
        _currentTransaction = await Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        try
        {
            await SaveChangesAsync();
            if (_currentTransaction != null)
            {
                await _currentTransaction.CommitAsync();
            }
        }
        finally
        {
            if (_currentTransaction != null)
            {
                _currentTransaction.Dispose();
                _currentTransaction = null;
            }
        }
    }

    public async Task RollbackTransactionAsync()
    {
        try
        {
            if (_currentTransaction != null)
            {
                await _currentTransaction.RollbackAsync();
            }
        }
        finally
        {
            if (_currentTransaction != null)
            {
                _currentTransaction.Dispose();
                _currentTransaction = null;
            }
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Seed initial data using anonymous objects since Product has private setters
        modelBuilder.Entity<Product>().HasData(
            new { Id = 1, Name = "Táo New Zealand size to", Category = "Trái cây", Price = 75000m, StockQuantity = 150, Unit = "kg", Status = "Đang bán", ImageIcon = "🍏", ImageColor = "#ffd7d7" },
            new { Id = 2, Name = "Rau cải thìa hữu cơ", Category = "Rau củ", Price = 15000m, StockQuantity = 30, Unit = "bó", Status = "Đang bán", ImageIcon = "🥬", ImageColor = "#d7ffd9" },
            new { Id = 3, Name = "Thịt bò thăn Úc tươi sạch", Category = "Thịt cá", Price = 350000m, StockQuantity = 5, Unit = "kg", Status = "Sắp hết", ImageIcon = "🥩", ImageColor = "#ffe3d7" }
        );
    }
}
