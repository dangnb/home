using System;
using Microsoft.AspNetCore.Authorization;
using TapHoa.Domain.Enums;

namespace TapHoa.API.Authorization;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
public class RequirePermissionAttribute : AuthorizeAttribute
{
    public const string PolicyPrefix = "Permission_";

    public RequirePermissionAttribute(AppPermissions permission)
    {
        Permission = permission;
        Policy = $"{PolicyPrefix}{(long)permission}";
    }

    public AppPermissions Permission { get; }
}
