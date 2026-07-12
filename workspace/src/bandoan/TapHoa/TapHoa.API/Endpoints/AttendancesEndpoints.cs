using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.Attendances.Commands;
using TapHoa.Application.Attendances.Queries;

namespace TapHoa.API.Endpoints;

public static class AttendancesEndpoints
{
    public static RouteGroupBuilder MapAttendancesEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Attendances").RequireAuthorization();

        // Employee: Check-in
        group.MapPost("/check-in", async (ISender sender, CheckInCommand command) =>
        {
            var id = await sender.Send(command);
            return Results.Ok(new { Id = id, Message = "Check-in successful." });
        })
        .WithName("CheckIn");

        // Employee: Check-out
        group.MapPost("/check-out", async (ISender sender, CheckOutCommand command) =>
        {
            var result = await sender.Send(command);
            return result ? Results.Ok(new { Message = "Check-out successful." }) : Results.BadRequest();
        })
        .WithName("CheckOut");

        // Get today's attendance for current user
        group.MapGet("/today", async (ISender sender) =>
        {
            var result = await sender.Send(new GetMyAttendanceTodayQuery());
            return Results.Ok(result);
        })
        .WithName("GetMyAttendanceToday");

        // Admin: Get attendances list
        group.MapGet("/", async (ISender sender, [AsParameters] GetAttendancesQuery query) =>
        {
            var result = await sender.Send(query);
            return Results.Ok(result);
        })
        .WithName("GetAttendances");

        // Admin: Create/Update attendance manually
        group.MapPost("/manual", async (ISender sender, CreateAttendanceCommand command) =>
        {
            var id = await sender.Send(command);
            return Results.Ok(new { Id = id, Message = "Attendance saved successfully." });
        })
        .WithName("CreateAttendance");

        return group;
    }
}
