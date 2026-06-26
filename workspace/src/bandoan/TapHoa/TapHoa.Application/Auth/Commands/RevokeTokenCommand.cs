using MediatR;
using TapHoa.Application.Auth.DTOs;

namespace TapHoa.Application.Auth.Commands;

public record RevokeTokenCommand(string RefreshToken) : IRequest<bool>;
