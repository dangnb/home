namespace HrmPlatform.WebApi.Middlewares;

/// <summary>
/// Middleware nhận diện và phân giải Tenant từ HTTP Header (X-Tenant-Id, X-Tenant-Code) hoặc JWT Token
/// </summary>
public class TenantResolverMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<TenantResolverMiddleware> _logger;

    public TenantResolverMiddleware(RequestDelegate next, ILogger<TenantResolverMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // 1. Kiểm tra Header X-Tenant-Id
        if (context.Request.Headers.TryGetValue("X-Tenant-Id", out var tenantIdHeader))
        {
            if (long.TryParse(tenantIdHeader.ToString(), out var tenantId) && tenantId > 0)
            {
                context.Items["CurrentTenantId"] = tenantId;
                _logger.LogDebug("Đã nhận diện TenantId={TenantId} từ HTTP Header X-Tenant-Id", tenantId);
            }
        }

        // 2. Kiểm tra Header X-Tenant-Code
        if (context.Request.Headers.TryGetValue("X-Tenant-Code", out var tenantCodeHeader))
        {
            var tenantCode = tenantCodeHeader.ToString().Trim();
            if (!string.IsNullOrEmpty(tenantCode))
            {
                context.Items["CurrentTenantCode"] = tenantCode;
                _logger.LogDebug("Đã nhận diện TenantCode={TenantCode} từ HTTP Header X-Tenant-Code", tenantCode);
            }
        }

        // 3. Nếu chưa có trong Header, lấy từ JWT Claim (tenant_id)
        if (!context.Items.ContainsKey("CurrentTenantId") && context.User.Identity?.IsAuthenticated == true)
        {
            var tenantClaim = context.User.FindFirst("tenant_id")?.Value
                ?? context.User.FindFirst("tenantId")?.Value;

            if (long.TryParse(tenantClaim, out var tenantId) && tenantId > 0)
            {
                context.Items["CurrentTenantId"] = tenantId;
                _logger.LogDebug("Đã nhận diện TenantId={TenantId} từ JWT Claims", tenantId);
            }
        }

        await _next(context);
    }
}
