using TapHoa.Domain.Entities;
using TapHoa.Domain.Interfaces;
using TapHoa.Infrastructure.Data;

namespace TapHoa.Infrastructure.Repositories;

public class ProductRepository : BaseRepository<Product>, IProductRepository
{
    public ProductRepository(AppDbContext context) : base(context)
    {
    }

    // Specific database logic corresponding to Product that isn't simple CRUD goes here
}
