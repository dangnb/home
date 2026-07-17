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

public record CreateEmployeeCommand(string EmployeeCode, string FullName, string? PhoneNumber, string? CitizenId, string? Address, DateTime? DateOfBirth, string? Gender, string? Email, decimal BaseSalary, Guid? SalaryTemplateId, Guid? DepartmentId, Guid? PositionId, Guid? UserId) : IRequest<Guid>;
public record UpdateEmployeeCommand(Guid Id, string EmployeeCode, string FullName, string? PhoneNumber, string? CitizenId, string? Address, DateTime? DateOfBirth, string? Gender, string? Email, decimal BaseSalary, Guid? SalaryTemplateId, Guid? DepartmentId, Guid? PositionId, Guid? UserId) : IRequest<Unit>;
public record DeleteEmployeeCommand(Guid Id) : IRequest<Unit>;
public record ImportEmployeesCommand(string FileContent) : IRequest<int>;
public record CreateUserForEmployeeCommand(Guid EmployeeId, string Username, string Password, List<string>? Roles) : IRequest<Guid>;
public record ResetUserPasswordForEmployeeCommand(Guid EmployeeId, string NewPassword) : IRequest<Unit>;

public class HRCommandsHandler : 
    IRequestHandler<CreateDepartmentCommand, Guid>,
    IRequestHandler<UpdateDepartmentCommand, Unit>,
    IRequestHandler<DeleteDepartmentCommand, Unit>,
    IRequestHandler<CreatePositionCommand, Guid>,
    IRequestHandler<UpdatePositionCommand, Unit>,
    IRequestHandler<DeletePositionCommand, Unit>,
    IRequestHandler<CreateEmployeeCommand, Guid>,
    IRequestHandler<UpdateEmployeeCommand, Unit>,
    IRequestHandler<DeleteEmployeeCommand, Unit>,
    IRequestHandler<ImportEmployeesCommand, int>,
    IRequestHandler<CreateUserForEmployeeCommand, Guid>,
    IRequestHandler<ResetUserPasswordForEmployeeCommand, Unit>
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
        var employee = new Employee(request.EmployeeCode, request.FullName, _context.CurrentCompanyId, request.PhoneNumber, request.CitizenId, request.Address, request.DateOfBirth, request.Gender, request.Email, request.BaseSalary);
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
        
        employee.UpdateProfile(request.FullName, request.PhoneNumber, request.CitizenId, request.Address, request.DateOfBirth, request.Gender, request.Email);
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

    public async Task<int> Handle(ImportEmployeesCommand request, CancellationToken cancellationToken)
    {
        int count = 0;
        var lines = request.FileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        // Bỏ qua dòng tiêu đề
        for (int i = 1; i < lines.Length; i++)
        {
            var line = lines[i];
            var parts = line.Split(',');
            if (parts.Length >= 6)
            {
                var employeeCode = parts[0].Trim();
                var fullName = parts[1].Trim();
                var phoneNumber = parts[2].Trim();
                var email = parts[3].Trim();
                var dateOfBirthStr = parts[4].Trim();
                var baseSalaryStr = parts[5].Trim();

                DateTime? dateOfBirth = null;
                if (DateTime.TryParse(dateOfBirthStr, out var parsedDate))
                {
                    dateOfBirth = parsedDate;
                }

                decimal baseSalary = 0;
                if (decimal.TryParse(baseSalaryStr, out var parsedSalary))
                {
                    baseSalary = parsedSalary;
                }

                // Check if employee code already exists
                var existing = await _context.Employees.FirstOrDefaultAsync(e => e.EmployeeCode == employeeCode, cancellationToken);
                if (existing == null)
                {
                    var employee = new Employee(employeeCode, fullName, _context.CurrentCompanyId, phoneNumber, null, null, dateOfBirth, null, email, baseSalary);
                    _context.Employees.Add(employee);
                    count++;
                }
            }
        }
        
        if (count > 0)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }
        
        return count;
    }

    public async Task<Guid> Handle(CreateUserForEmployeeCommand request, CancellationToken cancellationToken)
    {
        var employee = await _context.Employees.FindAsync(new object[] { request.EmployeeId }, cancellationToken);
        if (employee == null) throw new Exception("Không tìm thấy nhân viên");

        if (employee.UserId.HasValue)
        {
            throw new Exception("Nhân viên này đã được cấp tài khoản");
        }

        // Check if username already exists
        var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username, cancellationToken);
        if (existingUser != null)
        {
            throw new Exception("Tên đăng nhập đã tồn tại trong hệ thống");
        }

        // Create new user
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var user = new TapHoa.Domain.Entities.Identity.User(
            request.Username, 
            passwordHash, 
            employee.FullName, 
            employee.Email ?? "", 
            employee.CompanyId,
            employee.PhoneNumber,
            employee.CitizenId,
            employee.Address
        );

        // Assign roles
        if (request.Roles != null && request.Roles.Any())
        {
            var roles = await _context.Roles.Where(r => request.Roles.Contains(r.Name)).ToListAsync(cancellationToken);
            foreach (var role in roles)
            {
                user.AssignRole(role);
            }
        }

        _context.Users.Add(user);
        
        // Link to employee
        employee.LinkUserAccount(user.Id);

        await _context.SaveChangesAsync(cancellationToken);

        return user.Id;
    }

    public async Task<Unit> Handle(ResetUserPasswordForEmployeeCommand request, CancellationToken cancellationToken)
    {
        var employee = await _context.Employees
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.Id == request.EmployeeId, cancellationToken);
            
        if (employee == null) throw new Exception("Không tìm thấy nhân viên");
        if (employee.User == null) throw new Exception("Nhân viên này chưa có tài khoản đăng nhập");

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        employee.User.UpdatePassword(passwordHash);

        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
