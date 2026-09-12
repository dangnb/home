using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Features.Assets.Commands;
using HrmPlatform.Application.Features.Assets.Queries;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HrmPlatform.WebApi.Controllers;

[ApiController]
[Route("api/v1/assets")]
public class AssetsController : ControllerBase
{
    private readonly ISender _sender;

    public AssetsController(ISender sender)
    {
        _sender = sender;
    }

    /// <summary>
    /// Lấy danh sách hồ sơ tài sản & thiết bị (phân trang, lọc theo danh mục, trạng thái)
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? keyword,
        [FromQuery] AssetCategory? category,
        [FromQuery] AssetStatus? status,
        [FromQuery] long? assigneeUserId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var result = await _sender.Send(new GetAssetsQuery
        {
            Keyword = keyword,
            Category = category,
            Status = status,
            AssigneeUserId = assigneeUserId,
            Page = page,
            PageSize = pageSize
        }, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// Nhân sự xem danh sách tài sản hiện đang được gán cho chính mình (asset:read)
    /// </summary>
    [HttpGet("my-assets")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyAssets(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetMyAssetsQuery(), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Dashboard báo cáo tổng quan tỷ lệ bận/rảnh & giá trị tài sản
    /// </summary>
    [HttpGet("dashboard")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDashboard(CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetAssetDashboardQuery(), cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Khai báo hồ sơ tài sản mới
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateAssetCommand command, CancellationToken cancellationToken)
    {
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(Create), new { id }, new { success = true, id, message = "Khai báo tài sản thành công." });
    }

    /// <summary>
    /// Nghiệp vụ Cấp phát (Allocate) tài sản cho nhân sự
    /// </summary>
    [HttpPost("{id:long}/allocate")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Allocate(long id, [FromBody] AllocateAssetRequest request, CancellationToken cancellationToken)
    {
        var command = new AllocateAssetCommand
        {
            AssetId = id,
            AssigneeUserId = request.AssigneeUserId,
            ConditionNotes = request.ConditionNotes
        };

        var txId = await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, transactionId = txId, message = "Đã thực hiện cấp phát tài sản thành công." });
    }

    /// <summary>
    /// Nghiệp vụ Thu hồi (Recover) tài sản về kho
    /// </summary>
    [HttpPost("{id:long}/recover")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Recover(long id, [FromBody] RecoverAssetRequest request, CancellationToken cancellationToken)
    {
        var command = new RecoverAssetCommand
        {
            AssetId = id,
            ConditionNotes = request.ConditionNotes
        };

        var txId = await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, transactionId = txId, message = "Đã thu hồi tài sản về kho thành công." });
    }

    /// <summary>
    /// Tự động thu hồi toàn bộ tài sản khi nhân viên thôi việc (Offboarding Cross-module Integration)
    /// </summary>
    [HttpPost("offboarding-recover")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> OffboardingRecover([FromBody] OffboardingRecoverAssetsCommand command, CancellationToken cancellationToken)
    {
        var count = await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, count, message = $"Tự động thu hồi thành công {count} tài sản của nhân sự thôi việc." });
    }

    /// <summary>
    /// Tạo phiếu báo hỏng & yêu cầu sửa chữa bảo trì tài sản (Maintenance Flow)
    /// </summary>
    [HttpPost("{id:long}/maintenance-tickets")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateMaintenanceTicket(long id, [FromBody] CreateMaintenanceTicketRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateMaintenanceTicketCommand
        {
            AssetId = id,
            IssueDescription = request.IssueDescription
        };

        var ticketId = await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, ticketId, message = "Đã ghi nhận phiếu báo hỏng & yêu cầu bảo trì tài sản thành công." });
    }

    /// <summary>
    /// Kỹ thuật viên hoàn tất xử lý sửa chữa bảo trì tài sản (Resolve Maintenance Ticket)
    /// </summary>
    [HttpPost("maintenance-tickets/{ticketId:long}/resolve")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResolveMaintenanceTicket(long ticketId, [FromBody] ResolveMaintenanceTicketCommand command, CancellationToken cancellationToken)
    {
        command.TicketId = ticketId;
        await _sender.Send(command, cancellationToken);
        return Ok(new { success = true, message = "Hoàn tất xử lý bảo trì tài sản thành công." });
    }
}

public record AllocateAssetRequest(long AssigneeUserId, string? ConditionNotes = null);
public record RecoverAssetRequest(string? ConditionNotes = null);
public record CreateMaintenanceTicketRequest(string IssueDescription);
