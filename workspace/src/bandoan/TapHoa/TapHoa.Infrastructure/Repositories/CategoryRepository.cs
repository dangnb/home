using TapHoa.Domain.Entities;
using TapHoa.Domain.Interfaces;
using TapHoa.Infrastructure.Data;

namespace TapHoa.Infrastructure.Repositories;

public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
{
    public CategoryRepository(AppDbContext context) : base(context)
    {
    }
}
