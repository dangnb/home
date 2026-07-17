using Dapper;
using MediatR;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.SalaryTemplates.Queries;

public class SalaryTemplateDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Formula { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public bool IsActive { get; set; }
}

public class GetSalaryTemplatesQuery : IRequest<List<SalaryTemplateDto>> { }

public class GetSalaryTemplatesQueryHandler : IRequestHandler<GetSalaryTemplatesQuery, List<SalaryTemplateDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;

    public GetSalaryTemplatesQueryHandler(ISqlConnectionFactory sqlConnectionFactory)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
    }

    public async Task<List<SalaryTemplateDto>> Handle(GetSalaryTemplatesQuery request, CancellationToken cancellationToken)
    {
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = @"
            SELECT Id, Name, Formula, Notes, IsActive
            FROM SalaryTemplates
            WHERE IsDeleted = 0
        ";
        var templates = await connection.QueryAsync<SalaryTemplateDto>(sql);
        return templates.ToList();
    }
}
