using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities.Identity;

namespace TapHoa.Application.Roles;

public record CreateRoleCommand(string Name, string Description, List<string> Permissions) : IRequest<Guid>;
public record UpdateRoleCommand(Guid Id, string Name, string Description, List<string> Permissions) : IRequest;
public record DeleteRoleCommand(Guid Id) : IRequest;

public class RoleCommandsHandler : 
    IRequestHandler<CreateRoleCommand, Guid>,
    IRequestHandler<UpdateRoleCommand>,
    IRequestHandler<DeleteRoleCommand>
{
    private readonly IApplicationDbContext _context;

    public RoleCommandsHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
    {
        var role = new Role(request.Name, request.Description, JsonSerializer.Serialize(request.Permissions));
        _context.Roles.Add(role);
        await _context.SaveChangesAsync(cancellationToken);
        return role.Id;
    }

    public async Task Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles.FindAsync(new object[] { request.Id }, cancellationToken);
        if (role == null) throw new Exception("Role not found");

        // Role updating isn't fully implemented in the domain entity yet except for UpdatePermissions
        // But for simplicity we will just modify properties directly here if needed or through reflection if private setter
        typeof(Role).GetProperty(nameof(Role.Name))?.SetValue(role, request.Name);
        typeof(Role).GetProperty(nameof(Role.Description))?.SetValue(role, request.Description);
        
        role.UpdatePermissions(JsonSerializer.Serialize(request.Permissions));

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles.FindAsync(new object[] { request.Id }, cancellationToken);
        if (role != null)
        {
            _context.Roles.Remove(role);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
