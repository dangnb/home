using MediatR;
using TapHoa.Application.Common.Models;
using TapHoa.Application.Products.DTOs;

namespace TapHoa.Application.Products.Queries.GetPagedProducts;

public record GetPagedProductsQuery(
    int PageIndex,
    int PageSize,
    string? SearchTerm,
    Guid? CategoryId,
    string? SortBy = null,
    Guid? SupplierId = null,
    int? Status = null,
    string? StockFilter = null
) : IRequest<PagedResult<ProductDto>>;
