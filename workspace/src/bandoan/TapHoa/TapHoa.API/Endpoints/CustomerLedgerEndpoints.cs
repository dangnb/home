using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.CustomerLedger.Commands;
using TapHoa.Application.CustomerLedger.Queries;

namespace TapHoa.API.Endpoints;

public static class CustomerLedgerEndpoints
{
    public static RouteGroupBuilder MapCustomerLedgerEndpoints(this RouteGroupBuilder group)
    {
        group.RequireAuthorization();

        group.MapPost("/", async ([FromBody] RecordDebtCommand command, [FromServices] ISender sender) =>
        {
            var id = await sender.Send(command);
            return Results.Ok(new { Id = id, Message = "Ghi nợ thành công." });
        })
        .WithName("RecordDebt")
        .WithDescription("Ghi sổ nợ mới cho khách hàng");

        group.MapPost("/{id:guid}/pay", async (Guid id, [FromBody] PayDebtCommand command, [FromServices] ISender sender) =>
        {
            if (id != command.DebtId) return Results.BadRequest("ID mismatch");

            var result = await sender.Send(command);
            return result ? Results.Ok(new { Message = "Thanh toán nợ thành công." }) : Results.NotFound();
        })
        .WithName("PayDebt")
        .WithDescription("Thanh toán nợ");

        group.MapGet("/", async ([FromServices] ISender sender) =>
        {
            var result = await sender.Send(new GetCustomerDebtsQuery());
            return Results.Ok(result);
        })
        .WithName("GetCustomerDebts")
        .WithDescription("Lấy danh sách nợ của tất cả khách hàng");

        return group;
    }
}
