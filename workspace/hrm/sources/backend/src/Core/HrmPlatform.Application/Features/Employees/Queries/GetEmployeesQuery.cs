using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using MediatR;

namespace HrmPlatform.Application.Features.Employees.Queries;

public class EmployeeDto
{
    public long Id { get; set; }
    public long TenantId { get; set; }
    public long UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public long? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public long? ManagerId { get; set; }
    public string? ManagerName { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string? DateOfBirth { get; set; }
    public string? IdCardNumber { get; set; }
    public string? JoinedDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class GetEmployeesQuery : IRequest<PaginatedResultDto<EmployeeDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public long? DepartmentId { get; set; }
    public string? Status { get; set; }
    public string? Keyword { get; set; }
}

public class GetEmployeesQueryHandler : IRequestHandler<GetEmployeesQuery, PaginatedResultDto<EmployeeDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetEmployeesQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<PaginatedResultDto<EmployeeDto>> Handle(GetEmployeesQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var offset = Math.Max(0, (request.Page - 1) * request.PageSize);

        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE ep.tenant_id = @TenantId AND ep.status != 'DELETED'";
        var parameters = new DynamicParameters();
        parameters.Add("TenantId", tenantId);
        parameters.Add("Limit", request.PageSize);
        parameters.Add("Offset", offset);

        if (request.DepartmentId.HasValue && request.DepartmentId.Value > 0)
        {
            whereClause += " AND ep.department_id = @DepartmentId";
            parameters.Add("DepartmentId", request.DepartmentId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && request.Status != "All")
        {
            whereClause += " AND ep.status = @Status";
            parameters.Add("Status", request.Status);
        }

        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            whereClause += " AND (u.full_name LIKE @Keyword OR u.email LIKE @Keyword OR u.username LIKE @Keyword OR ep.job_title LIKE @Keyword)";
            parameters.Add("Keyword", $"%{request.Keyword.Trim()}%");
        }

        var countSql = $@"
            SELECT COUNT(*) 
            FROM employee_profiles ep
            INNER JOIN users u ON ep.user_id = u.id
            {whereClause};
        ";
        var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

        var dataSql = $@"
            SELECT 
                ep.id AS Id, 
                ep.tenant_id AS TenantId, 
                ep.user_id AS UserId, 
                u.username AS Username, 
                u.email AS Email, 
                u.full_name AS FullName, 
                u.phone AS Phone,
                ep.department_id AS DepartmentId, 
                d.name AS DepartmentName, 
                ep.manager_id AS ManagerId, 
                m.full_name AS ManagerName,
                ep.job_title AS JobTitle, 
                ep.gender AS Gender, 
                DATE_FORMAT(ep.date_of_birth, '%Y-%m-%d') AS DateOfBirth, 
                ep.id_card_number AS IdCardNumber, 
                DATE_FORMAT(ep.joined_date, '%Y-%m-%d') AS JoinedDate,
                ep.status AS Status, 
                ep.created_at AS CreatedAt
            FROM employee_profiles ep
            INNER JOIN users u ON ep.user_id = u.id
            LEFT JOIN departments d ON ep.department_id = d.id
            LEFT JOIN users m ON ep.manager_id = m.id
            {whereClause}
            ORDER BY ep.id DESC
            LIMIT @Limit OFFSET @Offset;
        ";

        var items = (await connection.QueryAsync<EmployeeDto>(dataSql, parameters)).ToList();
        return PaginatedResultDto<EmployeeDto>.Create(items, totalCount, request.Page, request.PageSize);
    }
}
