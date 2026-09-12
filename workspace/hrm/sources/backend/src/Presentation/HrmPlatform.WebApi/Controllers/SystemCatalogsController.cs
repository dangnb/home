using HrmPlatform.Application.Features.SystemCatalogs.Commands;
using HrmPlatform.Application.Features.SystemCatalogs.Queries;
using HrmPlatform.WebApi.Authorization;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HrmPlatform.WebApi.Controllers;

/// <summary>
/// API Quản Lý Danh Mục Hệ Thống (System Configuration / Catalog)
/// Route: /api/v1/config
/// </summary>
[ApiController]
[Route("api/v1/config")]
[Authorize]
public class SystemCatalogsController : ControllerBase
{
    private readonly ISender _sender;

    public SystemCatalogsController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy danh sách danh mục theo loại (dành cho dropdown, public với mọi user đã đăng nhập)
    /// GET /api/v1/config/{type}?activeOnly=true
    /// </summary>
    [HttpGet("{type}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByType(string type, [FromQuery] bool activeOnly = true, CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetSystemCatalogsQuery
        {
            CatalogType = type,
            ActiveOnly = activeOnly
        }, cancellationToken);

        return Ok(new { success = true, data = result, total = result.Count });
    }

    /// <summary>
    /// Lấy tất cả danh mục phân nhóm theo loại (dành cho trang Admin Danh Mục)
    /// GET /api/v1/config/all-grouped
    /// </summary>
    [HttpGet("all-grouped")]
    [HasPermission("config:manage")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllGrouped(CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetAllSystemCatalogsGroupedQuery(), cancellationToken);
        return Ok(new { success = true, data = result });
    }

    /// <summary>
    /// Tạo mới danh mục trong một loại
    /// POST /api/v1/config/{type}
    /// </summary>
    [HttpPost("{type}")]
    [HasPermission("config:manage")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(string type, [FromBody] CreateSystemCatalogRequest request, CancellationToken cancellationToken)
    {
        var id = await _sender.Send(new CreateSystemCatalogCommand
        {
            CatalogType = type,
            Code = request.Code,
            Name = request.Name,
            Description = request.Description,
            SortOrder = request.SortOrder
        }, cancellationToken);

        return CreatedAtAction(nameof(Create), new { type, id }, new { success = true, id });
    }

    /// <summary>
    /// Cập nhật danh mục
    /// PUT /api/v1/config/{type}/{id}
    /// </summary>
    [HttpPut("{type}/{id:long}")]
    [HasPermission("config:manage")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(string type, long id, [FromBody] UpdateSystemCatalogRequest request, CancellationToken cancellationToken)
    {
        await _sender.Send(new UpdateSystemCatalogCommand
        {
            Id = id,
            Name = request.Name,
            Description = request.Description,
            SortOrder = request.SortOrder
        }, cancellationToken);

        return Ok(new { success = true, message = "Cập nhật danh mục thành công." });
    }

    /// <summary>
    /// Bật/Tắt danh mục (kích hoạt / vô hiệu hóa)
    /// PATCH /api/v1/config/{type}/{id}/status?activate=true
    /// </summary>
    [HttpPatch("{type}/{id:long}/status")]
    [HasPermission("config:manage")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ToggleStatus(string type, long id, [FromQuery] bool activate, CancellationToken cancellationToken)
    {
        await _sender.Send(new ToggleSystemCatalogStatusCommand(id, activate), cancellationToken);
        var action = activate ? "kích hoạt" : "vô hiệu hóa";
        return Ok(new { success = true, message = $"Đã {action} danh mục thành công." });
    }

    /// <summary>
    /// Xóa mềm danh mục
    /// DELETE /api/v1/config/{type}/{id}
    /// </summary>
    [HttpDelete("{type}/{id:long}")]
    [HasPermission("config:manage")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string type, long id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteSystemCatalogCommand(id), cancellationToken);
        return NoContent();
    }
}

// ============================================================
// Request DTOs (internal to controller layer)
// ============================================================
public record CreateSystemCatalogRequest(string Code, string Name, string? Description, int SortOrder = 0);
public record UpdateSystemCatalogRequest(string Name, string? Description, int SortOrder = 0);
