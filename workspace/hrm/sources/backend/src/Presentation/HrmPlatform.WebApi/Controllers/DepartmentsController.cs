using HrmPlatform.Application.Features.Departments.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HrmPlatform.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly ISender _sender;

    public DepartmentsController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy danh sách phòng ban (Dapper Read)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new HrmPlatform.Application.Features.Departments.Queries.GetDepartmentsQuery
        {
            Status = status,
            Page = page,
            PageSize = pageSize
        }, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết phòng ban theo ID (Dapper Read)
    /// </summary>
    [HttpGet("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(long id, CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new HrmPlatform.Application.Features.Departments.Queries.GetDepartmentByIdQuery { Id = id }, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Tạo mới phòng ban trong doanh nghiệp
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateDepartmentCommand command, CancellationToken cancellationToken)
    {
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(Create), new { id }, new { success = true, id });
    }

    /// <summary>
    /// Cập nhật thông tin phòng ban
    /// </summary>
    [HttpPut("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateDepartmentCommand command, CancellationToken cancellationToken)
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
        return Ok(new { success = true, message = "Cập nhật phòng ban thành công." });
    }

    /// <summary>
    /// Xóa mềm phòng ban
    /// </summary>
    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteDepartmentCommand(id), cancellationToken);
        return NoContent();
    }
}
