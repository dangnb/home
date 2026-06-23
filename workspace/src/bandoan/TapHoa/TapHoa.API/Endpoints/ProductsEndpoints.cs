using MediatR;
using TapHoa.Application.Products.Commands.CreateProduct;
using TapHoa.Application.Products.Commands.UpdateProduct;
using TapHoa.Application.Products.Commands.DeleteProduct;
using TapHoa.Application.Products.Queries.GetProducts;
using TapHoa.Application.Products.Queries.GetProductById;
using Microsoft.AspNetCore.Mvc;
using TapHoa.API.Authorization;
using TapHoa.Domain.Enums;

namespace TapHoa.API.Endpoints;

public static class ProductsEndpoints
{
    public static RouteGroupBuilder MapProductsEndpoints(this RouteGroupBuilder group)
    {
        group.RequireAuthorization(); // Requires standard JWT login overall

        group.MapGet("/", async ([FromServices] ISender sender) =>
        {
            var products = await sender.Send(new GetProductsQuery());
            return Results.Ok(products);
        })
        .WithName("GetProducts")
        .WithDescription("Gets all products using Dapper")
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + (long)AppPermissions.ViewProducts);

        group.MapGet("/{id:int}", async (int id, [FromServices] ISender sender) =>
        {
            var product = await sender.Send(new GetProductByIdQuery(id));
            return product is not null ? Results.Ok(product) : Results.NotFound();
        })
        .WithName("GetProductById")
        .WithDescription("Gets a specific product by ID")
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + (long)AppPermissions.ViewProducts);

        group.MapPost("/", async ([FromBody] CreateProductCommand command, [FromServices] ISender sender) =>
        {
            var created = await sender.Send(command);
            return Results.CreatedAtRoute("GetProductById", new { id = created.Id }, created);
        })
        .WithName("CreateProduct")
        .WithDescription("Creates a new product")
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + (long)AppPermissions.CreateProducts);

        group.MapPut("/{id:int}", async (int id, [FromBody] UpdateProductCommand command, [FromServices] ISender sender) =>
        {
            if (id != command.Id) return Results.BadRequest();

            var result = await sender.Send(command);
            return result ? Results.NoContent() : Results.NotFound();
        })
        .WithName("UpdateProduct")
        .WithDescription("Updates an existing product")
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + (long)AppPermissions.UpdateProducts);

        group.MapDelete("/{id:int}", async (int id, [FromServices] ISender sender) =>
        {
            var result = await sender.Send(new DeleteProductCommand(id));
            return result ? Results.NoContent() : Results.NotFound();
        })
        .WithName("DeleteProduct")
        .WithDescription("Deletes a product")
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + (long)AppPermissions.DeleteProducts);

        return group;
    }
}
