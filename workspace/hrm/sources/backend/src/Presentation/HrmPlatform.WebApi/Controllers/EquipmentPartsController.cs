using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Features.EquipmentParts.Commands;
using HrmPlatform.Application.Features.EquipmentParts.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HrmPlatform.WebApi.Controllers;

[ApiController]
[Route("api/v1/equipment-parts")]
public class EquipmentPartsController : ControllerBase
{
    private readonly ISender _sender;

    public EquipmentPartsController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy danh sách linh kiện IT & tồn kho
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? keyword,
        [FromQuery] string? category,
        [FromQuery] bool? lowStockOnly,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetEquipmentPartsQuery
        {
            Keyword = keyword,
            Category = category,
            LowStockOnly = lowStockOnly,
            Page = page,
            PageSize = pageSize
        }, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Lookup danh sách linh kiện nhanh cho dropdown lựa chọn
    /// </summary>
    [HttpGet("lookup")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLookup([FromQuery] string? keyword, [FromQuery] int limit = 100, CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetEquipmentPartLookupQuery
        {
            Keyword = keyword,
            Limit = limit
        }, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Tạo mới linh kiện / vật tư sửa chữa IT
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateEquipmentPartCommand command, CancellationToken cancellationToken)
    {
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(Create), new { id }, new { success = true, id, message = "Thêm linh kiện IT mới vào kho thành công." });
    }

    /// <summary>
    /// Cập nhật thông tin linh kiện IT
    /// </summary>
    [HttpPut("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateEquipmentPartCommand command, CancellationToken cancellationToken)
    {
        command.Id = id;
        await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, message = "Cập nhật thông tin linh kiện thành công." });
    }

    /// <summary>
    /// Điều chỉnh nhanh số lượng tồn kho (Nhập/Xuất kho)
    /// </summary>
    [HttpPost("{id:long}/stock-adjust")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AdjustStock(long id, [FromBody] AdjustStockRequest request, CancellationToken cancellationToken)
    {
        var command = new AdjustEquipmentPartStockCommand
        {
            PartId = id,
            DeltaQuantity = request.DeltaQuantity
        };

        await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, message = "Cập nhật số lượng tồn kho thành công." });
    }

    /// <summary>
    /// Vô hiệu hóa / Xóa linh kiện
    /// </summary>
    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteEquipmentPartCommand(id), cancellationToken);
        return Ok(new { success = true, message = "Xóa linh kiện thành công." });
    }
}

public record AdjustStockRequest(int DeltaQuantity);
