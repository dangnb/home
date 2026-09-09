using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Auth.Commands.Login;

public record LoginCommand : IRequest<LoginResultDto>
{
    public string UsernameOrEmail { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string? DeviceInfo { get; init; }
    public string? IpAddress { get; init; }
}

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.UsernameOrEmail)
            .NotEmpty().WithMessage("Tên đăng nhập hoặc Email không được để trống.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Mật khẩu không được để trống.");
    }
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResultDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public LoginCommandHandler(
        IApplicationDbContext context,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<LoginResultDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var identifier = request.UsernameOrEmail.Trim().ToLowerInvariant();

        // 1. Tìm tài khoản người dùng theo username hoặc email (bỏ qua tenant filter vì chưa xác thực)
        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u =>
                u.Username.ToLower() == identifier ||
                u.Email.ToLower() == identifier,
                cancellationToken);

        if (user == null)
        {
            throw new BadRequestException("Tên đăng nhập/email hoặc mật khẩu không chính xác.");
        }

        // 2. Kiểm tra mật khẩu băm BCrypt
        var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!isPasswordValid)
        {
            throw new BadRequestException("Tên đăng nhập/email hoặc mật khẩu không chính xác.");
        }

        // 3. Kiểm tra trạng thái tài khoản
        if (user.Status != EntityStatus.ACTIVE)
        {
            throw new BadRequestException("Tài khoản của bạn đang bị khóa hoặc ngừng kích hoạt. Vui lòng liên hệ quản trị viên.");
        }

        // 4. Lấy danh sách Roles của người dùng
        var userRoles = await _context.UserRoles
            .IgnoreQueryFilters()
            .Where(ur => ur.UserId == user.Id && ur.Status == EntityStatus.ACTIVE)
            .Include(ur => ur.Role)
            .ToListAsync(cancellationToken);

        var roles = userRoles
            .Where(ur => ur.Role != null)
            .Select(ur => ur.Role.Code)
            .Distinct()
            .ToList();

        var isSuperAdmin = user.TenantId == null || roles.Contains("SUPER_ADMIN");

        // 5. Lấy danh sách Permissions của các roles
        var roleIds = userRoles.Select(ur => ur.RoleId).Distinct().ToList();
        var permissions = await _context.RolePermissions
            .IgnoreQueryFilters()
            .Where(rp => roleIds.Contains(rp.RoleId))
            .Include(rp => rp.Permission)
            .Select(rp => rp.Permission.Code)
            .Distinct()
            .ToListAsync(cancellationToken);

        // 6. Phát sinh JWT Token
        var token = _jwtTokenGenerator.GenerateToken(
            user.Id,
            user.Username,
            user.Email,
            user.FullName,
            user.TenantId,
            roles,
            permissions,
            isSuperAdmin);

        var userToken = UserToken.Create(
            userId: user.Id,
            tokenHash: BCrypt.Net.BCrypt.HashPassword(token.Substring(0, Math.Min(32, token.Length))),
            expiresAt: DateTime.UtcNow.AddMinutes(60),
            deviceInfo: request.DeviceInfo,
            ipAddress: request.IpAddress
        );
        _context.UserTokens.Add(userToken);
        await _context.SaveChangesAsync(cancellationToken);

        return new LoginResultDto
        {
            AccessToken = token,
            TokenType = "Bearer",
            ExpiresIn = 3600,
            User = new AuthUserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                TenantId = user.TenantId,
                IsSuperAdmin = isSuperAdmin,
                Roles = roles,
                Permissions = permissions
            }
        };
    }
}
