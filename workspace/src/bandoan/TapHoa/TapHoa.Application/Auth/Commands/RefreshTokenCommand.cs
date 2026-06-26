using MediatR;
using TapHoa.Application.Auth.DTOs;

namespace TapHoa.Application.Auth.Commands;

public record RefreshTokenCommand(string RefreshToken) : IRequest<AuthResultDto>;
