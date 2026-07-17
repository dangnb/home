using MediatR;
using TapHoa.Application.Roles;
using TapHoa.Domain.Enums;
using TapHoa.API.Authorization;

namespace TapHoa.API.Endpoints;

public static class RoleEndpoints
{
    public static void MapRoleEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/roles").WithTags("Roles").RequireAuthorization();

        // Get all roles
        group.MapGet("/", async (IMediator mediator) =>
        {
            var result = await mediator.Send(new GetRolesQuery());
            return Results.Ok(result);
        })
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + AppPermissions.ViewRoles);

        // Create role
        group.MapPost("/", async (CreateRoleCommand command, IMediator mediator) =>
        {
            var id = await mediator.Send(command);
            return Results.Created($"/api/roles/{id}", id);
        })
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + AppPermissions.CreateRoles);

        // Update role
        group.MapPut("/{id:guid}", async (Guid id, UpdateRoleCommand command, IMediator mediator) =>
        {
            if (id != command.Id) return Results.BadRequest("ID mismatch");
            await mediator.Send(command);
            return Results.NoContent();
        })
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + AppPermissions.UpdateRoles);

        // Delete role
        group.MapDelete("/{id:guid}", async (Guid id, IMediator mediator) =>
        {
            await mediator.Send(new DeleteRoleCommand(id));
            return Results.NoContent();
        })
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + AppPermissions.DeleteRoles);

        // Get all available permissions in the system
        app.MapGet("/api/v1/permissions", () =>
        {
            var permissions = AppPermissions.GetAll();
            return Results.Ok(permissions);
        }).WithTags("Roles").RequireAuthorization();
    }
}
