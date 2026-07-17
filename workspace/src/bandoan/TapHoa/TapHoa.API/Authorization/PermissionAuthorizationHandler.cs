using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using TapHoa.Domain.Enums;

namespace TapHoa.API.Authorization;

public class PermissionRequirement : IAuthorizationRequirement
{
    public string RequiredPermission { get; }

    public PermissionRequirement(string requiredPermission)
    {
        RequiredPermission = requiredPermission;
    }
}

public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        // Admin Bypass (Wildcard)
        if (context.User.HasClaim(c => c.Type == "Permission" && c.Value == "*"))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // Check if user has the specific permission string
        if (context.User.HasClaim(c => c.Type == "Permission" && c.Value == requirement.RequiredPermission))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
