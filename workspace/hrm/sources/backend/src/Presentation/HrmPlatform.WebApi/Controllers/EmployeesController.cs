using HrmPlatform.Application.Features.Employees.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HrmPlatform.WebApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly ISender _sender;

    public EmployeesController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy danh sách hồ sơ nhân sự (Dapper Read)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? keyword,
        [FromQuery] long? departmentId,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new HrmPlatform.Application.Features.Employees.Queries.GetEmployeesQuery
        {
            Keyword = keyword,
            DepartmentId = departmentId,
            Status = status,
            Page = page,
            PageSize = pageSize
        }, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Lấy danh sách chọn nhanh nhân sự tinh gọn cho Select Dropdown (Public/All Users)
    /// </summary>
    [HttpGet("lookup")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLookup(
        [FromQuery] string? keyword,
        [FromQuery] long? departmentId,
        [FromQuery] int limit = 200,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new HrmPlatform.Application.Features.Employees.Queries.GetEmployeeLookupQuery
        {
            Keyword = keyword,
            DepartmentId = departmentId,
            Limit = limit
        }, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết hồ sơ nhân sự theo ID (Dapper Read)
    /// </summary>
    [HttpGet("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(long id, CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new HrmPlatform.Application.Features.Employees.Queries.GetEmployeeByIdQuery { Id = id }, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Thêm mới nhân sự (Tạo tài khoản User và Hồ sơ nhân viên)
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeCommand command, CancellationToken cancellationToken)
    {
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(Create), new { id }, new { success = true, id });
    }

    /// <summary>
    /// Nhập hàng loạt nhân sự từ file Excel
    /// </summary>
    [HttpPost("import")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Import([FromBody] ImportEmployeesCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, data = result });
    }

    /// <summary>
    /// Cập nhật thông tin hồ sơ nhân viên
    /// </summary>
    [HttpPut("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateEmployeeCommand command, CancellationToken cancellationToken)
    {
        if (id != command.Id)
        {
            return BadRequest(new { success = false, message = "ID trên URL không khớp với dữ liệu gửi lên." });
        }

        await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, message = "Cập nhật hồ sơ nhân sự thành công." });
    }

    /// <summary>
    /// Xóa mềm hồ sơ nhân sự và vô hiệu hóa tài khoản
    /// </summary>
    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteEmployeeCommand(id), cancellationToken);
        return NoContent();
    }
}
