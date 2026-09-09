using HrmPlatform.Application.Features.Attendances.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HrmPlatform.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AttendancesController : ControllerBase
{
    private readonly ISender _sender;

    public AttendancesController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy danh sách lịch sử chấm công (Dapper Read)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] long? userId,
        [FromQuery] string? startDate,
        [FromQuery] string? endDate,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new HrmPlatform.Application.Features.Attendances.Queries.GetAttendancesQuery
        {
            UserId = userId,
            StartDate = startDate,
            EndDate = endDate
        }, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Lấy tổng hợp chấm công tháng (Dapper Read)
    /// </summary>
    [HttpGet("summary")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSummary(
        [FromQuery] long? userId,
        [FromQuery] int? year,
        [FromQuery] int? month,
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var result = await _sender.Send(new HrmPlatform.Application.Features.Attendances.Queries.GetAttendanceSummaryQuery
        {
            UserId = userId,
            Year = year ?? now.Year,
            Month = month ?? now.Month
        }, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Thực hiện Check-in chấm công
    /// </summary>
    [HttpPost("check-in")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CheckIn([FromBody] CheckInCommand command, CancellationToken cancellationToken)
    {
        var id = await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, attendanceId = id, message = "Check-in thành công." });
    }

    /// <summary>
    /// Thực hiện Check-out chấm công
    /// </summary>
    [HttpPost("check-out")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CheckOut([FromBody] CheckOutCommand command, CancellationToken cancellationToken)
    {
        await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, message = "Check-out thành công." });
    }
}
