using HrmPlatform.Application.Features.HrPolicies.Commands;
using HrmPlatform.Application.Features.HrPolicies.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HrmPlatform.WebApi.Controllers;

[ApiController]
[Route("api/v1/hr-policies")]
public class HrPoliciesController : ControllerBase
{
    private readonly ISender _sender;

    public HrPoliciesController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy danh sách Quy định & Chính sách HR Công ty (Dapper Paginated Read)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? category,
        [FromQuery] string? status,
        [FromQuery] string? keyword,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetHrPoliciesQuery
        {
            Category = category,
            Status = status,
            Keyword = keyword,
            Page = page,
            PageSize = pageSize
        }, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Lấy thống kê tổng quan danh mục chính sách HR
    /// </summary>
    [HttpGet("summary")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSummary(CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetHrPolicySummaryQuery(), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết bài viết Chính sách theo ID
    /// </summary>
    [HttpGet("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(long id, CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetHrPolicyByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Tạo mới bài viết Quy định / Chính sách HR
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateHrPolicyCommand command, CancellationToken cancellationToken = default)
    {
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, new { id, succeeded = true, message = "Đã ban hành bài viết Chính sách HR thành công." });
    }

    /// <summary>
    /// Cập nhật bài viết Chính sách HR
    /// </summary>
    [HttpPut("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateHrPolicyCommand command, CancellationToken cancellationToken = default)
    {
        command.Id = id;
        await _sender.Send(command, cancellationToken);
        return Ok(new { succeeded = true, message = "Đã cập nhật bài viết Chính sách HR thành công." });
    }

    /// <summary>
    /// Xóa bài viết Chính sách HR
    /// </summary>
    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken = default)
    {
        await _sender.Send(new DeleteHrPolicyCommand(id), cancellationToken);
        return Ok(new { succeeded = true, message = "Đã xóa bài viết Chính sách HR thành công." });
    }
}
