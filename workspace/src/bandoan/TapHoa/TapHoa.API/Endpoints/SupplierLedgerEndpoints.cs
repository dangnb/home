using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.SupplierLedger.Commands;
using TapHoa.Application.SupplierLedger.Queries;

namespace TapHoa.API.Endpoints;

public static class SupplierLedgerEndpoints
{
    public static void MapSupplierLedgerEndpoints(this RouteGroupBuilder app)
    {
        var group = app.WithTags("SupplierLedger").RequireAuthorization();

        group.MapGet("/", async ([FromServices] IMediator mediator) =>
        {
            var query = new GetSupplierDebtsQuery();
            var result = await mediator.Send(query);
            return Results.Ok(result);
        });

        group.MapGet("/{supplierId}/transactions", async (Guid supplierId, [FromServices] IMediator mediator) =>
        {
            var query = new GetSupplierDebtTransactionsQuery { SupplierId = supplierId };
            var result = await mediator.Send(query);
            return Results.Ok(result);
        });

        group.MapPost("/record", async ([FromBody] RecordSupplierDebtCommand command, [FromServices] IMediator mediator) =>
        {
            var debtId = await mediator.Send(command);
            return Results.Ok(new { DebtId = debtId });
        });

        group.MapPost("/pay", async ([FromBody] PaySupplierDebtCommand command, [FromServices] IMediator mediator) =>
        {
            var debtId = await mediator.Send(command);
            return Results.Ok(new { DebtId = debtId });
        });

        group.MapPost("/pay-specific", async ([FromBody] PaySpecificSupplierDebtCommand command, [FromServices] IMediator mediator) =>
        {
            var debtId = await mediator.Send(command);
            return Results.Ok(new { DebtId = debtId });
        });
    }
}
