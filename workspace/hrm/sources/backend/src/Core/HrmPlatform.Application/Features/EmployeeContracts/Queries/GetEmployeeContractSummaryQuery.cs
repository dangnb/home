using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.EmployeeContracts.Queries;

public class GetEmployeeContractSummaryQuery : IRequest<EmployeeContractSummaryDto>
{
}

public class GetEmployeeContractSummaryQueryHandler : IRequestHandler<GetEmployeeContractSummaryQuery, EmployeeContractSummaryDto>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetEmployeeContractSummaryQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<EmployeeContractSummaryDto> Handle(GetEmployeeContractSummaryQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var sql = @"
            SELECT 
                COUNT(*) AS TotalContracts,
                SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) AS ActiveContracts,
                SUM(CASE WHEN status = 'ACTIVE' AND end_date IS NOT NULL AND end_date BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY) THEN 1 ELSE 0 END) AS ExpiringSoonContracts,
                SUM(CASE WHEN contract_type = 'PROBATION' THEN 1 ELSE 0 END) AS ProbationContracts,
                SUM(CASE WHEN contract_type = 'DEFINITE_TERM' THEN 1 ELSE 0 END) AS DefiniteTermContracts,
                SUM(CASE WHEN contract_type = 'INDEFINITE_TERM' THEN 1 ELSE 0 END) AS IndefiniteTermContracts
            FROM employee_contracts
            WHERE tenant_id = @TenantId;
        ";

        var result = await connection.QueryFirstOrDefaultAsync<EmployeeContractSummaryDto>(sql, new { TenantId = tenantId });

        return result ?? new EmployeeContractSummaryDto();
    }
}
