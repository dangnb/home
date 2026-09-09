using System.Security.Claims;
using HrmPlatform.Application.Common.Interfaces;

namespace HrmPlatform.WebApi.Services;

/// <summary>
/// Dịch vụ phân giải danh tính người dùng và ngữ cảnh Tenant từ HttpContext
/// </summary>
public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public long? UserId
    {
        get
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user == null || user.Identity?.IsAuthenticated != true) return null;

            var idClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? user.FindFirst("sub")?.Value
                ?? user.FindFirst("uid")?.Value;

            return long.TryParse(idClaim, out var id) ? id : null;
        }
    }

    public long? TenantId
    {
        get
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null) return null;

            // 1. Ưu tiên lấy từ HttpContext.Items do TenantResolverMiddleware giải quyết
            if (context.Items.TryGetValue("CurrentTenantId", out var item) && item is long tenantId)
            {
                return tenantId;
            }

            // 2. Lấy từ User JWT Claims
            var user = context.User;
            var tenantClaim = user?.FindFirst("tenant_id")?.Value
                ?? user?.FindFirst("tenantId")?.Value;

            if (long.TryParse(tenantClaim, out var claimTenantId))
            {
                return claimTenantId;
            }

            return 1L;
        }
    }

    public bool IsSuperAdmin
    {
        get
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user == null || user.Identity?.IsAuthenticated != true) return false;

            return user.IsInRole("SUPER_ADMIN")
                || user.HasClaim(c => c.Type == "is_super_admin" && c.Value.Equals("true", StringComparison.OrdinalIgnoreCase));
        }
    }

    public bool IsAuthenticated =>
        _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;

    public string? IpAddress
    {
        get
        {
            var context = _httpContextAccessor.HttpContext;
            if (context == null) return null;

            if (context.Request.Headers.TryGetValue("X-Forwarded-For", out var forwarded))
            {
                var ip = forwarded.ToString().Split(',')[0].Trim();
                if (!string.IsNullOrEmpty(ip)) return ip;
            }

            return context.Connection.RemoteIpAddress?.ToString();
        }
    }
}
