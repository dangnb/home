using System.Threading;
using System.Threading.Tasks;
using Dapper;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;

namespace HrmPlatform.Application.Features.EmployeeContracts.Queries;

public class GetEmployeeContractByIdQuery : IRequest<EmployeeContractDto>
{
    public long Id { get; set; }

    public GetEmployeeContractByIdQuery(long id)
    {
        Id = id;
    }
}

public class GetEmployeeContractByIdQueryHandler : IRequestHandler<GetEmployeeContractByIdQuery, EmployeeContractDto>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public GetEmployeeContractByIdQueryHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<EmployeeContractDto> Handle(GetEmployeeContractByIdQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        using var connection = _sqlConnectionFactory.CreateConnection();

        var sql = @"
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
            WHERE ec.id = @Id AND ec.tenant_id = @TenantId;
        ";

        var dto = await connection.QueryFirstOrDefaultAsync<EmployeeContractDto>(sql, new { Id = request.Id, TenantId = tenantId });

        if (dto == null)
            throw new NotFoundException($"Không tìm thấy hợp đồng lao động có ID = {request.Id}.");

        return dto;
    }
}
