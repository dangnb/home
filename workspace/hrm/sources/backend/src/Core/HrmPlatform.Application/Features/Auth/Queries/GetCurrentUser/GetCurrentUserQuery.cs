using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Application.Features.Auth.Commands.Login;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Auth.Queries.GetCurrentUser;

public record GetCurrentUserQuery : IRequest<AuthUserDto>;

public class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, AuthUserDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetCurrentUserQueryHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<AuthUserDto> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var currentUserId = _currentUserService.UserId;
        if (!currentUserId.HasValue)
        {
            throw new UnauthorizedAccessException("Người dùng chưa được xác thực.");
        }

        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Id == currentUserId.Value, cancellationToken);

        if (user == null)
        {
            throw new NotFoundException("Người dùng", currentUserId.Value);
        }

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

        var roleIds = userRoles.Select(ur => ur.RoleId).Distinct().ToList();
        var permissions = await _context.RolePermissions
            .IgnoreQueryFilters()
            .Where(rp => roleIds.Contains(rp.RoleId))
            .Include(rp => rp.Permission)
            .Select(rp => rp.Permission.Code)
            .Distinct()
            .ToListAsync(cancellationToken);

        return new AuthUserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FullName = user.FullName,
            TenantId = user.TenantId,
            IsSuperAdmin = isSuperAdmin,
            Roles = roles,
            Permissions = permissions
        };
    }
}
