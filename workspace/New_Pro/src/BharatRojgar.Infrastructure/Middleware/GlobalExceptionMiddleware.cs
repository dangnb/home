using System.Net;
using System.Text.Json;
using BharatRojgar.Application.Common.Exceptions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BharatRojgar.Infrastructure.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate _next, ILogger<GlobalExceptionMiddleware> logger)
    {
        this._next = _next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/problem+json; charset=utf-8";

        ProblemDetails problemDetails;

        switch (exception)
        {
            case AppValidationException validationEx:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                var validationProblem = new ValidationProblemDetails(validationEx.Errors)
                {
                    Type = "https://tools.ietf.org/html/rfc7807#section-6.5.1",
                    Title = "One or more validation errors occurred.",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = validationEx.Message,
                    Instance = context.Request.Path
                };
                problemDetails = validationProblem;
                _logger.LogWarning("Validation failure occurred on request {Path}: {Errors}", context.Request.Path, validationEx.Errors);
                break;

            case NotFoundException notFoundEx:
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                problemDetails = new ProblemDetails
                {
                    Type = "https://tools.ietf.org/html/rfc7807#section-6.5.4",
                    Title = "Resource Not Found",
                    Status = StatusCodes.Status404NotFound,
                    Detail = notFoundEx.Message,
                    Instance = context.Request.Path
                };
                _logger.LogWarning("Resource not found on request {Path}: {Message}", context.Request.Path, notFoundEx.Message);
                break;

            case ConflictException conflictEx:
                context.Response.StatusCode = (int)HttpStatusCode.Conflict;
                problemDetails = new ProblemDetails
                {
                    Type = "https://tools.ietf.org/html/rfc7807#section-6.5.8",
                    Title = "Resource Conflict",
                    Status = StatusCodes.Status409Conflict,
                    Detail = conflictEx.Message,
                    Instance = context.Request.Path
                };
                _logger.LogWarning("Conflict error on request {Path}: {Message}", context.Request.Path, conflictEx.Message);
                break;

            default:
                _logger.LogError(exception, "Unhandled exception occurred on request {Path}: {Message}", context.Request.Path, exception.Message);
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                problemDetails = new ProblemDetails
                {
                    Type = "https://tools.ietf.org/html/rfc7807#section-6.6.1",
                    Title = "An unexpected error occurred while processing your request.",
                    Status = StatusCodes.Status500InternalServerError,
                    Detail = "An internal server error has occurred. Please contact system support with this instance trace.",
                    Instance = context.Request.Path
                };
                break;
        }

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        };

        var responsePayload = JsonSerializer.Serialize(problemDetails, problemDetails.GetType(), jsonOptions);
        await context.Response.WriteAsync(responsePayload);
    }
}

public static class GlobalExceptionMiddlewareExtensions
{
    public static IApplicationBuilder UseGlobalExceptionMiddleware(this IApplicationBuilder app)
    {
        return app.UseMiddleware<GlobalExceptionMiddleware>();
    }
}
