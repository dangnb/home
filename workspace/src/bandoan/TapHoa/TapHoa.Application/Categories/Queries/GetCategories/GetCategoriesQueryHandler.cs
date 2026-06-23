using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Categories.DTOs;

namespace TapHoa.Application.Categories.Queries.GetCategories;

public class GetCategoriesQueryHandler : IRequestHandler<GetCategoriesQuery, IEnumerable<CategoryDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetCategoriesQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<IEnumerable<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = "SELECT * FROM Categories";
        return await connection.QueryAsync<CategoryDto>(sql);
    }
}
