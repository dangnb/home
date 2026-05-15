using MediatR;
using Microsoft.IdentityModel.Tokens;
using SalesManagement.Application.Auth.Commands;
using SalesManagement.Application.Interfaces;
using SalesManagement.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace SalesManagement.Application.Auth.Handlers;

public class LoginCommandHandler : IRequestHandler<LoginCommand, string>
{
    private readonly IRepository<User> _userRepository;
    private readonly IRepository<Role> _roleRepository;
    private readonly IConfiguration _configuration;

    public LoginCommandHandler(IRepository<User> userRepository, IRepository<Role> roleRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _configuration = configuration;
    }

    public async Task<string> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var users = await _userRepository.FindAsync(u => u.Username == request.Username);
        var user = users.FirstOrDefault();

        // Verify Password
        if (user == null || user.PasswordHash != request.Password) 
            throw new UnauthorizedAccessException("Tài khoản hoặc mật khẩu không chính xác.");

        // Get Role
        var role = await _roleRepository.GetByIdAsync(user.RoleId);
        var roleName = role != null ? role.Name : "User";

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]!);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, roleName)
            }),
            Expires = DateTime.UtcNow.AddMinutes(double.Parse(_configuration["JwtSettings:ExpiryMinutes"]!)),
            Issuer = _configuration["JwtSettings:Issuer"],
            Audience = _configuration["JwtSettings:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
