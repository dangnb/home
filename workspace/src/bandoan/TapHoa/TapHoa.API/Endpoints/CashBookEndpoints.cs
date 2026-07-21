using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.CashBook.Commands;
using TapHoa.Application.CashBook.Queries;

namespace TapHoa.API.Endpoints;

public static class CashBookEndpoints
{
    public static void MapCashBookEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("").WithTags("CashBook");

        // Danh sách bút toán (phân trang + lọc)
        group.MapGet("/", async (
            IMediator mediator,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] int? type = null,
            [FromQuery] string? category = null) =>
        {
            var result = await mediator.Send(new GetCashBookEntriesQuery
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                FromDate = fromDate,
                ToDate = toDate,
                Type = type,
                Category = category
            });
            return Results.Ok(result);
        });

        // Tổng hợp thu/chi theo khoảng thời gian
        group.MapGet("/summary", async (
            IMediator mediator,
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate) =>
        {
            var result = await mediator.Send(new GetCashBookSummaryQuery
            {
                FromDate = fromDate,
                ToDate = toDate
            });
            return Results.Ok(result);
        });

        // Tạo bút toán mới
        group.MapPost("/", async (IMediator mediator, [FromBody] CreateCashBookEntryCommand command) =>
        {
            var id = await mediator.Send(command);
            return Results.Created($"/api/v1/cashbook/{id}", new { id });
        });

        // Cập nhật bút toán
        group.MapPut("/{id:guid}", async (Guid id, IMediator mediator, [FromBody] UpdateCashBookEntryCommand command) =>
        {
            command.Id = id;
            var result = await mediator.Send(command);
            return result ? Results.NoContent() : Results.NotFound();
        });

        // Xóa bút toán
        group.MapDelete("/{id:guid}", async (Guid id, IMediator mediator) =>
        {
            var result = await mediator.Send(new DeleteCashBookEntryCommand { Id = id });
            return result ? Results.NoContent() : Results.NotFound();
        });
    }
}
