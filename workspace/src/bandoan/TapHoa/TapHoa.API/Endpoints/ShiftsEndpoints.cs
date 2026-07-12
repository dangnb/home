using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.Shifts.Commands;
using TapHoa.Application.Shifts.Queries;

namespace TapHoa.API.Endpoints;

public static class ShiftsEndpoints
{
    public static RouteGroupBuilder MapShiftsEndpoints(this RouteGroupBuilder group)
    {
        group.RequireAuthorization();

        group.MapGet("/current", async ([FromServices] IMediator mediator) =>
        {
            var result = await mediator.Send(new GetCurrentShiftQuery());
            return Results.Ok(result);
        })
        .WithName("GetCurrentShift")
        .WithDescription("Gets the currently open shift for the logged-in user.");

        group.MapPost("/open", async ([FromBody] OpenShiftCommand command, [FromServices] IMediator mediator) =>
        {
            var id = await mediator.Send(command);
            return Results.Ok(new { ShiftId = id, Message = "Shift opened successfully." });
        })
        .WithName("OpenShift")
        .WithDescription("Opens a new shift with a starting cash amount.");

        group.MapPost("/close", async ([FromBody] CloseShiftCommand command, [FromServices] IMediator mediator) =>
        {
            var success = await mediator.Send(command);
            return success ? Results.Ok(new { Message = "Shift closed successfully." }) : Results.BadRequest();
        })
        .WithName("CloseShift")
        .WithDescription("Closes the current shift and calculates expected vs actual cash.");

        return group;
    }
}
