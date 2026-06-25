using Microsoft.AspNetCore.Mvc;
using MediatR;
using TapHoa.API.Authorization;
using TapHoa.Domain.Enums;
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
        group.RequireAuthorization();

        group.MapGet("/", async ([FromServices] ISender sender) =>
        {
            var categories = await sender.Send(new GetCategoriesQuery());
            return Results.Ok(categories);
        })
        .WithName("GetCategories")
        .WithDescription("Gets all categories")
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + (long)AppPermissions.ViewCategories);

        group.MapGet("/{id:guid}", async (Guid id, [FromServices] ISender sender) =>
        {
            var category = await sender.Send(new GetCategoryByIdQuery(id));
            return category is not null ? Results.Ok(category) : Results.NotFound();
        })
        .WithName("GetCategoryById")
        .WithDescription("Gets a specific category by ID")
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + (long)AppPermissions.ViewCategories);

        group.MapPost("/", async ([FromBody] CreateCategoryCommand command, [FromServices] ISender sender) =>
        {
            var created = await sender.Send(command);
            return Results.CreatedAtRoute("GetCategoryById", new { id = created.Id }, created);
        })
        .WithName("CreateCategory")
        .WithDescription("Creates a new category")
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + (long)AppPermissions.CreateCategories);

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateCategoryCommand command, [FromServices] ISender sender) =>
        {
            if (id != command.Id) return Results.BadRequest();

            var result = await sender.Send(command);
            return result ? Results.NoContent() : Results.NotFound();
        })
        .WithName("UpdateCategory")
        .WithDescription("Updates an existing category")
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + (long)AppPermissions.UpdateCategories);

        group.MapDelete("/{id:guid}", async (Guid id, [FromServices] ISender sender) =>
        {
            var result = await sender.Send(new DeleteCategoryCommand(id));
            return result ? Results.NoContent() : Results.NotFound();
        })
        .WithName("DeleteCategory")
        .WithDescription("Deletes a category")
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + (long)AppPermissions.DeleteCategories);

        return group;
    }
}
