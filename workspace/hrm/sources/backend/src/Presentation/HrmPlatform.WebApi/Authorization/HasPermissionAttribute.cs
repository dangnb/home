using Microsoft.AspNetCore.Authorization;

namespace HrmPlatform.WebApi.Authorization;

/// <summary>
/// Thẻ thuộc tính phân quyền cho phép kiểm tra mã quyền truy cập API (ví dụ: [HasPermission("asset:create")])
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
public class HasPermissionAttribute : AuthorizeAttribute
{
    public const string HAS_PERMISSION_PREFIX = "PERMISSION_";

    public HasPermissionAttribute(string permission)
        : base(policy: $"{HAS_PERMISSION_PREFIX}{permission.Trim().ToLowerInvariant()}")
    {
        Permission = permission.Trim().ToLowerInvariant();
    }

    public string Permission { get; }
}
