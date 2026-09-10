using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.HrPolicies.Queries;

public class GetHrPolicySummaryQuery : IRequest<HrPolicySummaryDto>
{
}

public class GetHrPolicySummaryQueryHandler : IRequestHandler<GetHrPolicySummaryQuery, HrPolicySummaryDto>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetHrPolicySummaryQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<HrPolicySummaryDto> Handle(GetHrPolicySummaryQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var sql = @"
            SELECT 
                COUNT(*) AS TotalPolicies,
                SUM(CASE WHEN status = 'PUBLISHED' THEN 1 ELSE 0 END) AS PublishedPolicies,
                SUM(CASE WHEN category = 'BENEFITS' THEN 1 ELSE 0 END) AS BenefitsPolicies,
                SUM(CASE WHEN category = 'WORKING_HOURS' THEN 1 ELSE 0 END) AS WorkingHoursPolicies,
                SUM(CASE WHEN category = 'INSURANCE_WELFARE' THEN 1 ELSE 0 END) AS InsurancePolicies
            FROM hr_policies
            WHERE tenant_id = @TenantId;
        ";

        var result = await connection.QueryFirstOrDefaultAsync<HrPolicySummaryDto>(sql, new { TenantId = tenantId });

        return result ?? new HrPolicySummaryDto();
    }
}
