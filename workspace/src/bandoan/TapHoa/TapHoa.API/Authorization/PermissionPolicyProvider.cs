using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace TapHoa.API.Authorization;

public class PermissionPolicyProvider : DefaultAuthorizationPolicyProvider
{
    public PermissionPolicyProvider(IOptions<AuthorizationOptions> options) : base(options) { }

    public override async Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
    {
        var policy = await base.GetPolicyAsync(policyName);

        if (policy == null && policyName.StartsWith(RequirePermissionAttribute.PolicyPrefix, StringComparison.OrdinalIgnoreCase))
        {
            var permissionPart = policyName.Substring(RequirePermissionAttribute.PolicyPrefix.Length);
            
            var builder = new AuthorizationPolicyBuilder();
            builder.AddRequirements(new PermissionRequirement(permissionPart));
            return builder.Build();
        }

        return policy;
    }
}
