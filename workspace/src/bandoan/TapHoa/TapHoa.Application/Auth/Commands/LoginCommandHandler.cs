using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TapHoa.Application.Auth.DTOs;
using TapHoa.Domain.Interfaces;

namespace TapHoa.Application.Auth.Commands;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResultDto>
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _config;

    public LoginCommandHandler(IUserRepository userRepository, IConfiguration config)
    {
        _userRepository = userRepository;
        _config = config;
    }

    public async Task<AuthResultDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByUsernameAsync(request.Username, cancellationToken);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Sai tên đăng nhập hoặc mật khẩu.");
        }

        // Generate JWT
        user = await _userRepository.GetUserWithRolesAsync(user.Id, cancellationToken);
        var roles = user!.Roles.Select(r => r.Name).ToList();

        // Calculate bitwise permissions by ORing all role permissions
        long packedPermissions = 0;
        foreach (var r in user.Roles)
        {
            packedPermissions |= r.Permissions;
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim("FullName", user.FullName),
            new Claim("CompanyId", user.CompanyId.ToString()),
            new Claim("Permissions", packedPermissions.ToString()) // Pack bits into 1 string claim
        };

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

        return new AuthResultDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Username = user.Username,
            FullName = user.FullName,
            Roles = roles,
            Permissions = new List<string> { packedPermissions.ToString() } // Pass as string to UI
        };
    }
}
