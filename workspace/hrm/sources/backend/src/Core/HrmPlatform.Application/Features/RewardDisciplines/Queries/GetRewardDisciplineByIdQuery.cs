using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Exceptions;
using MediatR;

namespace HrmPlatform.Application.Features.RewardDisciplines.Queries;

public class GetRewardDisciplineByIdQuery : IRequest<RewardDisciplineDto>
{
    public long Id { get; set; }
}

public class GetRewardDisciplineByIdQueryHandler : IRequestHandler<GetRewardDisciplineByIdQuery, RewardDisciplineDto>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetRewardDisciplineByIdQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<RewardDisciplineDto> Handle(GetRewardDisciplineByIdQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        using var connection = _sqlConnectionFactory.CreateConnection();

        var sql = $@"
            SELECT 
                rd.id AS Id, 
                rd.tenant_id AS TenantId, 
                rd.employee_id AS EmployeeId, 
                u.full_name AS EmployeeName,
                ep.job_title AS JobTitle,
                d.name AS DepartmentName,
                rd.type AS Type,
                rd.category AS Category,
                rd.title AS Title,
                rd.decision_number AS DecisionNumber,
                DATE_FORMAT(rd.decision_date, '%Y-%m-%d') AS DecisionDate,
                DATE_FORMAT(rd.effective_date, '%Y-%m-%d') AS EffectiveDate,
                rd.amount AS Amount,
                rd.reason AS Reason,
                rd.attachment_url AS AttachmentUrl,
                rd.status AS Status,
                rd.created_at AS CreatedAt
            FROM reward_disciplines rd
            INNER JOIN employee_profiles ep ON rd.employee_id = ep.id
            INNER JOIN users u ON ep.user_id = u.id
            LEFT JOIN departments d ON ep.department_id = d.id
            WHERE rd.id = @Id AND rd.tenant_id = @TenantId;
        ";

        var result = await connection.QueryFirstOrDefaultAsync<RewardDisciplineDto>(sql, new { request.Id, TenantId = tenantId });
        if (result == null)
            throw new NotFoundException($"Không tìm thấy quyết định thưởng/phạt với ID = {request.Id}.");

        return result;
    }
}
