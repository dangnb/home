using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Users.Commands;

public record CreateUserCommand : IRequest<long>
{
    public string Username { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string FullName { get; init; } = string.Empty;
    public string? Phone { get; init; }
    public long? RoleId { get; init; }
    public string? RoleCode { get; init; }
    public long? TenantId { get; init; }
    public string? Status { get; init; }
}

public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Tên đăng nhập không được để trống.")
            .MinimumLength(3).WithMessage("Tên đăng nhập phải có ít nhất 3 ký tự.")
            .MaximumLength(100).WithMessage("Tên đăng nhập không được vượt quá 100 ký tự.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email không được để trống.")
            .EmailAddress().WithMessage("Định dạng email không hợp lệ.")
            .MaximumLength(255).WithMessage("Email không được vượt quá 255 ký tự.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Mật khẩu không được để trống.")
            .MinimumLength(6).WithMessage("Mật khẩu phải có ít nhất 6 ký tự.");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Họ và tên không được để trống.")
            .MaximumLength(255).WithMessage("Họ và tên không được vượt quá 255 ký tự.");
    }
}

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateUserCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var normalizedUsername = request.Username.Trim().ToLowerInvariant();
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        // 1. Kiểm tra trùng username toàn cục
        var usernameExists = await _context.Users
            .IgnoreQueryFilters()
            .AnyAsync(u => u.Username.ToLower() == normalizedUsername, cancellationToken);

        if (usernameExists)
        {
            throw new BadRequestException($"Tên đăng nhập '{request.Username}' đã tồn tại trong hệ thống.");
        }

        // 2. Kiểm tra trùng email toàn cục
        var emailExists = await _context.Users
            .IgnoreQueryFilters()
            .AnyAsync(u => u.Email.ToLower() == normalizedEmail, cancellationToken);

        if (emailExists)
        {
            throw new BadRequestException($"Địa chỉ email '{request.Email}' đã được sử dụng.");
        }

        // 3. Xác định TenantId
        long? tenantId = request.TenantId ?? _currentUserService.TenantId ?? 1;

        // 4. Khởi tạo tài khoản qua Factory Method
        var user = User.Create(
            tenantId: tenantId,
            username: normalizedUsername,
            email: normalizedEmail,
            passwordHash: BCrypt.Net.BCrypt.HashPassword(request.Password),
            fullName: request.FullName,
            phone: request.Phone
        );

        if (request.Status == "INACTIVE")
        {
            user.Deactivate();
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);

        // 5. Gán vai trò (Role)
        Role? targetRole = null;
        if (request.RoleId.HasValue)
        {
            targetRole = await _context.Roles
                .FirstOrDefaultAsync(r => r.Id == request.RoleId.Value, cancellationToken);
        }
        else if (!string.IsNullOrEmpty(request.RoleCode))
        {
            var code = request.RoleCode.Trim().ToUpperInvariant();
            targetRole = await _context.Roles
                .FirstOrDefaultAsync(r => r.Code.ToUpper() == code, cancellationToken);
        }

        // Mặc định gán vai trò EMPLOYEE nếu không tìm thấy
        if (targetRole == null)
        {
            targetRole = await _context.Roles
                .FirstOrDefaultAsync(r => r.Code == "EMPLOYEE", cancellationToken);
        }

        if (targetRole != null)
        {
            var userRole = UserRole.Create(user.Id, targetRole.Id, tenantId);
            _context.UserRoles.Add(userRole);
            await _context.SaveChangesAsync(cancellationToken);
        }

        return user.Id;
    }
}
