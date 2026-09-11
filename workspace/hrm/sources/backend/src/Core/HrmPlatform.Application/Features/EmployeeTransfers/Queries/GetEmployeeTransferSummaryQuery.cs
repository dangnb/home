using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.EmployeeTransfers.Queries;

public class GetEmployeeTransferSummaryQuery : IRequest<EmployeeTransferSummaryDto>
{
}

public class GetEmployeeTransferSummaryQueryHandler : IRequestHandler<GetEmployeeTransferSummaryQuery, EmployeeTransferSummaryDto>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetEmployeeTransferSummaryQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<EmployeeTransferSummaryDto> Handle(GetEmployeeTransferSummaryQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var sql = @"
            SELECT 
                COUNT(*) AS TotalTransfers,
                SUM(CASE WHEN approval_status = 'PENDING_APPROVAL' THEN 1 ELSE 0 END) AS PendingTransfers,
                SUM(CASE WHEN approval_status = 'APPROVED' THEN 1 ELSE 0 END) AS ApprovedTransfers,
                SUM(CASE WHEN approval_status = 'REJECTED' THEN 1 ELSE 0 END) AS RejectedTransfers,
                SUM(CASE WHEN change_type = 'DEPARTMENT_TRANSFER' THEN 1 ELSE 0 END) AS DepartmentTransfers,
                SUM(CASE WHEN change_type = 'PROMOTION' THEN 1 ELSE 0 END) AS Promotions
            FROM employee_job_history
            WHERE tenant_id = @TenantId;
        ";

        var result = await connection.QueryFirstOrDefaultAsync<EmployeeTransferSummaryDto>(sql, new { TenantId = tenantId });

        return result ?? new EmployeeTransferSummaryDto();
    }
}
