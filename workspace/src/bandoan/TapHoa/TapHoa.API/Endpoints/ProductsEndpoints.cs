using MediatR;
using TapHoa.Application.Products.Commands.CreateProduct;
using TapHoa.Application.Products.Commands.UpdateProduct;
using TapHoa.Application.Products.Commands.DeleteProduct;
using TapHoa.Application.Products.Queries.GetProducts;
using TapHoa.Application.Products.Queries.GetPagedProducts;
using TapHoa.Application.Products.Queries.GetLowStockProducts;
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

        group.MapGet("/paged", async (
            [FromQuery] int pageIndex,
            [FromQuery] int pageSize,
            [FromQuery] string? searchTerm,
            [FromQuery] Guid? categoryId,
            [FromServices] ISender sender) =>
        {
            var query = new GetPagedProductsQuery(pageIndex, pageSize, searchTerm, categoryId);
            var result = await sender.Send(query);
            return Results.Ok(result);
        })
        .WithName("GetPagedProducts")
        .WithDescription("Gets paged products with search and category filters")
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + (long)AppPermissions.ViewProducts);

        group.MapGet("/low-stock", async ([FromServices] ISender sender) =>
        {
            var products = await sender.Send(new GetLowStockProductsQuery());
            return Results.Ok(products);
        })
        .WithName("GetProductsLowStock")
        .WithDescription("Gets a list of products that have stock quantity less than or equal to their min stock level.")
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + (long)AppPermissions.ViewProducts);

        group.MapGet("/{id:guid}", async (Guid id, [FromServices] ISender sender) =>
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

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateProductCommand command, [FromServices] ISender sender) =>
        {
            if (id != command.Id) return Results.BadRequest();

            var result = await sender.Send(command);
            return result ? Results.NoContent() : Results.NotFound();
        })
        .WithName("UpdateProduct")
        .WithDescription("Updates an existing product")
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + (long)AppPermissions.UpdateProducts);

        group.MapDelete("/{id:guid}", async (Guid id, [FromServices] ISender sender) =>
        {
            var result = await sender.Send(new DeleteProductCommand(id));
            return result ? Results.NoContent() : Results.NotFound();
        })
        .WithName("DeleteProduct")
        .WithDescription("Deletes a product")
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + (long)AppPermissions.DeleteProducts);

        group.MapPost("/upload-image", async (Microsoft.AspNetCore.Http.IFormFile file, [FromServices] Microsoft.AspNetCore.Hosting.IWebHostEnvironment env) =>
        {
            if (file == null || file.Length == 0) return Results.BadRequest("No file uploaded");

            var webRoot = env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadsFolder = Path.Combine(webRoot, "uploads", "products");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var fileUrl = $"/uploads/products/{uniqueFileName}";
            return Results.Ok(new { url = fileUrl });
        })
        .WithName("UploadProductImage")
        .WithDescription("Uploads an image for a product")
        .DisableAntiforgery()
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + (long)AppPermissions.CreateProducts);

        return group;
    }
}
