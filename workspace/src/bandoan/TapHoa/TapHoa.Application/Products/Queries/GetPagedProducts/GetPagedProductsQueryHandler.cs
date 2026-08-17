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

        var stockFilterSql = request.StockFilter switch
        {
            "low-stock" => "AND (p.StockQuantity <= p.MinStockLevel)",
            "out-of-stock" => "AND (p.StockQuantity = 0)",
            "in-stock" => "AND (p.StockQuantity > 0)",
            _ => ""
        };

        var countSql = $@"
            SELECT COUNT(*) 
            FROM Products p
            WHERE p.IsDeleted = 0 
              AND p.CompanyId = @CompanyId
              AND (@SearchPattern IS NULL OR p.Name LIKE @SearchPattern OR p.Barcode LIKE @SearchPattern)
              AND (@CategoryId IS NULL OR p.CategoryId = @CategoryId)
              AND (@SupplierId IS NULL OR p.SupplierId = @SupplierId)
              AND (@Status IS NULL OR p.Status = @Status)
              {stockFilterSql};";

        var parameters = new
        {
            CompanyId = companyId.ToString(),
            SearchPattern = searchPattern,
            CategoryId = request.CategoryId,
            SupplierId = request.SupplierId,
            Status = request.Status,
            PageSize = request.PageSize,
            Offset = (request.PageIndex - 1) * request.PageSize
        };

        var orderByClause = request.SortBy switch
        {
            "oldest" => "ORDER BY p.CreatedDate ASC, p.Name ASC",
            "name-asc" => "ORDER BY p.Name ASC",
            "name-desc" => "ORDER BY p.Name DESC",
            "price-asc" or "price_asc" => "ORDER BY p.Price ASC",
            "price-desc" or "price_desc" => "ORDER BY p.Price DESC",
            "stock-desc" => "ORDER BY p.StockQuantity DESC",
            "stock-asc" => "ORDER BY p.StockQuantity ASC",
            "discount" => "ORDER BY (p.Price - p.CostPrice) DESC, p.Price DESC",
            "popular" => "ORDER BY p.StockQuantity DESC, p.Name ASC",
            _ => "ORDER BY p.CreatedDate DESC, p.Name ASC"
        };

        var dataSql = $@"
            SELECT 
                p.Id, p.Slug, p.Name, p.CategoryId, c.Name AS CategoryName,
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
              AND (@SupplierId IS NULL OR p.SupplierId = @SupplierId)
              AND (@Status IS NULL OR p.Status = @Status)
              {stockFilterSql}
            {orderByClause}
            LIMIT @PageSize OFFSET @Offset;";

        return await connection.QueryPagedAsync<ProductDto>(
            countSql, 
            dataSql, 
            parameters, 
            request.PageIndex, 
            request.PageSize);
    }
}
