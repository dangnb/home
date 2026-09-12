using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.Assets.Queries;

public class MaintenanceTicketDto
{
    public long Id { get; set; }
    public long TenantId { get; set; }
    public long AssetId { get; set; }
    public string AssetCode { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public long ReportedBy { get; set; }
    public string ReporterName { get; set; } = string.Empty;
    public long? TechnicianId { get; set; }
    public string? TechnicianName { get; set; }
    public string IssueDescription { get; set; } = string.Empty;
    public string? ResolutionNotes { get; set; }
    public decimal RepairCost { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class GetMaintenanceTicketsQuery : IRequest<object>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? Keyword { get; set; }
    public string? Status { get; set; }
    public long? AssetId { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}

public class GetMaintenanceTicketsQueryHandler : IRequestHandler<GetMaintenanceTicketsQuery, object>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetMaintenanceTicketsQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<object> Handle(GetMaintenanceTicketsQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE m.tenant_id = @TenantId";
        var parameters = new DynamicParameters();
        parameters.Add("TenantId", tenantId);

        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            whereClause += " AND (a.asset_code LIKE @Keyword OR a.name LIKE @Keyword OR m.issue_description LIKE @Keyword OR u1.full_name LIKE @Keyword)";
            parameters.Add("Keyword", $"%{request.Keyword.Trim()}%");
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && request.Status != "ALL")
        {
            whereClause += " AND m.status = @Status";
            parameters.Add("Status", request.Status.Trim().ToUpper());
        }

        if (request.AssetId.HasValue && request.AssetId.Value > 0)
        {
            whereClause += " AND m.asset_id = @AssetId";
            parameters.Add("AssetId", request.AssetId.Value);
        }

        if (request.FromDate.HasValue)
        {
            whereClause += " AND m.created_at >= @FromDate";
            parameters.Add("FromDate", request.FromDate.Value.Date);
        }

        if (request.ToDate.HasValue)
        {
            whereClause += " AND m.created_at <= @ToDate";
            parameters.Add("ToDate", request.ToDate.Value.Date.AddDays(1).AddTicks(-1));
        }

        // Total Count
        var countSql = $@"
            SELECT COUNT(*) 
            FROM maintenance_tickets m
            INNER JOIN assets a ON m.asset_id = a.id
            LEFT JOIN users u1 ON m.reported_by = u1.id
            LEFT JOIN users u2 ON m.technician_id = u2.id
            {whereClause}";

        var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

        // Data List
        var page = request.Page > 0 ? request.Page : 1;
        var pageSize = request.PageSize > 0 && request.PageSize <= 500 ? request.PageSize : 20;
        var offset = (page - 1) * pageSize;

        parameters.Add("Limit", pageSize);
        parameters.Add("Offset", offset);

        var dataSql = $@"
            SELECT 
                m.id AS Id,
                m.tenant_id AS TenantId,
                m.asset_id AS AssetId,
                a.asset_code AS AssetCode,
                a.name AS AssetName,
                m.reported_by AS ReportedBy,
                u1.full_name AS ReporterName,
                m.technician_id AS TechnicianId,
                u2.full_name AS TechnicianName,
                m.issue_description AS IssueDescription,
                m.resolution_notes AS ResolutionNotes,
                m.repair_cost AS RepairCost,
                m.status AS Status,
                m.created_at AS CreatedAt
            FROM maintenance_tickets m
            INNER JOIN assets a ON m.asset_id = a.id
            LEFT JOIN users u1 ON m.reported_by = u1.id
            LEFT JOIN users u2 ON m.technician_id = u2.id
            {whereClause}
            ORDER BY m.created_at DESC
            LIMIT @Limit OFFSET @Offset";

        var data = (await connection.QueryAsync<MaintenanceTicketDto>(dataSql, parameters)).ToList();
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        return new
        {
            success = true,
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
