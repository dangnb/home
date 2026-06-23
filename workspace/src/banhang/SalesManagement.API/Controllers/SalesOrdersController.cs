using MediatR;
using Microsoft.AspNetCore.Mvc;
using SalesManagement.Application.Sales.Commands;

namespace SalesManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesOrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public SalesOrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var result = await _mediator.Send(new SalesManagement.Application.Sales.Queries.GetSalesOrdersQuery());
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateSalesOrderDto dto)
    {
        var id = await _mediator.Send(new CreateSalesOrderCommand(dto));
        return Ok(new { OrderId = id });
    }

    [HttpPost("{id}/approve")]
    public async Task<IActionResult> ApproveOrder(Guid id, [FromBody] Guid warehouseId)
    {
        var result = await _mediator.Send(new ApproveSalesOrderCommand(id, warehouseId));
        return Ok(new { Success = result });
    }
}
