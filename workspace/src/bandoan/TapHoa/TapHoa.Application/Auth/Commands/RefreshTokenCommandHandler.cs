using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using TapHoa.Application.Auth.DTOs;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Interfaces;

namespace TapHoa.Application.Auth.Commands;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResultDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _config;

    public RefreshTokenCommandHandler(IApplicationDbContext context, IUserRepository userRepository, IConfiguration config)
    {
        _context = context;
        _userRepository = userRepository;
        _config = config;
    }

    public async Task<AuthResultDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var tokenRecord = await _context.UserTokens
            .FirstOrDefaultAsync(t => t.Token == request.RefreshToken, cancellationToken);

        if (tokenRecord == null || tokenRecord.IsRevoked || tokenRecord.ExpiresAt < DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException("Refresh token is invalid or expired.");
        }

        var user = await _userRepository.GetUserWithRolesAsync(tokenRecord.UserId, cancellationToken);
        if (user == null || !user.IsActive)
        {
            throw new UnauthorizedAccessException("User is inactive or not found.");
        }

        // Revoke the old refresh token (Rotate)
        tokenRecord.Revoke();

        // Generate new JWT 
        var roles = user.Roles.Select(r => r.Name).ToList();
        
        var allPermissions = new HashSet<string>();
        foreach (var r in user.Roles)
        {
            if (!string.IsNullOrEmpty(r.Permissions))
            {
                try
                {
                    var perms = JsonSerializer.Deserialize<List<string>>(r.Permissions);
                    if (perms != null)
                    {
                        foreach(var p in perms) allPermissions.Add(p);
                    }
                }
                catch { } // Ignore malformed JSON
            }
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim("FullName", user.FullName),
            new Claim("CompanyId", user.CompanyId.ToString())
        };

        var permissionsJson = JsonSerializer.Serialize(allPermissions);
        claims.Add(new Claim("Permissions", permissionsJson)); 

        foreach (var p in allPermissions)
        {
            claims.Add(new Claim("Permission", p));
        }
        foreach (var role in roles) claims.Add(new Claim(ClaimTypes.Role, role));

        var keyString = _config["Jwt:Key"] ?? "super_secret_key_that_is_very_long_and_secure_12345!";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "TapHoaApi",
            audience: "TapHoaFrontend",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: creds
        );

        // Generate new Refresh Token
        var newRefreshToken = Convert.ToBase64String(Guid.NewGuid().ToByteArray()) + Convert.ToBase64String(Guid.NewGuid().ToByteArray());
        var newRtEntity = new TapHoa.Domain.Entities.Identity.UserToken(user.Id, newRefreshToken, DateTime.UtcNow.AddDays(7));
        
        _context.UserTokens.Add(newRtEntity);
        await _context.SaveChangesAsync(cancellationToken);

        return new AuthResultDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            RefreshToken = newRefreshToken,
            Username = user.Username,
            FullName = user.FullName,
            Roles = roles,
            Permissions = allPermissions.ToList()
        };
    }
}
