using TapHoa.Domain.Entities;

namespace TapHoa.Domain.Interfaces;

public interface IProductRepository : IBaseRepository<Product>
{
    // Any specific methods for Product that go beyond the base repository can be added here
}
