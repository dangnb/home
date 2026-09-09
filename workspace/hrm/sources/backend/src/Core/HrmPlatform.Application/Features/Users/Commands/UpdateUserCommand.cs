using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Users.Commands;

public record UpdateUserCommand : IRequest
{
    public long Id { get; init; }
    public string FullName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? Phone { get; init; }
    public string? Password { get; init; }
    public long? RoleId { get; init; }
    public string? RoleCode { get; init; }
    public string? Status { get; init; }
}

public class UpdateUserCommandValidator : AbstractValidator<UpdateUserCommand>
{
    public UpdateUserCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("ID người dùng không hợp lệ.");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Họ và tên không được để trống.")
            .MaximumLength(255).WithMessage("Họ và tên không được vượt quá 255 ký tự.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email không được để trống.")
            .EmailAddress().WithMessage("Định dạng email không hợp lệ.")
            .MaximumLength(255).WithMessage("Email không được vượt quá 255 ký tự.");
    }
}

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateUserCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

        if (user == null)
        {
            throw new NotFoundException("Người dùng", request.Id);
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        // Kiểm tra trùng email nếu email thay đổi
        if (!string.Equals(user.Email, normalizedEmail, StringComparison.OrdinalIgnoreCase))
        {
            var emailExists = await _context.Users
                .IgnoreQueryFilters()
                .AnyAsync(u => u.Id != request.Id && u.Email.ToLower() == normalizedEmail, cancellationToken);

            if (emailExists)
            {
                throw new BadRequestException($"Địa chỉ email '{request.Email}' đã được sử dụng bởi người dùng khác.");
            }
        }

        user.UpdateDetails(request.FullName, normalizedEmail, request.Phone);

        // Cập nhật mật khẩu nếu có truyền
        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            user.ChangePassword(BCrypt.Net.BCrypt.HashPassword(request.Password.Trim()));
        }

        // Cập nhật trạng thái
        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            if (request.Status.Equals("INACTIVE", StringComparison.OrdinalIgnoreCase))
            {
                user.Deactivate();
            }
            else if (request.Status.Equals("ACTIVE", StringComparison.OrdinalIgnoreCase))
            {
                user.Activate();
            }
        }

        // Cập nhật vai trò (Role)
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

        if (targetRole != null)
        {
            var existingUserRoles = await _context.UserRoles
                .Where(ur => ur.UserId == user.Id)
                .ToListAsync(cancellationToken);

            if (existingUserRoles.Any())
            {
                // Cập nhật vai trò đầu tiên
                existingUserRoles.First().ChangeRole(targetRole.Id);
            }
            else
            {
                var newUserRole = UserRole.Create(user.Id, targetRole.Id, user.TenantId);
                _context.UserRoles.Add(newUserRole);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
