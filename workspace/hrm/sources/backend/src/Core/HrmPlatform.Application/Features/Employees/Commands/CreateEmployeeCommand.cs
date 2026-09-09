using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Employees.Commands;

public record CreateEmployeeCommand : IRequest<long>
{
    // Thông tin tài khoản User
    public string Username { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string FullName { get; init; } = string.Empty;
    public string? Phone { get; init; }

    // Thông tin hồ sơ nhân sự
    public long? DepartmentId { get; init; }
    public long? ManagerId { get; init; }
    public string JobTitle { get; init; } = string.Empty;
    public Gender Gender { get; init; } = Gender.OTHER;
    public DateOnly? DateOfBirth { get; init; }
    public string? IdCardNumber { get; init; }
    public DateOnly? JoinedDate { get; init; }
}

public class CreateEmployeeCommandValidator : AbstractValidator<CreateEmployeeCommand>
{
    public CreateEmployeeCommandValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Tên đăng nhập không được để trống.")
            .MaximumLength(100).WithMessage("Tên đăng nhập tối đa 100 ký tự.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email không được để trống.")
            .EmailAddress().WithMessage("Email không đúng định dạng.")
            .MaximumLength(255).WithMessage("Email tối đa 255 ký tự.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Mật khẩu không được để trống.")
            .MinimumLength(6).WithMessage("Mật khẩu phải từ 6 ký tự trở lên.");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Họ và tên không được để trống.")
            .MaximumLength(255).WithMessage("Họ và tên tối đa 255 ký tự.");

        RuleFor(x => x.JobTitle)
            .NotEmpty().WithMessage("Chức danh không được để trống.")
            .MaximumLength(150).WithMessage("Chức danh tối đa 150 ký tự.");
    }
}

public class CreateEmployeeCommandHandler : IRequestHandler<CreateEmployeeCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateEmployeeCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(CreateEmployeeCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId;
        if (!tenantId.HasValue)
        {
            throw new BadRequestException("Không xác định được TenantId trong phiên làm việc.");
        }

        // 1. Kiểm tra trùng lặp Username và Email toàn hệ thống
        var usernameExists = await _context.Users
            .AnyAsync(u => u.Username == request.Username, cancellationToken);
        if (usernameExists)
        {
            throw new BadRequestException($"Tên đăng nhập '{request.Username}' đã được sử dụng.");
        }

        var emailExists = await _context.Users
            .AnyAsync(u => u.Email == request.Email, cancellationToken);
        if (emailExists)
        {
            throw new BadRequestException($"Email '{request.Email}' đã được đăng ký.");
        }

        // 2. Kiểm tra DepartmentId nếu có truyền
        if (request.DepartmentId.HasValue)
        {
            var deptExists = await _context.Departments
                .AnyAsync(d => d.Id == request.DepartmentId.Value, cancellationToken);
            if (!deptExists)
            {
                throw new NotFoundException("Phòng ban", request.DepartmentId.Value);
            }
        }

        // 3. Tạo tài khoản User (Bcrypt hash)
        var user = new User
        {
            TenantId = tenantId.Value,
            Username = request.Username.Trim().ToLowerInvariant(),
            Email = request.Email.Trim().ToLowerInvariant(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FullName = request.FullName.Trim(),
            Phone = request.Phone?.Trim(),
            Status = EntityStatus.ACTIVE
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        // 4. Tạo hồ sơ nhân sự EmployeeProfile
        var profile = new EmployeeProfile
        {
            TenantId = tenantId.Value,
            UserId = user.Id,
            DepartmentId = request.DepartmentId,
            ManagerId = request.ManagerId,
            JobTitle = request.JobTitle.Trim(),
            Gender = request.Gender,
            DateOfBirth = request.DateOfBirth,
            IdCardNumber = request.IdCardNumber?.Trim(),
            JoinedDate = request.JoinedDate ?? DateOnly.FromDateTime(DateTime.UtcNow),
            Status = EntityStatus.ACTIVE
        };

        _context.EmployeeProfiles.Add(profile);

        // 5. Gán vai trò mặc định EMPLOYEE cho tài khoản mới
        var defaultRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.Code == "EMPLOYEE", cancellationToken);

        if (defaultRole != null)
        {
            _context.UserRoles.Add(new UserRole
            {
                UserId = user.Id,
                RoleId = defaultRole.Id,
                TenantId = tenantId.Value,
                Status = EntityStatus.ACTIVE
            });
        }

        await _context.SaveChangesAsync(cancellationToken);

        return profile.Id;
    }
}
