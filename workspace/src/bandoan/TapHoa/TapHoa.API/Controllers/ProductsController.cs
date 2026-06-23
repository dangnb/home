using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.Products.Commands.CreateProduct;
using TapHoa.Application.Products.Commands.UpdateProduct;
using TapHoa.Application.Products.Commands.DeleteProduct;
using TapHoa.Application.Products.Queries.GetProducts;
using TapHoa.Application.Products.Queries.GetProductById;
using TapHoa.Application.Products.DTOs;

namespace TapHoa.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ISender _sender;

    public ProductsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
    {
        var products = await _sender.Send(new GetProductsQuery());
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await _sender.Send(new GetProductByIdQuery(id));
        if (product == null) return NotFound();
        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductCommand command)
    {
        var created = await _sender.Send(command);
        return CreatedAtAction(nameof(GetProduct), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, UpdateProductCommand command)
    {
        if (id != command.Id) return BadRequest();
        
        var result = await _sender.Send(command);
        if (!result) return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var result = await _sender.Send(new DeleteProductCommand(id));
        if (!result) return NotFound();

        return NoContent();
    }
}
