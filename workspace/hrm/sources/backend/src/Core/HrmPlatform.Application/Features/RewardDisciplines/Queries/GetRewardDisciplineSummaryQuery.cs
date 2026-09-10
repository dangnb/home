using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.RewardDisciplines.Queries;

public class RewardDisciplineSummaryDto
{
    public int TotalRewardsCount { get; set; }
    public decimal TotalRewardAmount { get; set; }
    public int TotalDisciplinesCount { get; set; }
    public decimal TotalDisciplineAmount { get; set; }
    public decimal NetAmount => TotalRewardAmount - TotalDisciplineAmount;
    public int TotalDecisions => TotalRewardsCount + TotalDisciplinesCount;
}

public class GetRewardDisciplineSummaryQuery : IRequest<RewardDisciplineSummaryDto>
{
}

public class GetRewardDisciplineSummaryQueryHandler : IRequestHandler<GetRewardDisciplineSummaryQuery, RewardDisciplineSummaryDto>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetRewardDisciplineSummaryQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<RewardDisciplineSummaryDto> Handle(GetRewardDisciplineSummaryQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        using var connection = _sqlConnectionFactory.CreateConnection();

        var sql = @"
            SELECT 
                COUNT(CASE WHEN type = 'REWARD' AND status = 'APPROVED' THEN 1 END) AS TotalRewardsCount,
                COALESCE(SUM(CASE WHEN type = 'REWARD' AND status = 'APPROVED' THEN amount ELSE 0 END), 0) AS TotalRewardAmount,
                COUNT(CASE WHEN type = 'DISCIPLINE' AND status = 'APPROVED' THEN 1 END) AS TotalDisciplinesCount,
                COALESCE(SUM(CASE WHEN type = 'DISCIPLINE' AND status = 'APPROVED' THEN amount ELSE 0 END), 0) AS TotalDisciplineAmount
            FROM reward_disciplines
            WHERE tenant_id = @TenantId;
        ";

        var result = await connection.QueryFirstOrDefaultAsync<RewardDisciplineSummaryDto>(sql, new { TenantId = tenantId });
        return result ?? new RewardDisciplineSummaryDto();
    }
}
