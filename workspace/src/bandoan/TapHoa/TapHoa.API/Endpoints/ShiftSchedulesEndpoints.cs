using MediatR;
using TapHoa.Application.ShiftSchedules.Commands;
using TapHoa.Application.ShiftSchedules.Queries;

namespace TapHoa.API.Endpoints;

public static class ShiftSchedulesEndpoints
{
    public static void MapShiftSchedulesEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/shift-schedules").WithTags("ShiftSchedules").RequireAuthorization();

        group.MapGet("/", async (ISender sender, [AsParameters] GetEmployeeShiftsQuery query) =>
        {
            var result = await sender.Send(query);
            return Results.Ok(result);
        });

        group.MapPost("/", async (ISender sender, CreateEmployeeShiftCommand command) =>
        {
            var result = await sender.Send(command);
            return Results.Ok(new { Id = result, Message = "Shift schedule created successfully." });
        });

        group.MapDelete("/{id}", async (ISender sender, Guid id) =>
        {
            await sender.Send(new DeleteEmployeeShiftCommand { Id = id });
            return Results.Ok(new { Message = "Shift schedule deleted successfully." });
        });
    }
}
