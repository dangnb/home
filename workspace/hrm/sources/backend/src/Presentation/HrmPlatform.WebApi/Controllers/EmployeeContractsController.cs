using HrmPlatform.Application.Features.EmployeeContracts.Commands;
using HrmPlatform.Application.Features.EmployeeContracts.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HrmPlatform.WebApi.Controllers;

[ApiController]
[Route("api/v1/employee-contracts")]
public class EmployeeContractsController : ControllerBase
{
    private readonly ISender _sender;

    public EmployeeContractsController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy danh sách Hợp đồng Lao động (Dapper Paginated Read)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] long? employeeId,
        [FromQuery] string? contractType,
        [FromQuery] string? status,
        [FromQuery] bool? isExpiringSoon,
        [FromQuery] string? keyword,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetEmployeeContractsQuery
        {
            EmployeeId = employeeId,
            ContractType = contractType,
            Status = status,
            IsExpiringSoon = isExpiringSoon,
            Keyword = keyword,
            Page = page,
            PageSize = pageSize
        }, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Lấy tổng quan thống kê hợp đồng
    /// </summary>
    [HttpGet("summary")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSummary(CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetEmployeeContractSummaryQuery(), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết Hợp đồng theo ID
    /// </summary>
    [HttpGet("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(long id, CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetEmployeeContractByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Tạo mới Hợp đồng Lao động
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeContractCommand command, CancellationToken cancellationToken = default)
    {
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, new { id, succeeded = true, message = "Đã tạo mới Hợp đồng Lao động thành công." });
    }

    /// <summary>
    /// Cập nhật Hợp đồng Lao động
    /// </summary>
    [HttpPut("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateEmployeeContractCommand command, CancellationToken cancellationToken = default)
    {
        command.Id = id;
        await _sender.Send(command, cancellationToken);
        return Ok(new { succeeded = true, message = "Đã cập nhật Hợp đồng Lao động thành công." });
    }

    /// <summary>
    /// Xóa Hợp đồng Lao động
    /// </summary>
    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken = default)
    {
        await _sender.Send(new DeleteEmployeeContractCommand(id), cancellationToken);
        return Ok(new { succeeded = true, message = "Đã xóa Hợp đồng Lao động thành công." });
    }
}
