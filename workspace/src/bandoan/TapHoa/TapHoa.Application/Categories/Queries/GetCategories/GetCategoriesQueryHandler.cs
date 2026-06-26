using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Categories.DTOs;

namespace TapHoa.Application.Categories.Queries.GetCategories;

public class GetCategoriesQueryHandler : IRequestHandler<GetCategoriesQuery, IEnumerable<CategoryDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetCategoriesQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<IEnumerable<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        var companyId = _currentUserService.CompanyId ?? Guid.Parse("01950000-0000-7000-8000-000000000000");
        
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = "SELECT * FROM Categories WHERE IsDeleted = 0 AND CompanyId = @CompanyId";
        
        return await connection.QueryAsync<CategoryDto>(sql, new { CompanyId = companyId.ToString() });
    }
}
