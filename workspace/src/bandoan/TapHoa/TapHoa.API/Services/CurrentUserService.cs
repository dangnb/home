using System.Security.Claims;
using TapHoa.Application.Interfaces;

namespace TapHoa.API.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string? UserId => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
    public string? UserName => _httpContextAccessor.HttpContext?.User?.Identity?.Name;
    
    public Guid? CompanyId 
    {
        get 
        {
            var companyClaim = _httpContextAccessor.HttpContext?.User?.FindFirstValue("CompanyId");
            return Guid.TryParse(companyClaim, out var companyId) ? companyId : null;
        }
    }
}
