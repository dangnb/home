using MediatR;
using TapHoa.Application.Products.DTOs;

namespace TapHoa.Application.Products.Queries.GetProductById;

public record GetProductByIdQuery(int Id) : IRequest<ProductDto?>;
