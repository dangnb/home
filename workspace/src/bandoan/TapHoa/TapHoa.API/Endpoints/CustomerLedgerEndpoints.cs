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
        group.MapGet("/{customerId:guid}/transactions", async (Guid customerId, [FromServices] ISender sender) =>
        {
            var result = await sender.Send(new GetCustomerDebtTransactionsQuery(customerId));
            return Results.Ok(result);
        })
        .WithName("GetCustomerDebtTransactions")
        .WithDescription("Lấy danh sách lịch sử nợ và thanh toán của khách hàng");

        group.MapPost("/transactions/{transactionId:guid}/pay", async (Guid transactionId, [FromBody] PaySpecificDebtCommand command, [FromServices] ISender sender) =>
        {
            if (transactionId != command.TransactionId) return Results.BadRequest("ID mismatch");

            var result = await sender.Send(command);
            return result ? Results.Ok(new { Message = "Thanh toán thành công khoản nợ." }) : Results.NotFound();
        })
        .WithName("PaySpecificDebt")
        .WithDescription("Thanh toán cho một khoản nợ cụ thể");

        return group;
    }
}
