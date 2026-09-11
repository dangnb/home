using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.Employees.Queries;

public class EmployeeLookupDto
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? EmployeeCode { get; set; }
    public long? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public string? JobTitle { get; set; }
    public string? AvatarUrl { get; set; }
}

public class GetEmployeeLookupQuery : IRequest<List<EmployeeLookupDto>>
{
    public string? Keyword { get; set; }
    public long? DepartmentId { get; set; }
    public int Limit { get; set; } = 200;
}

public class GetEmployeeLookupQueryHandler : IRequestHandler<GetEmployeeLookupQuery, List<EmployeeLookupDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetEmployeeLookupQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<List<EmployeeLookupDto>> Handle(GetEmployeeLookupQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE ep.tenant_id = @TenantId AND ep.status != 'DELETED'";
        var parameters = new DynamicParameters();
        parameters.Add("TenantId", tenantId);

        if (request.DepartmentId.HasValue && request.DepartmentId.Value > 0)
        {
            whereClause += " AND ep.department_id = @DepartmentId";
            parameters.Add("DepartmentId", request.DepartmentId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            whereClause += " AND (u.full_name LIKE @Keyword OR u.username LIKE @Keyword OR ep.job_title LIKE @Keyword)";
            parameters.Add("Keyword", $"%{request.Keyword.Trim()}%");
        }

        var limit = request.Limit > 0 && request.Limit <= 1000 ? request.Limit : 200;
        parameters.Add("Limit", limit);

        var sql = $@"
            SELECT 
                ep.id AS Id, 
                ep.user_id AS UserId,
                u.full_name AS FullName, 
                u.username AS EmployeeCode, 
                ep.department_id AS DepartmentId, 
                d.name AS DepartmentName, 
                ep.job_title AS JobTitle, 
                ep.avatar_url AS AvatarUrl
            FROM employee_profiles ep
            INNER JOIN users u ON ep.user_id = u.id
            LEFT JOIN departments d ON ep.department_id = d.id
            {whereClause}
            ORDER BY u.full_name ASC
            LIMIT @Limit";

        var result = await connection.QueryAsync<EmployeeLookupDto>(sql, parameters);
        return result.ToList();
    }
}
