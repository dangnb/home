using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Categories.DTOs;

namespace TapHoa.Application.Categories.Queries.GetCategoryById;

public record GetCategoryByIdQuery(int Id) : IRequest<CategoryDto?>;

public class GetCategoryByIdQueryHandler : IRequestHandler<GetCategoryByIdQuery, CategoryDto?>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetCategoryByIdQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<CategoryDto?> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = "SELECT * FROM Categories WHERE Id = @Id";
        return await connection.QuerySingleOrDefaultAsync<CategoryDto>(sql, new { request.Id });
    }
}
