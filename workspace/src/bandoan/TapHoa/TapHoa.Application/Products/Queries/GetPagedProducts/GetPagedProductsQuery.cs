using MediatR;
using TapHoa.Application.Common.Models;
using TapHoa.Application.Products.DTOs;

namespace TapHoa.Application.Products.Queries.GetPagedProducts;

public record GetPagedProductsQuery(
    int PageIndex,
    int PageSize,
    string? SearchTerm,
    string? Category
) : IRequest<PagedResult<ProductDto>>;
