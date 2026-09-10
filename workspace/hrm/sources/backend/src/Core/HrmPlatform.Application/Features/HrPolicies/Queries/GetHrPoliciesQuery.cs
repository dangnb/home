using System;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Extensions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using MediatR;

namespace HrmPlatform.Application.Features.HrPolicies.Queries;

public class HrPolicyDto
{
    public long Id { get; set; }
    public long TenantId { get; set; }
    public string PolicyCode { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // BENEFITS, WORKING_HOURS, INSURANCE_WELFARE, CODE_OF_CONDUCT, SAFETY_HEALTH, OTHER
    public string EffectiveDate { get; set; } = string.Empty;
    public string? ExpiryDate { get; set; }
    public string? Summary { get; set; }
    public string? Content { get; set; }
    public string? AttachmentUrl { get; set; }
    public string Status { get; set; } = string.Empty; // DRAFT, PUBLISHED, ARCHIVED
    public DateTime CreatedAt { get; set; }
}

public class HrPolicySummaryDto
{
    public int TotalPolicies { get; set; }
    public int PublishedPolicies { get; set; }
    public int BenefitsPolicies { get; set; }
    public int WorkingHoursPolicies { get; set; }
    public int InsurancePolicies { get; set; }
}

public class GetHrPoliciesQuery : IRequest<PaginatedResultDto<HrPolicyDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? Category { get; set; }
    public string? Status { get; set; }
    public string? Keyword { get; set; }
}

public class GetHrPoliciesQueryHandler : IRequestHandler<GetHrPoliciesQuery, PaginatedResultDto<HrPolicyDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetHrPoliciesQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<PaginatedResultDto<HrPolicyDto>> Handle(GetHrPoliciesQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE p.tenant_id = @TenantId";
        var parameters = new DynamicParameters();
        parameters.Add("TenantId", tenantId);

        if (!string.IsNullOrWhiteSpace(request.Category) && request.Category != "ALL")
        {
            whereClause += " AND p.category = @Category";
            parameters.Add("Category", request.Category);
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && request.Status != "ALL")
        {
            whereClause += " AND p.status = @Status";
            parameters.Add("Status", request.Status);
        }

        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            whereClause += " AND (p.policy_code LIKE @Keyword OR p.title LIKE @Keyword OR p.summary LIKE @Keyword)";
            parameters.Add("Keyword", $"%{request.Keyword.Trim()}%");
        }

        var countSql = $@"
            SELECT COUNT(*) 
            FROM hr_policies p
            {whereClause};
        ";

        var dataSql = $@"
            SELECT 
                p.id AS Id,
                p.tenant_id AS TenantId,
                p.policy_code AS PolicyCode,
                p.title AS Title,
                p.category AS Category,
                DATE_FORMAT(p.effective_date, '%Y-%m-%d') AS EffectiveDate,
                DATE_FORMAT(p.expiry_date, '%Y-%m-%d') AS ExpiryDate,
                p.summary AS Summary,
                p.content AS Content,
                p.attachment_url AS AttachmentUrl,
                p.status AS Status,
                p.created_at AS CreatedAt
            FROM hr_policies p
            {whereClause}
            ORDER BY p.id DESC";

        return await connection.QueryPaginatedAsync<HrPolicyDto>(
            countSql,
            dataSql,
            parameters,
            request.Page,
            request.PageSize,
            cancellationToken);
    }
}
