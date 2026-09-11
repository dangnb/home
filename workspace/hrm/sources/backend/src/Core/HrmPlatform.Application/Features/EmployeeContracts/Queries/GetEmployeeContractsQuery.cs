using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Extensions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Common.Models;
using MediatR;

namespace HrmPlatform.Application.Features.EmployeeContracts.Queries;

public class EmployeeContractDto
{
    public long Id { get; set; }
    public long TenantId { get; set; }
    public long EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public string? DepartmentName { get; set; }
    public string ContractNumber { get; set; } = string.Empty;
    public string ContractType { get; set; } = string.Empty; // PROBATION, DEFINITE_TERM, INDEFINITE_TERM...
    public string SignDate { get; set; } = string.Empty;
    public string StartDate { get; set; } = string.Empty;
    public string? EndDate { get; set; }
    public decimal BasicSalary { get; set; }
    public decimal InsuranceSalary { get; set; }
    public string Status { get; set; } = string.Empty; // ACTIVE, EXPIRING_SOON, EXPIRED, TERMINATED
    public string? Note { get; set; }
    public string? AttachmentUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class EmployeeContractSummaryDto
{
    public int TotalContracts { get; set; }
    public int ActiveContracts { get; set; }
    public int ExpiringSoonContracts { get; set; }
    public int ProbationContracts { get; set; }
    public int DefiniteTermContracts { get; set; }
    public int IndefiniteTermContracts { get; set; }
}

public class GetEmployeeContractsQuery : IRequest<PaginatedResultDto<EmployeeContractDto>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public long? EmployeeId { get; set; }
    public string? ContractType { get; set; }
    public string? Status { get; set; }
    public bool? IsExpiringSoon { get; set; }
    public string? Keyword { get; set; }
}

public class GetEmployeeContractsQueryHandler : IRequestHandler<GetEmployeeContractsQuery, PaginatedResultDto<EmployeeContractDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetEmployeeContractsQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<PaginatedResultDto<EmployeeContractDto>> Handle(GetEmployeeContractsQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var whereClause = "WHERE ec.tenant_id = @TenantId";
        var parameters = new DynamicParameters();
        parameters.Add("TenantId", tenantId);

        if (request.EmployeeId.HasValue && request.EmployeeId.Value > 0)
        {
            whereClause += " AND ec.employee_id = @EmployeeId";
            parameters.Add("EmployeeId", request.EmployeeId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.ContractType) && request.ContractType != "ALL")
        {
            whereClause += " AND ec.contract_type = @ContractType";
            parameters.Add("ContractType", request.ContractType);
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && request.Status != "ALL")
        {
            whereClause += " AND ec.status = @Status";
            parameters.Add("Status", request.Status);
        }

        if (request.IsExpiringSoon == true)
        {
            whereClause += " AND ec.status = 'ACTIVE' AND ec.end_date IS NOT NULL AND ec.end_date BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY)";
        }

        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            whereClause += " AND (ec.contract_number LIKE @Keyword OR u.full_name LIKE @Keyword OR ep.job_title LIKE @Keyword)";
            parameters.Add("Keyword", $"%{request.Keyword.Trim()}%");
        }

        var countSql = $@"
            SELECT COUNT(*) 
            FROM employee_contracts ec
            INNER JOIN employee_profiles ep ON ec.employee_id = ep.id
            INNER JOIN users u ON ep.user_id = u.id
            {whereClause};
        ";

        var dataSql = $@"
            SELECT 
                ec.id AS Id,
                ec.tenant_id AS TenantId,
                ec.employee_id AS EmployeeId,
                u.full_name AS EmployeeName,
                ep.job_title AS JobTitle,
                d.name AS DepartmentName,
                ec.contract_number AS ContractNumber,
                ec.contract_type AS ContractType,
                DATE_FORMAT(ec.sign_date, '%Y-%m-%d') AS SignDate,
                DATE_FORMAT(ec.start_date, '%Y-%m-%d') AS StartDate,
                DATE_FORMAT(ec.end_date, '%Y-%m-%d') AS EndDate,
                ec.basic_salary AS BasicSalary,
                ec.insurance_salary AS InsuranceSalary,
                ec.status AS Status,
                ec.note AS Note,
                ec.attachment_url AS AttachmentUrl,
                ec.created_at AS CreatedAt
            FROM employee_contracts ec
            INNER JOIN employee_profiles ep ON ec.employee_id = ep.id
            INNER JOIN users u ON ep.user_id = u.id
            LEFT JOIN departments d ON ep.department_id = d.id
            {whereClause}
            ORDER BY ec.id DESC";

        return await connection.QueryPaginatedAsync<EmployeeContractDto>(
            countSql,
            dataSql,
            parameters,
            request.Page,
            request.PageSize,
            cancellationToken);
    }
}
