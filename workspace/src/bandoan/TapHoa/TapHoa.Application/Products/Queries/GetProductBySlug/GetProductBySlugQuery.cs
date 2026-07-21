using MediatR;
using TapHoa.Application.Products.DTOs;

namespace TapHoa.Application.Products.Queries.GetProductBySlug;

public record GetProductBySlugQuery(string Slug) : IRequest<ProductDto?>;
