using MediatR;
using Microsoft.AspNetCore.Mvc;
using SalesManagement.Application.Purchasing.Commands;

namespace SalesManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PurchaseOrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public PurchaseOrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var result = await _mediator.Send(new SalesManagement.Application.Purchasing.Queries.GetPurchaseOrdersQuery());
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreatePurchaseOrderDto dto)
    {
        var id = await _mediator.Send(new CreatePurchaseOrderCommand(dto));
        return Ok(new { OrderId = id });
    }

    [HttpPost("{id}/approve")]
    public async Task<IActionResult> ApproveOrder(Guid id, [FromBody] Guid warehouseId)
    {
        var result = await _mediator.Send(new ApprovePurchaseOrderCommand(id, warehouseId));
        return Ok(new { Success = result });
    }
}
