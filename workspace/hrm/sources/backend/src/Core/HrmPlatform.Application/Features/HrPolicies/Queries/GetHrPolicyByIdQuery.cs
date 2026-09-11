using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.HrPolicies.Queries;

public class GetHrPolicyByIdQuery : IRequest<HrPolicyDto>
{
    public long Id { get; set; }

    public GetHrPolicyByIdQuery(long id)
    {
        Id = id;
    }
}

public class GetHrPolicyByIdQueryHandler : IRequestHandler<GetHrPolicyByIdQuery, HrPolicyDto>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetHrPolicyByIdQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<HrPolicyDto> Handle(GetHrPolicyByIdQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var sql = @"
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
            WHERE p.id = @Id AND p.tenant_id = @TenantId;
        ";

        var dto = await connection.QueryFirstOrDefaultAsync<HrPolicyDto>(sql, new { Id = request.Id, TenantId = tenantId });

        if (dto == null)
            throw new NotFoundException($"Không tìm thấy chính sách có ID = {request.Id}.");

        return dto;
    }
}
