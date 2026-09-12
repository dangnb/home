using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Features.EquipmentRepairs.Commands;
using HrmPlatform.Application.Features.EquipmentRepairs.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HrmPlatform.WebApi.Controllers;

[ApiController]
[Route("api/v1/equipment-repairs")]
public class EquipmentRepairsController : ControllerBase
{
    private readonly ISender _sender;

    public EquipmentRepairsController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy danh sách phiếu báo hỏng & sửa chữa thiết bị IT
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? keyword,
        [FromQuery] string? status,
        [FromQuery] string? priority,
        [FromQuery] long? technicianUserId,
        [FromQuery] long? equipmentId,
        [FromQuery] DateOnly? fromDate,
        [FromQuery] DateOnly? toDate,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetEquipmentRepairsQuery
        {
            Keyword = keyword,
            Status = status,
            Priority = priority,
            TechnicianUserId = technicianUserId,
            EquipmentId = equipmentId,
            FromDate = fromDate,
            ToDate = toDate,
            Page = page,
            PageSize = pageSize
        }, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết phiếu sửa chữa IT
    /// </summary>
    [HttpGet("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(long id, CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetEquipmentRepairByIdQuery(id), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Tạo mới phiếu yêu cầu báo hỏng & sửa chữa thiết bị IT
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateEquipmentRepairCommand command, CancellationToken cancellationToken)
    {
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(Create), new { id }, new { success = true, id, message = "Tạo phiếu báo hỏng sửa chữa IT thành công." });
    }

    /// <summary>
    /// Phân công nhân viên IT chịu trách nhiệm sửa chữa
    /// </summary>
    [HttpPut("{id:long}/assign")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AssignTechnician(long id, [FromBody] AssignTechnicianRequest request, CancellationToken cancellationToken)
    {
        var command = new AssignTechnicianCommand
        {
            RepairId = id,
            TechnicianUserId = request.TechnicianUserId
        };

        await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, message = "Đã phân công nhân viên IT sửa chữa thành công." });
    }

    /// <summary>
    /// Nhân viên IT cập nhật tiến độ, lỗi thực tế, cách khắc phục, linh kiện thay thế và chi phí
    /// </summary>
    [HttpPut("{id:long}/progress")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateProgress(long id, [FromBody] UpdateRepairProgressRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateRepairProgressCommand
        {
            RepairId = id,
            Status = request.Status,
            ActualError = request.ActualError,
            SolutionDetail = request.SolutionDetail,
            ReplacedParts = request.ReplacedParts,
            RepairCost = request.RepairCost,
            Note = request.Note
        };

        await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, message = "Đã cập nhật tiến độ & nhật ký sửa chữa thành công." });
    }
}

public record AssignTechnicianRequest(long TechnicianUserId);
public record UpdateRepairProgressRequest(
    string Status, 
    string? ActualError = null, 
    string? SolutionDetail = null, 
    string? ReplacedParts = null, 
    decimal? RepairCost = null, 
    string? Note = null);
