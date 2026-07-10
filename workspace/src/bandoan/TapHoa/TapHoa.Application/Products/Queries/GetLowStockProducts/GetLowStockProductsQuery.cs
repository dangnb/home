using MediatR;
using TapHoa.Application.Products.DTOs;

namespace TapHoa.Application.Products.Queries.GetLowStockProducts;

public record GetLowStockProductsQuery : IRequest<IEnumerable<ProductDto>>;
