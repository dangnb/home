using Dapper;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using MediatR;

namespace HrmPlatform.Application.Features.Employees.Queries;

public class GetEmployeeByIdQuery : IRequest<ApiResponseDto<EmployeeDto>>
{
    public long Id { get; set; }
}

public class GetEmployeeByIdQueryHandler : IRequestHandler<GetEmployeeByIdQuery, ApiResponseDto<EmployeeDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetEmployeeByIdQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<ApiResponseDto<EmployeeDto>> Handle(GetEmployeeByIdQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        const string sql = @"
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
            WHERE ep.tenant_id = @TenantId AND ep.id = @Id AND ep.status != 'DELETED'
            LIMIT 1;
        ";

        var employee = await connection.QueryFirstOrDefaultAsync<EmployeeDto>(sql, new { TenantId = tenantId, Id = request.Id });

        if (employee == null)
        {
            throw new NotFoundException("Hồ sơ nhân sự", request.Id);
        }

        return ApiResponseDto<EmployeeDto>.Ok(employee);
    }
}
