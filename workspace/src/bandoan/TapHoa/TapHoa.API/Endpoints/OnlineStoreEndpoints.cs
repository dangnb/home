using MediatR;
using Microsoft.AspNetCore.Mvc;
using TapHoa.Application.Products.Queries.GetPagedProducts;
using TapHoa.Application.Products.Queries.GetProductById;
using TapHoa.Application.Products.Queries.GetProductBySlug;
using TapHoa.Application.Categories.Queries.GetCategories;
using TapHoa.Application.Categories.Queries.GetCategoryBySlug;
using TapHoa.Application.Orders.Commands;
using TapHoa.Domain.Enums;

namespace TapHoa.API.Endpoints;

public static class OnlineStoreEndpoints
{
    public static RouteGroupBuilder MapOnlineStoreEndpoints(this RouteGroupBuilder group)
    {
        // ── Security: API Key + Rate Limiting for public endpoints ──
        // Public browsing endpoints get API key validation + rate limit
        group.AllowAnonymous();
        group.RequireRateLimiting("storefront-policy");

        // ── API Key validation filter ──
        group.AddEndpointFilter(async (context, next) =>
        {
            var httpContext = context.HttpContext;
            var config = httpContext.RequestServices.GetRequiredService<IConfiguration>();
            var expectedKey = config["Security:StorefrontApiKey"];

            var env = httpContext.RequestServices.GetService<IHostEnvironment>();
            if (env != null && env.IsDevelopment())
                return await next(context);

            // Skip API key check if not configured
            if (string.IsNullOrEmpty(expectedKey))
                return await next(context);

            // Check X-API-Key header
            var providedKey = httpContext.Request.Headers["X-API-Key"].FirstOrDefault();
            if (string.IsNullOrEmpty(providedKey) || providedKey != expectedKey)
            {
                var logger = httpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogWarning(
                    "SECURITY: Unauthorized storefront API access from IP {IP}, Path: {Path}",
                    httpContext.Connection.RemoteIpAddress,
                    httpContext.Request.Path);
                return Results.Json(new { message = "Unauthorized: Invalid API Key" }, statusCode: 401);
            }

            return await next(context);
        });

        group.MapGet("/products", async (
            [FromQuery] int pageIndex = 1,
            [FromQuery] int pageSize = 24,
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? categoryId = null,
            [FromQuery] string? sortBy = null,
            [FromServices] ISender sender = null!) =>
        {
            // Sanitize & clamp pageSize to prevent excessive data fetching
            var safePage = Math.Max(1, pageIndex);
            var safeSize = Math.Clamp(pageSize > 0 ? pageSize : 24, 1, 50);
            
            // Sanitize searchTerm — trim, limit length
            var safeSearch = string.IsNullOrWhiteSpace(searchTerm) 
                ? null 
                : searchTerm.Trim().Length > 100 ? searchTerm.Trim()[..100] : searchTerm.Trim();

            Guid? catGuid = null;
            if (!string.IsNullOrWhiteSpace(categoryId) && Guid.TryParse(categoryId, out var parsedGuid))
            {
                catGuid = parsedGuid;
            }

            var query = new GetPagedProductsQuery(safePage, safeSize, safeSearch, catGuid, sortBy);
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

        group.MapGet("/products/slug/{slug}", async (string slug, [FromServices] ISender sender) =>
        {
            // Sanitize slug
            var safeSlug = slug?.Trim().Length > 200 ? slug.Trim()[..200] : slug?.Trim() ?? "";
            if (string.IsNullOrEmpty(safeSlug))
                return Results.BadRequest(new { message = "Slug is required" });

            var product = await sender.Send(new GetProductBySlugQuery(safeSlug));
            return product is not null ? Results.Ok(product) : Results.NotFound();
        })
        .WithName("OnlineGetProductBySlug")
        .WithDescription("Gets a specific product by Slug for the online storefront");

        group.MapGet("/categories", async ([FromServices] ISender sender) =>
        {
            var categories = await sender.Send(new GetCategoriesQuery());
            return Results.Ok(categories);
        })
        .WithName("OnlineGetCategories")
        .WithDescription("Gets all categories for the online storefront");

        group.MapGet("/categories/slug/{slug}", async (string slug, [FromServices] ISender sender) =>
        {
            var safeSlug = slug?.Trim().Length > 200 ? slug.Trim()[..200] : slug?.Trim() ?? "";
            if (string.IsNullOrEmpty(safeSlug))
                return Results.BadRequest(new { message = "Slug is required" });

            var category = await sender.Send(new GetCategoryBySlugQuery { Slug = safeSlug });
            return category is not null ? Results.Ok(category) : Results.NotFound();
        })
        .WithName("OnlineGetCategoryBySlug")
        .WithDescription("Gets a specific category by Slug for the online storefront");

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
        .RequireRateLimiting("login-policy")
        .WithName("OnlineCustomerLogin")
        .WithDescription("Login or register a customer using phone number");

        var authenticatedGroup = group.MapGroup("").RequireAuthorization(policy => policy.RequireRole("Customer"));

        authenticatedGroup.MapGet("/auth/me", async (System.Security.Claims.ClaimsPrincipal user, [FromServices] ISender sender) =>
        {
            var customerIdStr = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(customerIdStr) || !Guid.TryParse(customerIdStr, out var customerId))
                return Results.Unauthorized();

            return Results.Ok(new 
            {
                Id = customerId,
                FullName = user.Identity?.Name,
                PhoneNumber = user.FindFirst("PhoneNumber")?.Value
            });
        })
        .WithName("OnlineCustomerMe")
        .WithDescription("Get current logged in customer info");

        authenticatedGroup.MapGet("/orders/me", async (
            [FromQuery] int pageIndex = 1,
            [FromQuery] int pageSize = 10,
            System.Security.Claims.ClaimsPrincipal user = null!, 
            [FromServices] ISender sender = null!) =>
        {
            var customerIdStr = user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(customerIdStr) || !Guid.TryParse(customerIdStr, out var customerId))
                return Results.Unauthorized();

            var query = new TapHoa.Application.Orders.Queries.GetCustomerOrders.GetCustomerOrdersQuery(
                customerId, 
                pageIndex > 0 ? pageIndex : 1, 
                Math.Clamp(pageSize > 0 ? pageSize : 10, 1, 50));
                
            var result = await sender.Send(query);
            return Results.Ok(result);
        })
        .WithName("OnlineCustomerOrders")
        .WithDescription("Get order history for current customer");

        return group;
    }
}
