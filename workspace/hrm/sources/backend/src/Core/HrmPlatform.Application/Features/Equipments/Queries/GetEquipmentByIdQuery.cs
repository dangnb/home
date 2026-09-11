using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.Equipments.Queries;

public class EquipmentHistoryDto
{
    public long Id { get; set; }
    public long EquipmentId { get; set; }
    public long? UserId { get; set; }
    public string? UserName { get; set; }
    public long? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public string TargetType { get; set; } = "EMPLOYEE";
    public string ActionType { get; set; } = string.Empty;
    public DateTime? ActionDate { get; set; }
    public string? ConditionStatus { get; set; }
    public string? PerformedByName { get; set; }
    public string? Note { get; set; }
}

public class EquipmentDetailDto : EquipmentDto
{
    public List<EquipmentHistoryDto> Histories { get; set; } = new List<EquipmentHistoryDto>();
}

public class GetEquipmentByIdQuery : IRequest<EquipmentDetailDto>
{
    public long Id { get; set; }
}

public class GetEquipmentByIdQueryHandler : IRequestHandler<GetEquipmentByIdQuery, EquipmentDetailDto>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetEquipmentByIdQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<EquipmentDetailDto> Handle(GetEquipmentByIdQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var sqlEquipment = @"
            SELECT 
                e.id AS Id,
                e.tenant_id AS TenantId,
                e.code AS Code,
                e.name AS Name,
                e.category AS Category,
                e.serial_number AS SerialNumber,
                e.specifications AS Specifications,
                e.purchase_date AS PurchaseDate,
                e.warranty_end_date AS WarrantyEndDate,
                e.status AS Status,
                e.current_user_id AS CurrentUserId,
                u.full_name AS CurrentUserName,
                e.current_department_id AS CurrentDepartmentId,
                cd.name AS CurrentDepartmentName,
                COALESCE(d.name, cd.name) AS DepartmentName,
                e.assigned_date AS AssignedDate,
                CASE 
                    WHEN e.assigned_date IS NOT NULL THEN DATEDIFF(CURRENT_TIMESTAMP, e.assigned_date)
                    ELSE NULL 
                END AS DaysAssigned,
                e.note AS Note,
                e.created_at AS CreatedAt
            FROM equipments e
            LEFT JOIN users u ON e.current_user_id = u.id
            LEFT JOIN employee_profiles ep ON u.id = ep.user_id
            LEFT JOIN departments d ON ep.department_id = d.id
            LEFT JOIN departments cd ON e.current_department_id = cd.id
            WHERE e.id = @Id AND e.tenant_id = @TenantId AND e.status_entity != 'DELETED'";

        var equipment = await connection.QueryFirstOrDefaultAsync<EquipmentDetailDto>(sqlEquipment, new { Id = request.Id, TenantId = tenantId });

        if (equipment == null)
            throw new NotFoundException($"Không tìm thấy trang thiết bị có ID = {request.Id}");

        var sqlHistories = @"
            SELECT 
                h.id AS Id,
                h.equipment_id AS EquipmentId,
                h.user_id AS UserId,
                h.department_id AS DepartmentId,
                h.target_type AS TargetType,
                COALESCE(u.full_name, dept.name) AS UserName,
                dept.name AS DepartmentName,
                h.action_type AS ActionType,
                h.action_date AS ActionDate,
                h.condition_status AS ConditionStatus,
                pb.full_name AS PerformedByName,
                h.note AS Note
            FROM equipment_histories h
            LEFT JOIN users u ON h.user_id = u.id
            LEFT JOIN departments dept ON h.department_id = dept.id
            LEFT JOIN users pb ON h.performed_by = pb.id
            WHERE h.equipment_id = @EquipmentId AND h.tenant_id = @TenantId
            ORDER BY h.action_date DESC";

        var histories = (await connection.QueryAsync<EquipmentHistoryDto>(sqlHistories, new { EquipmentId = request.Id, TenantId = tenantId })).ToList();
        equipment.Histories = histories;

        return equipment;
    }
}
