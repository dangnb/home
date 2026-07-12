using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.Payroll.Commands;
using TapHoa.Application.Payroll.Queries;

namespace TapHoa.API.Endpoints;

public static class PayrollEndpoints
{
    public static RouteGroupBuilder MapPayrollEndpoints(this RouteGroupBuilder group)
    {
        group.WithTags("Payroll").RequireAuthorization();

        // List payroll periods
        group.MapGet("/periods", async (ISender sender, [AsParameters] GetPayrollPeriodsQuery query) =>
        {
            var result = await sender.Send(query);
            return Results.Ok(result);
        })
        .WithName("GetPayrollPeriods");

        // Get payroll detail
        group.MapGet("/periods/{id}", async (ISender sender, Guid id) =>
        {
            var result = await sender.Send(new GetPayrollDetailQuery { PeriodId = id });
            return Results.Ok(result);
        })
        .WithName("GetPayrollDetail");

        // Create payroll period
        group.MapPost("/periods", async (ISender sender, CreatePayrollPeriodCommand command) =>
        {
            var id = await sender.Send(command);
            return Results.Ok(new { Id = id, Message = "Payroll period created successfully." });
        })
        .WithName("CreatePayrollPeriod");

        // Calculate payroll
        group.MapPost("/periods/{id}/calculate", async (ISender sender, Guid id, CalculatePayrollCommand command) =>
        {
            command.PeriodId = id;
            var result = await sender.Send(command);
            return result ? Results.Ok(new { Message = "Payroll calculated successfully." }) : Results.BadRequest();
        })
        .WithName("CalculatePayroll");

        // Approve payroll
        group.MapPut("/periods/{id}/approve", async (ISender sender, Guid id) =>
        {
            var result = await sender.Send(new ApprovePayrollCommand { PeriodId = id });
            return result ? Results.Ok(new { Message = "Payroll approved successfully." }) : Results.BadRequest();
        })
        .WithName("ApprovePayroll");

        // Update payroll entry
        group.MapPut("/entries/{id}", async (ISender sender, Guid id, UpdatePayrollEntryCommand command) =>
        {
            command.Id = id;
            var result = await sender.Send(command);
            return result ? Results.Ok(new { Message = "Entry updated successfully." }) : Results.BadRequest();
        })
        .WithName("UpdatePayrollEntry");

        return group;
    }
}
