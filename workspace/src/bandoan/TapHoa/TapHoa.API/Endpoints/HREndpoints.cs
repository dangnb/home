using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using TapHoa.Application.HR.Commands;
using TapHoa.Application.HR.Queries;

namespace TapHoa.API.Endpoints;

public static class HREndpoints
{
    public static void MapHREndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("").RequireAuthorization();

        // Departments
        group.MapGet("/departments", async (IMediator mediator) =>
        {
            var result = await mediator.Send(new GetDepartmentsQuery());
            return Results.Ok(result);
        });

        group.MapPost("/departments", async (IMediator mediator, [FromBody] CreateDepartmentCommand command) =>
        {
            var id = await mediator.Send(command);
            return Results.Ok(id);
        });

        group.MapPut("/departments/{id:guid}", async (IMediator mediator, Guid id, [FromBody] UpdateDepartmentCommand command) =>
        {
            if (id != command.Id) return Results.BadRequest();
            await mediator.Send(command);
            return Results.NoContent();
        });

        group.MapDelete("/departments/{id:guid}", async (IMediator mediator, Guid id) =>
        {
            await mediator.Send(new DeleteDepartmentCommand(id));
            return Results.NoContent();
        });

        // Positions
        group.MapGet("/positions", async (IMediator mediator) =>
        {
            var result = await mediator.Send(new GetPositionsQuery());
            return Results.Ok(result);
        });

        group.MapPost("/positions", async (IMediator mediator, [FromBody] CreatePositionCommand command) =>
        {
            var id = await mediator.Send(command);
            return Results.Ok(id);
        });

        group.MapPut("/positions/{id:guid}", async (IMediator mediator, Guid id, [FromBody] UpdatePositionCommand command) =>
        {
            if (id != command.Id) return Results.BadRequest();
            await mediator.Send(command);
            return Results.NoContent();
        });

        group.MapDelete("/positions/{id:guid}", async (IMediator mediator, Guid id) =>
        {
            await mediator.Send(new DeletePositionCommand(id));
            return Results.NoContent();
        });

        // Employees
        group.MapGet("/employees", async (IMediator mediator) =>
        {
            var result = await mediator.Send(new GetEmployeesQuery());
            return Results.Ok(result);
        });

        group.MapPost("/employees", async (IMediator mediator, [FromBody] CreateEmployeeCommand command) =>
        {
            var id = await mediator.Send(command);
            return Results.Ok(id);
        });

        group.MapPut("/employees/{id:guid}", async (IMediator mediator, Guid id, [FromBody] UpdateEmployeeCommand command) =>
        {
            if (id != command.Id) return Results.BadRequest();
            await mediator.Send(command);
            return Results.NoContent();
        });

        group.MapDelete("/employees/{id:guid}", async (IMediator mediator, Guid id) =>
        {
            await mediator.Send(new DeleteEmployeeCommand(id));
            return Results.NoContent();
        });

        group.MapPost("/employees/upload", async (IMediator mediator, HttpRequest request) =>
        {
            if (!request.HasFormContentType || !request.Form.Files.Any())
                return Results.BadRequest("No file uploaded.");

            var file = request.Form.Files[0];
            using var reader = new System.IO.StreamReader(file.OpenReadStream());
            var content = await reader.ReadToEndAsync();
            
            var count = await mediator.Send(new ImportEmployeesCommand(content));
            return Results.Ok(new { importedCount = count });
        })
        .DisableAntiforgery();

        group.MapPost("/employees/{id:guid}/create-user", async (IMediator mediator, Guid id, [FromBody] CreateUserForEmployeeCommand command) =>
        {
            if (id != command.EmployeeId) return Results.BadRequest();
            try
            {
                var userId = await mediator.Send(command);
                return Results.Ok(new { userId });
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
        });

        group.MapPost("/employees/{id:guid}/reset-password", async (IMediator mediator, Guid id, [FromBody] ResetUserPasswordForEmployeeCommand command) =>
        {
            if (id != command.EmployeeId) return Results.BadRequest();
            try
            {
                await mediator.Send(command);
                return Results.NoContent();
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
        });
    }
}
