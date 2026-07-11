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
            FROM Products p
            WHERE p.IsDeleted = 0 
              AND p.CompanyId = @CompanyId
              AND (@SearchPattern IS NULL OR p.Name LIKE @SearchPattern OR p.Barcode LIKE @SearchPattern)
              AND (@CategoryId IS NULL OR p.CategoryId = @CategoryId);";

        var parameters = new
        {
            CompanyId = companyId.ToString(),
            SearchPattern = searchPattern,
            CategoryId = request.CategoryId,
            PageSize = request.PageSize,
            Offset = (request.PageIndex - 1) * request.PageSize
        };

        var dataSql = @"
            SELECT 
                p.Id, p.Name, p.CategoryId, c.Name AS CategoryName,
                p.SupplierId, s.FullName AS SupplierName,
                p.MainImageUrl, p.CostPrice, p.WholesalePrice, p.Price, 
                p.StockQuantity, p.MinStockLevel, p.MaxStockLevel, p.Unit, p.Barcode, p.Status,
                p.AdditionalImages
            FROM Products p
            LEFT JOIN Categories c ON p.CategoryId = c.Id
            LEFT JOIN Suppliers s ON p.SupplierId = s.Id
            WHERE p.IsDeleted = 0 
              AND p.CompanyId = @CompanyId
              AND (@SearchPattern IS NULL OR p.Name LIKE @SearchPattern OR p.Barcode LIKE @SearchPattern)
              AND (@CategoryId IS NULL OR p.CategoryId = @CategoryId)
            ORDER BY p.CreatedDate DESC, p.Name ASC
            LIMIT @PageSize OFFSET @Offset;";

        return await connection.QueryPagedAsync<ProductDto>(
            countSql, 
            dataSql, 
            parameters, 
            request.PageIndex, 
            request.PageSize);
    }
}
