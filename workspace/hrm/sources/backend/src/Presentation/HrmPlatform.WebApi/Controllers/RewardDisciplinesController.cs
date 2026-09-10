using HrmPlatform.Application.Features.RewardDisciplines.Commands;
using HrmPlatform.Application.Features.RewardDisciplines.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HrmPlatform.WebApi.Controllers;

[ApiController]
[Route("api/v1/reward-disciplines")]
public class RewardDisciplinesController : ControllerBase
{
    private readonly ISender _sender;

    public RewardDisciplinesController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy danh sách quyết định khen thưởng / kỷ luật có phân trang & lọc
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] long? employeeId,
        [FromQuery] string? type,
        [FromQuery] string? category,
        [FromQuery] string? status,
        [FromQuery] string? keyword,
        [FromQuery] string? fromDate,
        [FromQuery] string? toDate,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetRewardDisciplinesQuery
        {
            EmployeeId = employeeId,
            Type = type,
            Category = category,
            Status = status,
            Keyword = keyword,
            FromDate = fromDate,
            ToDate = toDate,
            Page = page,
            PageSize = pageSize
        }, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Lấy thống kê tổng quan KPI thưởng/phạt
    /// </summary>
    [HttpGet("summary")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSummary(CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetRewardDisciplineSummaryQuery(), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết quyết định thưởng/phạt theo ID
    /// </summary>
    [HttpGet("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(long id, CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetRewardDisciplineByIdQuery { Id = id }, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Tạo mới quyết định thưởng/phạt
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateRewardDisciplineCommand command, CancellationToken cancellationToken = default)
    {
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, new { success = true, id, message = "Đã tạo quyết định thưởng/phạt thành công." });
    }

    /// <summary>
    /// Cập nhật thông tin quyết định thưởng/phạt
    /// </summary>
    [HttpPut("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateRewardDisciplineCommand command, CancellationToken cancellationToken = default)
    {
        if (id != command.Id)
        {
            return BadRequest(new { message = "ID quyết định không khớp." });
        }

        await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, message = "Đã cập nhật thông tin quyết định thưởng/phạt thành công." });
    }

    /// <summary>
    /// Phê duyệt quyết định Thưởng / Kỷ luật
    /// </summary>
    [HttpPost("{id:long}/approve")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Approve(long id, CancellationToken cancellationToken = default)
    {
        await _sender.Send(new ApproveRewardDisciplineCommand { Id = id }, cancellationToken);
        return Ok(new { success = true, message = "Đã phê duyệt quyết định Thưởng/Kỷ luật thành công!" });
    }

    /// <summary>
    /// Từ chối quyết định Thưởng / Kỷ luật
    /// </summary>
    [HttpPost("{id:long}/reject")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Reject(long id, [FromBody] RejectRewardDisciplineRequest request, CancellationToken cancellationToken = default)
    {
        await _sender.Send(new RejectRewardDisciplineCommand { Id = id, Reason = request.Reason }, cancellationToken);
        return Ok(new { success = true, message = "Đã từ chối quyết định Thưởng/Kỷ luật thành công." });
    }

    /// <summary>
    /// Xóa quyết định thưởng/phạt
    /// </summary>
    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken = default)
    {
        await _sender.Send(new DeleteRewardDisciplineCommand { Id = id }, cancellationToken);
        return Ok(new { success = true, message = "Đã xóa quyết định thưởng/phạt thành công." });
    }

    /// <summary>
    /// Xuất giao diện mẫu Quyết định chuẩn để in ấn / lưu PDF
    /// </summary>
    [HttpGet("{id:long}/export/html")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ExportHtml(long id, CancellationToken cancellationToken = default)
    {
        var dto = await _sender.Send(new GetRewardDisciplineByIdQuery { Id = id }, cancellationToken);
        var html = HrmPlatform.Application.Features.RewardDisciplines.Export.RewardDisciplineDocumentExporter.GenerateHtmlDocument(dto);
        return Content(html, "text/html; charset=utf-8");
    }

    /// <summary>
    /// Xuất File Word (.doc) Quyết định khen thưởng / kỷ luật
    /// </summary>
    [HttpGet("{id:long}/export/word")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ExportWord(long id, CancellationToken cancellationToken = default)
    {
        var dto = await _sender.Send(new GetRewardDisciplineByIdQuery { Id = id }, cancellationToken);
        var html = HrmPlatform.Application.Features.RewardDisciplines.Export.RewardDisciplineDocumentExporter.GenerateHtmlDocument(dto);
        var bytes = System.Text.Encoding.UTF8.GetBytes(html);
        var fileName = $"{dto.DecisionNumber ?? $"Quyết_định_{dto.Id}"}.doc".Replace('/', '_');
        return File(bytes, "application/msword", fileName);
    }
}

public class RejectRewardDisciplineRequest
{
    public string Reason { get; set; } = string.Empty;
}
