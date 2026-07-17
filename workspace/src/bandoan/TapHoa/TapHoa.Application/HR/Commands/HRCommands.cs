using MediatR;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace TapHoa.Application.HR.Commands;

public record CreateDepartmentCommand(string Name, string? Description, Guid? ParentId) : IRequest<Guid>;
public record UpdateDepartmentCommand(Guid Id, string Name, string? Description, Guid? ParentId) : IRequest<Unit>;
public record DeleteDepartmentCommand(Guid Id) : IRequest<Unit>;

public record CreatePositionCommand(string Name, string? Description) : IRequest<Guid>;
public record UpdatePositionCommand(Guid Id, string Name, string? Description) : IRequest<Unit>;
public record DeletePositionCommand(Guid Id) : IRequest<Unit>;

public record CreateEmployeeCommand(string EmployeeCode, string FullName, string? PhoneNumber, string? CitizenId, string? Address, DateTime? DateOfBirth, string? Gender, decimal BaseSalary, Guid? SalaryTemplateId, Guid? DepartmentId, Guid? PositionId, Guid? UserId) : IRequest<Guid>;
public record UpdateEmployeeCommand(Guid Id, string EmployeeCode, string FullName, string? PhoneNumber, string? CitizenId, string? Address, DateTime? DateOfBirth, string? Gender, decimal BaseSalary, Guid? SalaryTemplateId, Guid? DepartmentId, Guid? PositionId, Guid? UserId) : IRequest<Unit>;
public record DeleteEmployeeCommand(Guid Id) : IRequest<Unit>;

public class HRCommandsHandler : 
    IRequestHandler<CreateDepartmentCommand, Guid>,
    IRequestHandler<UpdateDepartmentCommand, Unit>,
    IRequestHandler<DeleteDepartmentCommand, Unit>,
    IRequestHandler<CreatePositionCommand, Guid>,
    IRequestHandler<UpdatePositionCommand, Unit>,
    IRequestHandler<DeletePositionCommand, Unit>,
    IRequestHandler<CreateEmployeeCommand, Guid>,
    IRequestHandler<UpdateEmployeeCommand, Unit>,
    IRequestHandler<DeleteEmployeeCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public HRCommandsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateDepartmentCommand request, CancellationToken cancellationToken)
    {
        var department = new Department(request.Name, request.Description, _context.CurrentCompanyId, request.ParentId);
        _context.Departments.Add(department);
        await _context.SaveChangesAsync(cancellationToken);
        return department.Id;
    }

    public async Task<Unit> Handle(UpdateDepartmentCommand request, CancellationToken cancellationToken)
    {
        var department = await _context.Departments.FindAsync(new object[] { request.Id }, cancellationToken);
        if (department == null) throw new Exception("Department not found");
        department.Update(request.Name, request.Description, request.ParentId);
        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(DeleteDepartmentCommand request, CancellationToken cancellationToken)
    {
        var department = await _context.Departments.FindAsync(new object[] { request.Id }, cancellationToken);
        if (department != null)
        {
            department.IsDeleted = true;
            await _context.SaveChangesAsync(cancellationToken);
        }
        return Unit.Value;
    }

    public async Task<Guid> Handle(CreatePositionCommand request, CancellationToken cancellationToken)
    {
        var position = new Position(request.Name, request.Description, _context.CurrentCompanyId);
        _context.Positions.Add(position);
        await _context.SaveChangesAsync(cancellationToken);
        return position.Id;
    }

    public async Task<Unit> Handle(UpdatePositionCommand request, CancellationToken cancellationToken)
    {
        var position = await _context.Positions.FindAsync(new object[] { request.Id }, cancellationToken);
        if (position == null) throw new Exception("Position not found");
        position.Update(request.Name, request.Description);
        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(DeletePositionCommand request, CancellationToken cancellationToken)
    {
        var position = await _context.Positions.FindAsync(new object[] { request.Id }, cancellationToken);
        if (position != null)
        {
            position.IsDeleted = true;
            await _context.SaveChangesAsync(cancellationToken);
        }
        return Unit.Value;
    }

    public async Task<Guid> Handle(CreateEmployeeCommand request, CancellationToken cancellationToken)
    {
        var employee = new Employee(request.EmployeeCode, request.FullName, _context.CurrentCompanyId, request.PhoneNumber, request.CitizenId, request.Address, request.DateOfBirth, request.Gender, request.BaseSalary);
        employee.AssignToDepartment(request.DepartmentId, request.PositionId);
        employee.AssignSalary(request.BaseSalary, request.SalaryTemplateId);
        employee.LinkUserAccount(request.UserId);

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync(cancellationToken);
        return employee.Id;
    }

    public async Task<Unit> Handle(UpdateEmployeeCommand request, CancellationToken cancellationToken)
    {
        var employee = await _context.Employees.FindAsync(new object[] { request.Id }, cancellationToken);
        if (employee == null) throw new Exception("Employee not found");
        
        employee.UpdateProfile(request.FullName, request.PhoneNumber, request.CitizenId, request.Address, request.DateOfBirth, request.Gender);
        employee.AssignToDepartment(request.DepartmentId, request.PositionId);
        employee.AssignSalary(request.BaseSalary, request.SalaryTemplateId);
        employee.LinkUserAccount(request.UserId);

        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(DeleteEmployeeCommand request, CancellationToken cancellationToken)
    {
        var employee = await _context.Employees.FindAsync(new object[] { request.Id }, cancellationToken);
        if (employee != null)
        {
            employee.IsDeleted = true;
            await _context.SaveChangesAsync(cancellationToken);
        }
        return Unit.Value;
    }
}
