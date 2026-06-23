using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.Categories.Commands.CreateCategory;
using TapHoa.Application.Categories.Commands.UpdateCategory;
using TapHoa.Application.Categories.Commands.DeleteCategory;
using TapHoa.Application.Categories.Queries.GetCategories;
using TapHoa.Application.Categories.Queries.GetCategoryById;

namespace TapHoa.API.Endpoints;

public static class CategoriesEndpoints
{
    public static RouteGroupBuilder MapCategoriesEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/", async ([FromServices] ISender sender) =>
        {
            var categories = await sender.Send(new GetCategoriesQuery());
            return Results.Ok(categories);
        })
        .WithName("GetCategories")
        .WithDescription("Gets all categories");

        group.MapGet("/{id:int}", async (int id, [FromServices] ISender sender) =>
        {
            var category = await sender.Send(new GetCategoryByIdQuery(id));
            return category is not null ? Results.Ok(category) : Results.NotFound();
        })
        .WithName("GetCategoryById")
        .WithDescription("Gets a specific category by ID");

        group.MapPost("/", async ([FromBody] CreateCategoryCommand command, [FromServices] ISender sender) =>
        {
            var created = await sender.Send(command);
            return Results.CreatedAtRoute("GetCategoryById", new { id = created.Id }, created);
        })
        .WithName("CreateCategory")
        .WithDescription("Creates a new category");

        group.MapPut("/{id:int}", async (int id, [FromBody] UpdateCategoryCommand command, [FromServices] ISender sender) =>
        {
            if (id != command.Id) return Results.BadRequest();

            var result = await sender.Send(command);
            return result ? Results.NoContent() : Results.NotFound();
        })
        .WithName("UpdateCategory")
        .WithDescription("Updates an existing category");

        group.MapDelete("/{id:int}", async (int id, [FromServices] ISender sender) =>
        {
            var result = await sender.Send(new DeleteCategoryCommand(id));
            return result ? Results.NoContent() : Results.NotFound();
        })
        .WithName("DeleteCategory")
        .WithDescription("Deletes a category");

        return group;
    }
}
