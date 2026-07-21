using System.Text.Json;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using TapHoa.Domain.Exceptions;

namespace TapHoa.API.Middlewares;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
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
            _logger.LogError(ex, "An exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var response = new { error = string.Empty, details = new List<string>() };

        switch (exception)
        {
            case ValidationException validationException:
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                response = new 
                { 
                    error = "Validation Failed", 
                    details = validationException.Errors.Select(e => e.ErrorMessage).ToList() 
                };
                break;

            case DomainException domainException:
                context.Response.StatusCode = StatusCodes.Status400BadRequest;
                response = new 
                { 
                    error = "Domain Rule Violation", 
                    details = new List<string> { domainException.Message } 
                };
                break;

            default:
                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                response = new 
                { 
                    error = "Internal Server Error", 
                    details = new List<string> { exception.Message, exception.StackTrace ?? "" } 
                };
                break;
        }

        var result = JsonSerializer.Serialize(response);
        await context.Response.WriteAsync(result);
    }
}
