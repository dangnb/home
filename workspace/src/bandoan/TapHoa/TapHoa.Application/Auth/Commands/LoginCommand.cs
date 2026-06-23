using MediatR;
using TapHoa.Application.Auth.DTOs;

namespace TapHoa.Application.Auth.Commands;

public class LoginCommand : IRequest<AuthResultDto>
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
