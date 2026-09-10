using HrmPlatform.Application.Features.EmployeeTransfers.Commands;
using HrmPlatform.Application.Features.EmployeeTransfers.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HrmPlatform.WebApi.Controllers;

[ApiController]
[Route("api/v1/employee-transfers")]
public class EmployeeTransfersController : ControllerBase
{
    private readonly ISender _sender;

    public EmployeeTransfersController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy danh sách Lệnh điều động / Biến động công tác (Dapper Paginated Read)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] long? employeeId,
        [FromQuery] string? changeType,
        [FromQuery] string? approvalStatus,
        [FromQuery] string? keyword,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetEmployeeTransfersQuery
        {
            EmployeeId = employeeId,
            ChangeType = changeType,
            ApprovalStatus = approvalStatus,
            Keyword = keyword,
            Page = page,
            PageSize = pageSize
        }, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Lấy thống kê tổng quan Lệnh điều động
    /// </summary>
    [HttpGet("summary")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSummary(CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetEmployeeTransferSummaryQuery(), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Tạo mới Lệnh điều động (Trình duyệt PENDING_APPROVAL)
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeTransferCommand command, CancellationToken cancellationToken = default)
    {
        var id = await _sender.Send(command, cancellationToken);
        return Created("", new { id, succeeded = true, message = "Đã gửi trình duyệt Lệnh điều động nhân sự thành công." });
    }

    /// <summary>
    /// Phê duyệt Lệnh điều động + Tự động đồng bộ Hồ sơ nhân sự
    /// </summary>
    [HttpPost("{id:long}/approve")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Approve(long id, CancellationToken cancellationToken = default)
    {
        await _sender.Send(new ApproveEmployeeTransferCommand { Id = id }, cancellationToken);
        return Ok(new { succeeded = true, message = "Đã phê duyệt Lệnh điều động và cập nhật Hồ sơ nhân sự thành công!" });
    }

    /// <summary>
    /// Từ chối Lệnh điều động công tác
    /// </summary>
    [HttpPost("{id:long}/reject")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Reject(long id, [FromBody] RejectEmployeeTransferRequest request, CancellationToken cancellationToken = default)
    {
        await _sender.Send(new RejectEmployeeTransferCommand { Id = id, Reason = request.Reason }, cancellationToken);
        return Ok(new { succeeded = true, message = "Đã từ chối Lệnh điều động thành công." });
    }

    /// <summary>
    /// Phê duyệt cấp tiếp theo trong Quy trình Phê duyệt Multi-Step (Cấp 1..4)
    /// </summary>
    [HttpPost("{id:long}/approve-step")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ApproveStep(long id, [FromBody] ApproveStepRequest request, CancellationToken cancellationToken = default)
    {
        await _sender.Send(new ApproveEmployeeTransferStepCommand { Id = id, Step = request.Step, Note = request.Note }, cancellationToken);
        return Ok(new { succeeded = true, message = $"Đã phê duyệt Cấp {request.Step} thành công!" });
    }

    /// <summary>
    /// Bước 5: Nhân viên Tiếp nhận & Xác nhận Lệnh điều động
    /// </summary>
    [HttpPost("{id:long}/acknowledge")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Acknowledge(long id, [FromBody] AcknowledgeTransferRequest request, CancellationToken cancellationToken = default)
    {
        await _sender.Send(new AcknowledgeEmployeeTransferCommand { Id = id, Note = request.Note }, cancellationToken);
        return Ok(new { succeeded = true, message = "Nhân viên đã xác nhận đồng ý tiếp nhận Lệnh điều động!" });
    }

    /// <summary>
    /// Xóa Lệnh điều động
    /// </summary>
    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken = default)
    {
        await _sender.Send(new DeleteEmployeeTransferCommand(id), cancellationToken);
        return Ok(new { succeeded = true, message = "Đã xóa Lệnh điều động thành công." });
    }
}

public class RejectEmployeeTransferRequest
{
    public string Reason { get; set; } = string.Empty;
}

public class ApproveStepRequest
{
    public int Step { get; set; }
    public string? Note { get; set; }
}

public class AcknowledgeTransferRequest
{
    public string? Note { get; set; }
}
