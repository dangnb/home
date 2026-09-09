using HrmPlatform.Application.Features.LeaveRequests.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HrmPlatform.WebApi.Controllers;

[ApiController]
[Route("api/v1/leave-requests")]
public class LeaveRequestsController : ControllerBase
{
    private readonly ISender _sender;

    public LeaveRequestsController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Tạo mới đơn xin nghỉ phép
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateLeaveRequestCommand command, CancellationToken cancellationToken)
    {
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(Create), new { id }, new { success = true, id, message = "Đã gửi đơn xin nghỉ phép thành công." });
    }

    /// <summary>
    /// Phê duyệt hoặc từ chối đơn xin nghỉ phép
    /// </summary>
    [HttpPost("{id:long}/approve")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Approve(long id, [FromBody] ApproveLeaveRequestRequest request, CancellationToken cancellationToken)
    {
        var command = new ApproveLeaveRequestCommand
        {
            Id = id,
            IsApproved = request.IsApproved
        };

        await _sender.Send(command, cancellationToken);
        var statusStr = request.IsApproved ? "phê duyệt" : "từ chối";
        return Ok(new { success = true, message = $"Đơn xin nghỉ phép đã được {statusStr} thành công." });
    }
}

public record ApproveLeaveRequestRequest(bool IsApproved);
