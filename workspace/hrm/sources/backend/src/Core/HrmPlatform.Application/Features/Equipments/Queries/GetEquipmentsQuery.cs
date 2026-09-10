using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.Equipments.Queries;

public class EquipmentDto
{
    public long Id { get; set; }
    public long TenantId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? SerialNumber { get; set; }
    public string? Specifications { get; set; }
    public DateOnly? PurchaseDate { get; set; }
    public DateOnly? WarrantyEndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public long? CurrentUserId { get; set; }
    public string? CurrentUserName { get; set; }
    public string? DepartmentName { get; set; }
    public DateTime? AssignedDate { get; set; }
    public int? DaysAssigned { get; set; }
    public string? Note { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class EquipmentSummaryDto
{
    public int TotalEquipments { get; set; }
    public int AvailableEquipments { get; set; }
    public int AssignedEquipments { get; set; }
    public int BrokenEquipments { get; set; }
}

public class GetEquipmentsQuery : IRequest<object>
{
    public string? Keyword { get; set; }
    public string? Category { get; set; }
    public string? Status { get; set; }
    public long? DepartmentId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class GetEquipmentsQueryHandler : IRequestHandler<GetEquipmentsQuery, object>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetEquipmentsQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<object> Handle(GetEquipmentsQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE e.tenant_id = @TenantId AND e.status_entity != 'DELETED'";
        var parameters = new DynamicParameters();
        parameters.Add("TenantId", tenantId);

        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            whereClause += " AND (e.code LIKE @Keyword OR e.name LIKE @Keyword OR e.serial_number LIKE @Keyword OR u.full_name LIKE @Keyword)";
            parameters.Add("Keyword", $"%{request.Keyword.Trim()}%");
        }

        if (!string.IsNullOrWhiteSpace(request.Category) && request.Category != "ALL")
        {
            whereClause += " AND e.category = @Category";
            parameters.Add("Category", request.Category.Trim().ToUpper());
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && request.Status != "ALL")
        {
            whereClause += " AND e.status = @Status";
            parameters.Add("Status", request.Status.Trim().ToUpper());
        }

        if (request.DepartmentId.HasValue && request.DepartmentId.Value > 0)
        {
            whereClause += " AND ep.department_id = @DepartmentId";
            parameters.Add("DepartmentId", request.DepartmentId.Value);
        }

        // 1. Get Summary Totals
        var summarySql = $@"
            SELECT 
                COUNT(*) AS TotalEquipments,
                SUM(CASE WHEN e.status = 'AVAILABLE' THEN 1 ELSE 0 END) AS AvailableEquipments,
                SUM(CASE WHEN e.status = 'ASSIGNED' THEN 1 ELSE 0 END) AS AssignedEquipments,
                SUM(CASE WHEN e.status = 'BROKEN' THEN 1 ELSE 0 END) AS BrokenEquipments
            FROM equipments e
            LEFT JOIN users u ON e.current_user_id = u.id
            LEFT JOIN employee_profiles ep ON u.id = ep.user_id
            {whereClause}";

        var summary = await connection.QueryFirstOrDefaultAsync<EquipmentSummaryDto>(summarySql, parameters) ?? new EquipmentSummaryDto();

        // 2. Get Count
        var countSql = $@"
            SELECT COUNT(*) 
            FROM equipments e
            LEFT JOIN users u ON e.current_user_id = u.id
            LEFT JOIN employee_profiles ep ON u.id = ep.user_id
            {whereClause}";

        var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

        // 3. Get Data List
        var page = request.Page > 0 ? request.Page : 1;
        var pageSize = request.PageSize > 0 && request.PageSize <= 500 ? request.PageSize : 20;
        var offset = (page - 1) * pageSize;

        parameters.Add("Limit", pageSize);
        parameters.Add("Offset", offset);

        var dataSql = $@"
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
                d.name AS DepartmentName,
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
            {whereClause}
            ORDER BY e.created_at DESC
            LIMIT @Limit OFFSET @Offset";

        var data = (await connection.QueryAsync<EquipmentDto>(dataSql, parameters)).ToList();
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        return new
        {
            success = true,
            summary,
            data,
            pagination = new
            {
                totalCount,
                page,
                pageSize,
                totalPages
            }
        };
    }
}
