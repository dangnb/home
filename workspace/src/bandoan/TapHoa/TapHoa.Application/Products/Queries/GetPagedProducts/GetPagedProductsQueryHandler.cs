using Dapper;
using MediatR;
using TapHoa.Application.Common.Models;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Products.DTOs;
using TapHoa.Application.Common.Extensions;
namespace TapHoa.Application.Products.Queries.GetPagedProducts;

public class GetPagedProductsQueryHandler : IRequestHandler<GetPagedProductsQuery, PagedResult<ProductDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetPagedProductsQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<PagedResult<ProductDto>> Handle(GetPagedProductsQuery request, CancellationToken cancellationToken)
    {
        var companyId = _currentUserService.CompanyId ?? Guid.Parse("01950000-0000-7000-8000-000000000000");
        using var connection = _sqlConnectionFactory.CreateConnection();

        var searchPattern = string.IsNullOrWhiteSpace(request.SearchTerm) ? null : $"%{request.SearchTerm.Trim()}%";

        var countSql = @"
            SELECT COUNT(*) 
            FROM Products 
            WHERE IsDeleted = 0 
              AND CompanyId = @CompanyId
              AND (@SearchPattern IS NULL OR Name LIKE @SearchPattern OR CAST(Id AS TEXT) LIKE @SearchPattern)
              AND (@Category IS NULL OR @Category = '' OR Category = @Category);";

        var parameters = new
        {
            CompanyId = companyId.ToString(),
            SearchPattern = searchPattern,
            Category = request.Category,
            PageSize = request.PageSize,
            Offset = (request.PageIndex - 1) * request.PageSize
        };

        var dataSql = @"
            SELECT * 
            FROM Products 
            WHERE IsDeleted = 0 
              AND CompanyId = @CompanyId
              AND (@SearchPattern IS NULL OR Name LIKE @SearchPattern OR CAST(Id AS TEXT) LIKE @SearchPattern)
              AND (@Category IS NULL OR @Category = '' OR Category = @Category)
            ORDER BY CreatedDate DESC, Name ASC
            LIMIT @PageSize OFFSET @Offset;";

        return await connection.QueryPagedAsync<ProductDto>(
            countSql, 
            dataSql, 
            parameters, 
            request.PageIndex, 
            request.PageSize);
    }
}
