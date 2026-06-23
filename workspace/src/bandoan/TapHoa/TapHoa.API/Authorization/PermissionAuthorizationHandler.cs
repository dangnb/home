using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using TapHoa.Domain.Enums;

namespace TapHoa.API.Authorization;

public class PermissionRequirement : IAuthorizationRequirement
{
    public long RequiredPermission { get; }

    public PermissionRequirement(long requiredPermission)
    {
        RequiredPermission = requiredPermission;
    }
}

public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        var permissionClaim = context.User.FindFirst("Permissions");

        if (permissionClaim == null || !long.TryParse(permissionClaim.Value, out var userPermissions))
        {
            return Task.CompletedTask; // No permissions claim found
        }

        // -1 represents Admin Master Bypass
        if (userPermissions == -1)
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // Bitwise AND operation to check if the user has ALL required bits
        if ((userPermissions & requirement.RequiredPermission) == requirement.RequiredPermission)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
