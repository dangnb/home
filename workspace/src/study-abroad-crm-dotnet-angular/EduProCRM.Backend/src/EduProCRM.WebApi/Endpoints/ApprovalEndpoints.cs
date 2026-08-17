using EduProCRM.Application.Approvals.Commands;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace EduProCRM.WebApi.Endpoints;

public static class ApprovalEndpoints
{
    public static void MapApprovalEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/approvals")
                       .WithTags("Approvals - Phê Duyệt 2 Cấp (Mở Rộng #4)");

        // GET: Lấy danh sách đề xuất phê duyệt 2 cấp
        group.MapGet("/", async (IApprovalRepository repository, CancellationToken ct) =>
        {
            var list = await repository.GetPendingApprovalsAsync(ct);
            return Results.Ok(list);
        })
        .WithName("GetPendingApprovals")
        .Produces<IEnumerable<ApprovalRequestDto>>();

        // POST: Phê duyệt đề xuất (Cấp Giám đốc)
        group.MapPost("/{id:guid}/approve", async (
            Guid id,
            IMediator mediator,
            CancellationToken ct) =>
        {
            var command = new ApproveRequestCommand(id, "Nguyễn Văn Minh (Giám Đốc)");
            var success = await mediator.Send(command, ct);
            return success ? Results.Ok(new { Message = "Đã phê duyệt giao dịch thành công!" }) : Results.NotFound();
        })
        .WithName("ApproveRequest")
        .Produces(StatusCodes.Status200OK);
    }
}
