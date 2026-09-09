using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HrmPlatform.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace HrmPlatform.Infrastructure.Services;

public class JwtTokenGenerator : IJwtTokenGenerator
{
    private readonly IConfiguration _configuration;

    public JwtTokenGenerator(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(
        long userId,
        string username,
        string email,
        string fullName,
        long? tenantId,
        IEnumerable<string> roles,
        IEnumerable<string> permissions,
        bool isSuperAdmin)
    {
        var secretKey = _configuration["JwtSettings:SecretKey"]
            ?? "SuperSecretKeyForCoreHrmPlatformMultiTenantSaaS2026!";
        var issuer = _configuration["JwtSettings:Issuer"] ?? "HrmPlatform";
        var audience = _configuration["JwtSettings:Audience"] ?? "HrmPlatformClients";
        var expirationMinutes = int.TryParse(_configuration["JwtSettings:AccessTokenExpirationMinutes"], out var exp) ? exp : 60;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new(JwtRegisteredClaimNames.Email, email),
            new(JwtRegisteredClaimNames.Name, fullName),
            new(JwtRegisteredClaimNames.PreferredUsername, username),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new("is_super_admin", isSuperAdmin ? "true" : "false")
        };

        if (tenantId.HasValue)
        {
            claims.Add(new Claim("tenant_id", tenantId.Value.ToString()));
            claims.Add(new Claim("tenantId", tenantId.Value.ToString()));
        }

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
            claims.Add(new Claim("role", role));
        }

        foreach (var permission in permissions)
        {
            claims.Add(new Claim("permission", permission));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(expirationMinutes),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
