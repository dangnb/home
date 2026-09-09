using HrmPlatform.Application.Features.Users.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HrmPlatform.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly ISender _sender;

    public UsersController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Tạo mới tài khoản người dùng
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateUserCommand command, CancellationToken cancellationToken)
    {
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(Create), new { id }, new { success = true, id });
    }

    /// <summary>
    /// Cập nhật thông tin người dùng
    /// </summary>
    [HttpPut("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateUserCommand command, CancellationToken cancellationToken)
    {
        if (command.Id == 0 || command.Id == id)
        {
            command = command with { Id = id };
        }
        else if (id != command.Id)
        {
            return BadRequest(new { success = false, message = "ID trên URL không khớp với dữ liệu gửi lên." });
        }

        await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, message = "Cập nhật người dùng thành công." });
    }

    /// <summary>
    /// Xóa mềm tài khoản người dùng
    /// </summary>
    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteUserCommand(id), cancellationToken);
        return NoContent();
    }
}
