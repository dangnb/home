using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Exceptions;
using MediatR;

namespace HrmPlatform.Application.Features.EquipmentRepairs.Queries;

public class GetEquipmentRepairByIdQuery : IRequest<EquipmentRepairDto>
{
    public long Id { get; set; }

    public GetEquipmentRepairByIdQuery(long id)
    {
        Id = id;
    }
}

public class GetEquipmentRepairByIdQueryHandler : IRequestHandler<GetEquipmentRepairByIdQuery, EquipmentRepairDto>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetEquipmentRepairByIdQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<EquipmentRepairDto> Handle(GetEquipmentRepairByIdQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var sql = @"
            SELECT 
                r.id AS Id,
                r.tenant_id AS TenantId,
                r.code AS Code,
                r.equipment_id AS EquipmentId,
                e.code AS EquipmentCode,
                e.name AS EquipmentName,
                e.category AS EquipmentCategory,
                e.serial_number AS SerialNumber,
                r.reporter_user_id AS ReporterUserId,
                u_rep.full_name AS ReporterUserName,
                d_rep.name AS ReporterDepartmentName,
                r.reported_date AS ReportedDate,
                r.issue_description AS IssueDescription,
                r.priority AS Priority,
                r.technician_user_id AS TechnicianUserId,
                u_tech.full_name AS TechnicianUserName,
                r.assigned_date AS AssignedDate,
                r.status AS Status,
                r.actual_error AS ActualError,
                r.solution_detail AS SolutionDetail,
                r.replaced_parts AS ReplacedParts,
                r.repair_cost AS RepairCost,
                r.started_at AS StartedAt,
                r.completed_at AS CompletedAt,
                r.note AS Note,
                r.created_at AS CreatedAt
            FROM equipment_repairs r
            INNER JOIN equipments e ON r.equipment_id = e.id
            LEFT JOIN users u_rep ON r.reporter_user_id = u_rep.id
            LEFT JOIN employee_profiles ep_rep ON u_rep.id = ep_rep.user_id
            LEFT JOIN departments d_rep ON ep_rep.department_id = d_rep.id
            LEFT JOIN users u_tech ON r.technician_user_id = u_tech.id
            WHERE r.id = @Id AND r.tenant_id = @TenantId AND r.status_entity != 'DELETED'";

        var dto = await connection.QueryFirstOrDefaultAsync<EquipmentRepairDto>(sql, new { Id = request.Id, TenantId = tenantId });

        if (dto == null)
            throw new NotFoundException("EquipmentRepair", request.Id);

        return dto;
    }
}
