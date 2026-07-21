using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Categories.DTOs;

namespace TapHoa.Application.Categories.Queries.GetCategoryBySlug;

public class GetCategoryBySlugQueryHandler : IRequestHandler<GetCategoryBySlugQuery, CategoryDto>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetCategoryBySlugQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<CategoryDto> Handle(GetCategoryBySlugQuery request, CancellationToken cancellationToken)
    {
        var companyId = _currentUserService.CompanyId ?? Guid.Parse("01950000-0000-7000-8000-000000000000");
        
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = "SELECT * FROM Categories WHERE IsDeleted = 0 AND CompanyId = @CompanyId AND Slug = @Slug";
        
        var category = await connection.QuerySingleOrDefaultAsync<CategoryDto>(sql, new 
        { 
            CompanyId = companyId.ToString(),
            Slug = request.Slug 
        });

        if (category == null)
            throw new KeyNotFoundException("Danh mục không tồn tại.");

        return category;
    }
}
