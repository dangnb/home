using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using MediatR;

namespace HrmPlatform.Application.Features.Departments.Queries;

public class DepartmentDto
{
    public long Id { get; set; }
    public long TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public long? ManagerId { get; set; }
    public string? ManagerName { get; set; }
    public long? ParentId { get; set; }
    public string? ParentName { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class GetDepartmentsQuery : IRequest<PaginatedResultDto<DepartmentDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 50;
    public string? Status { get; set; }
}

public class GetDepartmentsQueryHandler : IRequestHandler<GetDepartmentsQuery, PaginatedResultDto<DepartmentDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetDepartmentsQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<PaginatedResultDto<DepartmentDto>> Handle(GetDepartmentsQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var offset = Math.Max(0, (request.Page - 1) * request.PageSize);

        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE d.tenant_id = @TenantId AND d.status != 'DELETED'";
        var parameters = new DynamicParameters();
        parameters.Add("TenantId", tenantId);
        parameters.Add("Limit", request.PageSize);
        parameters.Add("Offset", offset);

        if (!string.IsNullOrWhiteSpace(request.Status) && request.Status != "All")
        {
            whereClause += " AND d.status = @Status";
            parameters.Add("Status", request.Status);
        }

        var countSql = $"SELECT COUNT(*) FROM departments d {whereClause};";
        var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

        var dataSql = $@"
            SELECT 
                d.id AS Id, 
                d.tenant_id AS TenantId, 
                d.name AS Name, 
                d.code AS Code, 
                d.manager_id AS ManagerId, 
                u.full_name AS ManagerName, 
                d.parent_id AS ParentId, 
                p.name AS ParentName,
                d.status AS Status, 
                d.created_at AS CreatedAt, 
                d.updated_at AS UpdatedAt
            FROM departments d
            LEFT JOIN users u ON d.manager_id = u.id
            LEFT JOIN departments p ON d.parent_id = p.id
            {whereClause}
            ORDER BY d.id DESC
            LIMIT @Limit OFFSET @Offset;
        ";

        var items = (await connection.QueryAsync<DepartmentDto>(dataSql, parameters)).ToList();
        return PaginatedResultDto<DepartmentDto>.Create(items, totalCount, request.Page, request.PageSize);
    }
}
