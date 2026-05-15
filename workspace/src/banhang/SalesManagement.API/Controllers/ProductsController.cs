using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalesManagement.Application.Products.Commands;
using SalesManagement.Application.Products.Queries;
using SalesManagement.Application.Products.Dtos;

namespace SalesManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize]  // Commented out to ease demo testing across dev environment
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetProductsQuery());
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var result = await _mediator.Send(new GetProductByIdQuery(id));
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        var result = await _mediator.Send(new CreateProductCommand(dto));
        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductDto dto)
    {
        if (id != dto.Id) return BadRequest("ID mismatch");
        var result = await _mediator.Send(new UpdateProductCommand(dto));
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteProductCommand(id));
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpPost("bulk-upload")]
    public async Task<IActionResult> BulkUpload([FromBody] List<CreateProductDto> products)
    {
        var result = await _mediator.Send(new BulkUploadProductsCommand(products));
        return Ok(new { success = result, count = products.Count });
    }
}
