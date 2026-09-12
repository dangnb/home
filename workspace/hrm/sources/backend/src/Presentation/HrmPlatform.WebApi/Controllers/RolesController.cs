using HrmPlatform.Application.Features.Roles.Commands;
using HrmPlatform.Application.Features.Roles.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HrmPlatform.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class RolesController : ControllerBase
{
    private readonly ISender _sender;

    public RolesController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy danh sách toàn bộ vai trò kèm chi tiết số user và danh sách quyền đã gán
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetRolesWithDetailsQuery(), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết vai trò theo ID kèm danh sách quyền hạn
    /// </summary>
    [HttpGet("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(long id, CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetRoleByIdQuery { Id = id }, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Tạo mới một vai trò kèm danh sách quyền được cấp
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateRoleCommand command, CancellationToken cancellationToken)
    {
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, new { success = true, id });
    }

    /// <summary>
    /// Cập nhật thông tin vai trò và danh sách quyền hạn
    /// </summary>
    [HttpPut("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateRoleCommand command, CancellationToken cancellationToken)
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
        return Ok(new { success = true, message = "Cập nhật vai trò thành công." });
    }

    /// <summary>
    /// Xóa vai trò (chỉ xóa được vai trò tùy biến không có người dùng liên kết)
    /// </summary>
    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteRoleCommand(id), cancellationToken);
        return NoContent();
    }
}
