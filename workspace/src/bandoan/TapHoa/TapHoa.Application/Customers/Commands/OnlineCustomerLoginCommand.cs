using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.Customers.Commands;

public record OnlineCustomerLoginCommand(string PhoneNumber, string FullName) : IRequest<CustomerAuthResultDto>;

public class CustomerAuthResultDto
{
    public string Token { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public int LoyaltyPoints { get; set; }
    public string Tier { get; set; } = string.Empty;
}

public class OnlineCustomerLoginCommandHandler : IRequestHandler<OnlineCustomerLoginCommand, CustomerAuthResultDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IConfiguration _config;

    public OnlineCustomerLoginCommandHandler(IApplicationDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task<CustomerAuthResultDto> Handle(OnlineCustomerLoginCommand request, CancellationToken cancellationToken)
    {
        var cleanPhone = request.PhoneNumber.Trim();
        var customer = await _context.Customers.FirstOrDefaultAsync(c => c.PhoneNumber == cleanPhone, cancellationToken);

        if (customer == null)
        {
            // Auto register new customer if they login with phone for the first time on the storefront
            customer = Customer.Create(
                string.IsNullOrWhiteSpace(request.FullName) ? "Khách hàng mới" : request.FullName,
                cleanPhone,
                null, 
                "Tự động tạo từ Storefront"
            );
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync(cancellationToken);
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, customer.Id.ToString()),
            new Claim(ClaimTypes.Name, customer.FullName),
            new Claim("PhoneNumber", customer.PhoneNumber ?? ""),
            new Claim(ClaimTypes.Role, "Customer")
        };

        var keyString = _config["Security:JwtKey"] ?? _config["Jwt:Key"] ?? "super_secret_key_that_is_very_long_and_secure_12345!";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "TapHoaApi",
            audience: "TapHoaFrontend",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(30), // Long lived token for customers
            signingCredentials: creds
        );

        var jwtString = new JwtSecurityTokenHandler().WriteToken(token);

        return new CustomerAuthResultDto
        {
            Token = jwtString,
            CustomerId = customer.Id,
            FullName = customer.FullName,
            LoyaltyPoints = customer.LoyaltyPoints,
            Tier = customer.Tier.ToString()
        };
    }
}
