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
    /// Lấy danh sách đơn xin nghỉ phép/thôi việc (Dapper Read)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] long? userId,
        [FromQuery] string? status,
        [FromQuery] string? leaveType,
        [FromQuery] string? keyword,
        [FromQuery] string? fromDate,
        [FromQuery] string? toDate,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new HrmPlatform.Application.Features.LeaveRequests.Queries.GetLeaveRequestsQuery
        {
            UserId = userId,
            Status = status,
            LeaveType = leaveType,
            Keyword = keyword,
            FromDate = fromDate,
            ToDate = toDate,
            Page = page,
            PageSize = pageSize
        }, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết đơn xin nghỉ phép theo ID (Dapper Read)
    /// </summary>
    [HttpGet("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(long id, CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new HrmPlatform.Application.Features.LeaveRequests.Queries.GetLeaveRequestByIdQuery { Id = id }, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Tạo mới đơn xin nghỉ phép / thôi việc
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateLeaveRequestCommand command, CancellationToken cancellationToken)
    {
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(Create), new { id }, new { success = true, id, message = "Đã gửi đơn xin nghỉ phép/thôi việc thành công." });
    }

    /// <summary>
    /// Phê duyệt hoặc từ chối đơn xin nghỉ phép/thôi việc
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
            IsApproved = request.IsApproved,
            Comment = request.Comment
        };

        await _sender.Send(command, cancellationToken);
        var statusStr = request.IsApproved ? "phê duyệt" : "từ chối";
        return Ok(new { success = true, message = $"Đơn xin nghỉ phép/thôi việc đã được {statusStr} thành công." });
    }
}

public record ApproveLeaveRequestRequest(bool IsApproved, string? Comment = null);
