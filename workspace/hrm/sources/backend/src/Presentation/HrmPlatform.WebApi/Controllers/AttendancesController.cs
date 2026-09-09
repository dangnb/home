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
