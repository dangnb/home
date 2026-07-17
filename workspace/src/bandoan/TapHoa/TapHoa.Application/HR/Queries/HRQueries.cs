using MediatR;
using TapHoa.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using TapHoa.Domain.Entities;
using Dapper;

namespace TapHoa.Application.HR.Queries;

// DTOs
public record DepartmentDto(Guid Id, string Name, string? Description, Guid? ParentId, string? ParentName);
public record PositionDto(Guid Id, string Name, string? Description);
public record EmployeeDto(Guid Id, string EmployeeCode, string FullName, string? PhoneNumber, string? CitizenId, string? Address, DateTime? DateOfBirth, string? Gender, string? Email, decimal BaseSalary, Guid? SalaryTemplateId, Guid? DepartmentId, string? DepartmentName, Guid? PositionId, string? PositionName, Guid? UserId, string? Username);

// Queries
public record GetDepartmentsQuery() : IRequest<IEnumerable<DepartmentDto>>;
public record GetPositionsQuery() : IRequest<IEnumerable<PositionDto>>;
public record GetEmployeesQuery() : IRequest<IEnumerable<EmployeeDto>>;

// Handlers
public class HRQueriesHandler : 
    IRequestHandler<GetDepartmentsQuery, IEnumerable<DepartmentDto>>,
    IRequestHandler<GetPositionsQuery, IEnumerable<PositionDto>>,
    IRequestHandler<GetEmployeesQuery, IEnumerable<EmployeeDto>>
{
    private readonly ISqlConnectionFactory _sqlConnectionFactory;
    private readonly ICurrentUserService _currentUserService;

    public HRQueriesHandler(ISqlConnectionFactory sqlConnectionFactory, ICurrentUserService currentUserService)
    {
        _sqlConnectionFactory = sqlConnectionFactory;
        _currentUserService = currentUserService;
    }

    public async Task<IEnumerable<DepartmentDto>> Handle(GetDepartmentsQuery request, CancellationToken cancellationToken)
    {
        var companyId = _currentUserService.CompanyId ?? Guid.Parse("01950000-0000-7000-8000-000000000000");
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = @"
            SELECT d.Id, d.Name, d.Description, d.ParentId, p.Name as ParentName
            FROM Departments d
            LEFT JOIN Departments p ON d.ParentId = p.Id
            WHERE d.IsDeleted = 0 AND d.CompanyId = @CompanyId
        ";
        return await connection.QueryAsync<DepartmentDto>(sql, new { CompanyId = companyId.ToString() });
    }

    public async Task<IEnumerable<PositionDto>> Handle(GetPositionsQuery request, CancellationToken cancellationToken)
    {
        var companyId = _currentUserService.CompanyId ?? Guid.Parse("01950000-0000-7000-8000-000000000000");
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = @"
            SELECT Id, Name, Description
            FROM Positions
            WHERE IsDeleted = 0 AND CompanyId = @CompanyId
        ";
        return await connection.QueryAsync<PositionDto>(sql, new { CompanyId = companyId.ToString() });
    }

    public async Task<IEnumerable<EmployeeDto>> Handle(GetEmployeesQuery request, CancellationToken cancellationToken)
    {
        var companyId = _currentUserService.CompanyId ?? Guid.Parse("01950000-0000-7000-8000-000000000000");
        using var connection = _sqlConnectionFactory.CreateConnection();
        const string sql = @"
            SELECT 
                e.Id, e.EmployeeCode, e.FullName, e.PhoneNumber, e.CitizenId, e.Address, e.DateOfBirth, e.Gender, e.Email,
                e.BaseSalary, e.SalaryTemplateId,
                e.DepartmentId, d.Name as DepartmentName,
                e.PositionId, p.Name as PositionName,
                e.UserId, u.Username as Username
            FROM Employees e
            LEFT JOIN Departments d ON e.DepartmentId = d.Id
            LEFT JOIN Positions p ON e.PositionId = p.Id
            LEFT JOIN Users u ON e.UserId = u.Id
            WHERE e.IsDeleted = 0 AND e.CompanyId = @CompanyId
        ";
        return await connection.QueryAsync<EmployeeDto>(sql, new { CompanyId = companyId.ToString() });
    }
}
