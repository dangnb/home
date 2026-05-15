using MediatR;

namespace SalesManagement.Application.Auth.Commands;

public record LoginCommand(string Username, string Password) : IRequest<string>;
