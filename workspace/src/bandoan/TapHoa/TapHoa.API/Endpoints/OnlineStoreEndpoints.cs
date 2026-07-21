using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.Products.Queries.GetPagedProducts;
using TapHoa.Application.Products.Queries.GetProductById;
using TapHoa.Application.Categories.Queries.GetCategories;
using TapHoa.Application.Orders.Commands;
using TapHoa.Domain.Enums;

namespace TapHoa.API.Endpoints;

public static class OnlineStoreEndpoints
{
    public static RouteGroupBuilder MapOnlineStoreEndpoints(this RouteGroupBuilder group)
    {
        // Public API, no authentication required
        group.AllowAnonymous();

        group.MapGet("/products", async (
            [FromQuery] int pageIndex,
            [FromQuery] int pageSize,
            [FromQuery] string? searchTerm,
            [FromQuery] Guid? categoryId,
            [FromServices] ISender sender) =>
        {
            // Default to page 1, size 24 for online store if not provided
            var query = new GetPagedProductsQuery(pageIndex > 0 ? pageIndex : 1, pageSize > 0 ? pageSize : 24, searchTerm, categoryId);
            var result = await sender.Send(query);
            return Results.Ok(result);
        })
        .WithName("OnlineGetProducts")
        .WithDescription("Gets paged products for the online storefront");

        group.MapGet("/products/{id:guid}", async (Guid id, [FromServices] ISender sender) =>
        {
            var product = await sender.Send(new GetProductByIdQuery(id));
            return product is not null ? Results.Ok(product) : Results.NotFound();
        })
        .WithName("OnlineGetProductById")
        .WithDescription("Gets a specific product by ID for the online storefront");

        group.MapGet("/categories", async ([FromServices] ISender sender) =>
        {
            var categories = await sender.Send(new GetCategoriesQuery());
            return Results.Ok(categories);
        })
        .WithName("OnlineGetCategories")
        .WithDescription("Gets all categories for the online storefront");

        group.MapPost("/orders", async ([FromBody] CreateOnlineOrderCommand command, [FromServices] ISender sender) =>
        {
            var orderId = await sender.Send(command);
            return Results.Ok(new { OrderId = orderId });
        })
        .WithName("OnlineCreateOrder")
        .WithDescription("Creates a new pending order from the online storefront");

        group.MapPost("/auth/login", async ([FromBody] TapHoa.Application.Customers.Commands.OnlineCustomerLoginCommand command, [FromServices] ISender sender) =>
        {
            if (string.IsNullOrWhiteSpace(command.PhoneNumber))
                return Results.BadRequest(new { Message = "Số điện thoại là bắt buộc" });

            var result = await sender.Send(command);
            return Results.Ok(result);
        })
        .WithName("OnlineCustomerLogin")
        .WithDescription("Login or register a customer using phone number");

        var authenticatedGroup = group.MapGroup("").RequireAuthorization(policy => policy.RequireRole("Customer"));

        authenticatedGroup.MapGet("/auth/me", async (System.Security.Claims.ClaimsPrincipal user, [FromServices] ISender sender) =>
        {
            var customerIdStr = user.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(customerIdStr) || !Guid.TryParse(customerIdStr, out var customerId))
                return Results.Unauthorized();

            // Here we should ideally return the Customer details (points, tier, etc.)
            // using a GetCustomerByIdQuery. For now, we can extract from claims.
            return Results.Ok(new 
            {
                Id = customerId,
                FullName = user.Identity?.Name,
                PhoneNumber = user.FindFirstValue("PhoneNumber")
            });
        })
        .WithName("OnlineCustomerMe")
        .WithDescription("Get current logged in customer info");

        authenticatedGroup.MapGet("/orders/me", async (
            [FromQuery] int pageIndex,
            [FromQuery] int pageSize,
            System.Security.Claims.ClaimsPrincipal user, 
            [FromServices] ISender sender) =>
        {
            var customerIdStr = user.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(customerIdStr) || !Guid.TryParse(customerIdStr, out var customerId))
                return Results.Unauthorized();

            var query = new TapHoa.Application.Orders.Queries.GetCustomerOrders.GetCustomerOrdersQuery(
                customerId, 
                pageIndex > 0 ? pageIndex : 1, 
                pageSize > 0 ? pageSize : 10);
                
            var result = await sender.Send(query);
            return Results.Ok(result);
        })
        .WithName("OnlineCustomerOrders")
        .WithDescription("Get order history for current customer");

        return group;
    }
}
