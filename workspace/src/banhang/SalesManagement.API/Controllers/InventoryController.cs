using MediatR;
using Microsoft.AspNetCore.Mvc;
using SalesManagement.Application.WMS.Commands;
using SalesManagement.Application.WMS.Queries;

namespace SalesManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InventoryController : ControllerBase
{
    private readonly IMediator _mediator;

    public InventoryController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("warehouses")]
    public async Task<IActionResult> GetWarehouses()
    {
        return Ok(await _mediator.Send(new GetWarehousesQuery()));
    }

    [HttpGet("transactions")]
    public async Task<IActionResult> GetTransactions()
    {
        return Ok(await _mediator.Send(new GetTransactionsQuery()));
    }

    [HttpPost("transactions")]
    public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionDto dto)
    {
        try {
            var id = await _mediator.Send(new CreateTransactionCommand(dto));
            return Ok(new { Id = id });
        }
        catch (Exception ex) {
            return BadRequest(new { Error = ex.Message });
        }
    }

    [HttpPost("transactions/{id}/approve")]
    public async Task<IActionResult> ApproveTransaction(Guid id)
    {
        try
        {
            var result = await _mediator.Send(new ApproveTransactionCommand(id));
            if (!result) return BadRequest("Phê duyệt thất bại.");
            return Ok(new { Message = "Phê duyệt phiếu thành công. Tồn kho và thẻ kho đã được cập nhật." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    [HttpGet("reports/ledger")]
    public async Task<IActionResult> GetStockLedger([FromQuery] Guid warehouseId, [FromQuery] Guid productId, [FromQuery] DateTime from, [FromQuery] DateTime to)
    {
        var result = await _mediator.Send(new GetStockLedgerReportQuery(warehouseId, productId, from, to));
        return Ok(result);
    }
}
