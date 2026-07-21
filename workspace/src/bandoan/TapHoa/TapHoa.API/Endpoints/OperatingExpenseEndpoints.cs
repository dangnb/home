using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.OperatingExpenses.Commands;
using TapHoa.Application.OperatingExpenses.Queries;

namespace TapHoa.API.Endpoints;

public static class OperatingExpenseEndpoints
{
    public static void MapOperatingExpenseEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("").WithTags("OperatingExpenses");

        // Danh sách chi phí (phân trang + lọc)
        group.MapGet("/", async (
            IMediator mediator,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] int? month = null,
            [FromQuery] int? year = null,
            [FromQuery] int? paymentStatus = null,
            [FromQuery] string? searchTerm = null) =>
        {
            var result = await mediator.Send(new GetOperatingExpensesQuery
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                Month = month,
                Year = year,
                PaymentStatus = paymentStatus,
                SearchTerm = searchTerm
            });
            return Results.Ok(result);
        });

        // Tổng hợp chi phí theo tháng/năm
        group.MapGet("/summary", async (
            IMediator mediator,
            [FromQuery] int month,
            [FromQuery] int year) =>
        {
            var result = await mediator.Send(new GetExpenseSummaryQuery { Month = month, Year = year });
            return Results.Ok(result);
        });

        // Tạo chi phí mới
        group.MapPost("/", async (IMediator mediator, [FromBody] CreateOperatingExpenseCommand command) =>
        {
            var id = await mediator.Send(command);
            return Results.Created($"/api/v1/expenses/{id}", new { id });
        });

        // Cập nhật chi phí
        group.MapPut("/{id:guid}", async (Guid id, IMediator mediator, [FromBody] UpdateOperatingExpenseCommand command) =>
        {
            command.Id = id;
            var result = await mediator.Send(command);
            return result ? Results.NoContent() : Results.NotFound();
        });

        // Đánh dấu đã thanh toán
        group.MapPut("/{id:guid}/pay", async (Guid id, IMediator mediator, [FromBody] MarkExpensePaidCommand command) =>
        {
            command.Id = id;
            var result = await mediator.Send(command);
            return result ? Results.NoContent() : Results.NotFound();
        });

        // Xóa chi phí
        group.MapDelete("/{id:guid}", async (Guid id, IMediator mediator) =>
        {
            var result = await mediator.Send(new DeleteOperatingExpenseCommand { Id = id });
            return result ? Results.NoContent() : Results.NotFound();
        });
    }
}
