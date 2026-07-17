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

        // Admin: Import Attendances via Excel
        group.MapPost("/import", async (Microsoft.AspNetCore.Http.HttpRequest request, ISender sender) =>
        {
            if (!request.HasFormContentType)
                return Results.BadRequest("Unsupported media type.");

            var form = await request.ReadFormAsync();
            var file = form.Files.GetFile("file");

            if (file == null || file.Length == 0)
                return Results.BadRequest("No file uploaded.");

            using var stream = file.OpenReadStream();
            var command = new ImportAttendanceCommand { FileStream = stream };
            
            var result = await sender.Send(command);
            
            return Results.Ok(result);
        })
        .WithName("ImportAttendances");

        // Admin: Download Attendance Template
        group.MapGet("/template", () =>
        {
            var records = new[]
            {
                new { Username = "NV001", Date = DateTime.Today.ToString("yyyy-MM-dd"), CheckIn = "08:00", CheckOut = "17:00", Notes = "Đi làm đúng giờ" }
            };
            
            var stream = new MemoryStream();
            MiniExcelLibs.MiniExcel.SaveAs(stream, records);
            stream.Position = 0;
            
            return Results.File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Attendance_Import_Template.xlsx");
        })
        .WithName("DownloadAttendanceTemplate");

        return group;
    }
}
