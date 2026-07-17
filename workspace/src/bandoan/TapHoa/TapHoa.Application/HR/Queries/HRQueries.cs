using MediatR;
using TapHoa.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.HR.Queries;

// DTOs
public record DepartmentDto(Guid Id, string Name, string? Description, Guid? ParentId, string? ParentName);
public record PositionDto(Guid Id, string Name, string? Description);
public record EmployeeDto(Guid Id, string EmployeeCode, string FullName, string? PhoneNumber, string? CitizenId, string? Address, DateTime? DateOfBirth, string? Gender, decimal BaseSalary, Guid? SalaryTemplateId, Guid? DepartmentId, string? DepartmentName, Guid? PositionId, string? PositionName, Guid? UserId, string? Username);

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
    private readonly IApplicationDbContext _context;

    public HRQueriesHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<DepartmentDto>> Handle(GetDepartmentsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Departments
            .Include(d => d.ParentDepartment)
            .Select(d => new DepartmentDto(d.Id, d.Name, d.Description, d.ParentId, d.ParentDepartment != null ? d.ParentDepartment.Name : null))
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<PositionDto>> Handle(GetPositionsQuery request, CancellationToken cancellationToken)
    {
        return await _context.Positions
            .Select(p => new PositionDto(p.Id, p.Name, p.Description))
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<EmployeeDto>> Handle(GetEmployeesQuery request, CancellationToken cancellationToken)
    {
        return await _context.Employees
            .Include(e => e.Department)
            .Include(e => e.Position)
            .Include(e => e.User)
            .Select(e => new EmployeeDto(
                e.Id, e.EmployeeCode, e.FullName, e.PhoneNumber, e.CitizenId, e.Address, e.DateOfBirth, e.Gender, 
                e.BaseSalary, e.SalaryTemplateId, 
                e.DepartmentId, e.Department != null ? e.Department.Name : null, 
                e.PositionId, e.Position != null ? e.Position.Name : null, 
                e.UserId, e.User != null ? e.User.Username : null))
            .ToListAsync(cancellationToken);
    }
}
