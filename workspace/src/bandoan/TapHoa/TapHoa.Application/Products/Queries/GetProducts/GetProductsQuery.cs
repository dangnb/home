using MediatR;
using TapHoa.Application.Products.DTOs;

namespace TapHoa.Application.Products.Queries.GetProducts;

public record GetProductsQuery : IRequest<IEnumerable<ProductDto>>;
