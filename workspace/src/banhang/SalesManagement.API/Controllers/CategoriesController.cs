using MediatR;
using Microsoft.AspNetCore.Mvc;
using SalesManagement.Application.Categories.Commands;
using SalesManagement.Application.Categories.Queries;
using SalesManagement.Application.Categories.Dtos;

namespace SalesManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;

    public CategoriesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetCategoriesQuery());
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var result = await _mediator.Send(new GetCategoryByIdQuery(id));
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        var result = await _mediator.Send(new CreateCategoryCommand(dto));
        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCategoryDto dto)
    {
        if (id != dto.Id) return BadRequest("ID mismatch");
        var result = await _mediator.Send(new UpdateCategoryCommand(dto));
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _mediator.Send(new DeleteCategoryCommand(id));
        if (!result) return NotFound();
        return NoContent();
    }
}
