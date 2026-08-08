using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConsBase.Domain.Entities;
using ConsBase.Infrastructure.Persistence;
using ConsBase.Infrastructure.Services;

namespace ConsBase.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly JwtTokenService _jwtService;

    public AuthController(ApplicationDbContext context, JwtTokenService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public record LoginRequest(string Username, string Password);

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác." });
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user);
        return Ok(new
        {
            token,
            user = new
            {
                user.Id,
                user.Username,
                user.FullName,
                user.Email,
                user.Role,
                user.TwoFactorEnabled
            }
        });
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users.Select(u => new
        {
            u.Id, u.Username, u.FullName, u.Email, u.Role, u.TwoFactorEnabled, u.IsActive
        }).ToListAsync();
        return Ok(users);
    }
}
