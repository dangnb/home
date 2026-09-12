using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace HrmPlatform.WebApi.Authorization;

/// <summary>
/// Handler xử lý kiểm tra danh tính & quyền hạn thực tế của user từ JWT Token Claims
/// </summary>
public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        PermissionRequirement requirement)
    {
        if (context.User == null || context.User.Identity?.IsAuthenticated != true)
        {
            return Task.CompletedTask;
        }

        // 1. Nếu là SUPER_ADMIN hoặc TENANT_ADMIN, tự động cấp quyền tối cao
        var isSuperAdmin = context.User.HasClaim(c => c.Type == "is_super_admin" && c.Value.Equals("true", StringComparison.OrdinalIgnoreCase)) ||
                           context.User.IsInRole("SUPER_ADMIN") ||
                           context.User.HasClaim(c => c.Type == ClaimTypes.Role && c.Value.Equals("SUPER_ADMIN", StringComparison.OrdinalIgnoreCase));

        if (isSuperAdmin)
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        var isTenantAdmin = context.User.IsInRole("TENANT_ADMIN") ||
                            context.User.HasClaim(c => c.Type == ClaimTypes.Role && c.Value.Equals("TENANT_ADMIN", StringComparison.OrdinalIgnoreCase));

        if (isTenantAdmin)
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // 2. Kiểm tra danh sách permissions trong JWT Claims
        var permissions = context.User.Claims
            .Where(c => c.Type == "permission" || c.Type == "Permission")
            .Select(c => c.Value.Trim().ToLowerInvariant())
            .ToList();

        var requiredPermission = requirement.Permission.Trim().ToLowerInvariant();

        if (permissions.Contains(requiredPermission))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
