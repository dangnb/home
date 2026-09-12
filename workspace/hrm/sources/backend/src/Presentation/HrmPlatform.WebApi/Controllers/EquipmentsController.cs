using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Features.Equipments.Commands;
using HrmPlatform.Application.Features.Equipments.Queries;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HrmPlatform.WebApi.Controllers;

[ApiController]
[Route("api/v1/equipments")]
public class EquipmentsController : ControllerBase
{
    private readonly ISender _sender;

    public EquipmentsController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy danh sách trang thiết bị kèm tổng quan thống kê (Dapper Read)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? keyword,
        [FromQuery] string? category,
        [FromQuery] string? status,
        [FromQuery] long? departmentId,
        [FromQuery] long? currentUserId,
        [FromQuery] DateOnly? assignedFromDate,
        [FromQuery] DateOnly? assignedToDate,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetEquipmentsQuery
        {
            Keyword = keyword,
            Category = category,
            Status = status,
            DepartmentId = departmentId,
            CurrentUserId = currentUserId,
            AssignedFromDate = assignedFromDate,
            AssignedToDate = assignedToDate,
            Page = page,
            PageSize = pageSize
        }, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Lấy chi tiết trang thiết bị kèm lịch sử bàn giao/thu hồi/báo hỏng
    /// </summary>
    [HttpGet("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(long id, CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetEquipmentByIdQuery { Id = id }, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Tạo mới thông tin trang thiết bị
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateEquipmentCommand command, CancellationToken cancellationToken)
    {
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(Create), new { id }, new { success = true, id, message = "Khai báo trang thiết bị mới thành công." });
    }

    /// <summary>
    /// Bàn giao trang thiết bị cho nhân sự hoặc phòng ban
    /// </summary>
    [HttpPost("{id:long}/handover")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Handover(long id, [FromBody] HandoverEquipmentRequest request, CancellationToken cancellationToken)
    {
        var command = new HandoverEquipmentCommand
        {
            EquipmentId = id,
            TargetType = request.TargetType ?? "EMPLOYEE",
            TargetUserId = request.TargetUserId,
            TargetDepartmentId = request.TargetDepartmentId,
            ConditionStatus = request.ConditionStatus,
            Note = request.Note
        };

        await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, message = "Đã bàn giao trang thiết bị thành công." });
    }

    /// <summary>
    /// Bàn giao hàng loạt nhiều trang thiết bị cùng một lúc
    /// </summary>
    [HttpPost("handover-batch")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> HandoverBatch([FromBody] BulkHandoverEquipmentsCommand command, CancellationToken cancellationToken)
    {
        var count = await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, count, message = $"Đã bàn giao hàng loạt thành công {count} trang thiết bị." });
    }

    /// <summary>
    /// Thu hồi trang thiết bị về kho
    /// </summary>
    [HttpPost("{id:long}/revoke")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Revoke(long id, [FromBody] RevokeEquipmentRequest request, CancellationToken cancellationToken)
    {
        var command = new RevokeEquipmentCommand
        {
            EquipmentId = id,
            ConditionStatus = request.ConditionStatus,
            Note = request.Note
        };

        await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, message = "Đã thu hồi trang thiết bị về kho thành công." });
    }

    /// <summary>
    /// Thu hồi hàng loạt nhiều trang thiết bị về kho cùng một lúc
    /// </summary>
    [HttpPost("revoke-batch")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RevokeBatch([FromBody] BulkRevokeEquipmentsCommand command, CancellationToken cancellationToken)
    {
        var count = await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, count, message = $"Đã thu hồi hàng loạt thành công {count} trang thiết bị về kho." });
    }

    /// <summary>
    /// Báo hỏng sự cố trang thiết bị
    /// </summary>
    [HttpPost("{id:long}/report-broken")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ReportBroken(long id, [FromBody] ReportBrokenEquipmentRequest request, CancellationToken cancellationToken)
    {
        var command = new ReportBrokenEquipmentCommand
        {
            EquipmentId = id,
            Description = request.Description,
            Note = request.Note
        };

        await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, message = "Đã ghi nhận báo hỏng trang thiết bị thành công." });
    }

    /// <summary>
    /// Cập nhật thông tin trang thiết bị
    /// </summary>
    [HttpPut("{id:long}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateEquipmentCommand command, CancellationToken cancellationToken)
    {
        command.Id = id;
        await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, message = "Đã cập nhật thông tin trang thiết bị thành công." });
    }
}

public record HandoverEquipmentRequest(string? TargetType = "EMPLOYEE", long? TargetUserId = null, long? TargetDepartmentId = null, string? ConditionStatus = null, string? Note = null);
public record RevokeEquipmentRequest(string? ConditionStatus = null, string? Note = null);
public record ReportBrokenEquipmentRequest(string Description, string? Note = null);
