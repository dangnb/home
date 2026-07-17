using MediatR;
using TapHoa.Application.SalaryTemplates.Commands;
using TapHoa.Application.SalaryTemplates.Queries;
using TapHoa.Domain.Enums;

namespace TapHoa.API.Endpoints;

public static class SalaryTemplateEndpoints
{
    public static void MapSalaryTemplateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("")
            .RequireAuthorization();

        group.MapGet("/", async (IMediator mediator) =>
        {
            return Results.Ok(await mediator.Send(new GetSalaryTemplatesQuery()));
        });

        group.MapPost("/", async (CreateSalaryTemplateCommand command, IMediator mediator) =>
        {
            return Results.Ok(await mediator.Send(command));
        });

        group.MapPut("/{id:guid}", async (Guid id, UpdateSalaryTemplateCommand command, IMediator mediator) =>
        {
            if (id != command.Id) return Results.BadRequest();
            var result = await mediator.Send(command);
            return result ? Results.Ok() : Results.NotFound();
        });

        group.MapDelete("/{id:guid}", async (Guid id, IMediator mediator) =>
        {
            var result = await mediator.Send(new DeleteSalaryTemplateCommand { Id = id });
            return result ? Results.Ok() : Results.NotFound();
        });
    }
}
