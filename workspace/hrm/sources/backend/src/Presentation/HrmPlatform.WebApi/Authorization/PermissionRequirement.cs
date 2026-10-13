using Microsoft.AspNetCore.Authorization;

namespace HrmPlatform.WebApi.Authorization;

/// <summary>
/// Định nghĩa yêu cầu quyền hạn cho Authorization Handler
/// </summary>
public class PermissionRequirement : IAuthorizationRequirement
{
    public PermissionRequirement(string permission)
    {
        Permission = permission;
    }

    public string Permission { get; }
}
