using Dapper;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using MediatR;

namespace HrmPlatform.Application.Features.Departments.Queries;

public class GetDepartmentByIdQuery : IRequest<ApiResponseDto<DepartmentDto>>
{
    public long Id { get; set; }
}

public class GetDepartmentByIdQueryHandler : IRequestHandler<GetDepartmentByIdQuery, ApiResponseDto<DepartmentDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetDepartmentByIdQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<ApiResponseDto<DepartmentDto>> Handle(GetDepartmentByIdQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        const string sql = @"
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
            WHERE d.tenant_id = @TenantId AND d.id = @Id AND d.status != 'DELETED'
            LIMIT 1;
        ";

        var department = await connection.QueryFirstOrDefaultAsync<DepartmentDto>(sql, new { TenantId = tenantId, Id = request.Id });

        if (department == null)
        {
            throw new NotFoundException("Phòng ban", request.Id);
        }

        return ApiResponseDto<DepartmentDto>.Ok(department);
    }
}
