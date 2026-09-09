using System.Net;
using System.Text.Encodings.Web;
using System.Text.Json;
using HrmPlatform.Application.Common.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace HrmPlatform.WebApi.Middlewares;

/// <summary>
/// Global Exception Handling Middleware trả về cấu trúc lỗi chuẩn RFC 7807 (ProblemDetails)
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IHostEnvironment _env;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        WriteIndented = false
    };

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger,
        IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
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
        context.Response.ContentType = "application/problem+json";

        var problemDetails = new ProblemDetails
        {
            Instance = context.Request.Path,
            Extensions =
            {
                ["traceId"] = context.TraceIdentifier
            }
        };

        switch (exception)
        {
            case ValidationException validationException:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                problemDetails.Status = (int)HttpStatusCode.BadRequest;
                problemDetails.Title = "Dữ liệu yêu cầu không hợp lệ (Validation Failure)";
                problemDetails.Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1";
                problemDetails.Detail = validationException.Message;
                problemDetails.Extensions["errors"] = validationException.Errors;
                _logger.LogWarning(exception, "Lỗi Validation: {Path}", context.Request.Path);
                break;

            case NotFoundException notFoundException:
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                problemDetails.Status = (int)HttpStatusCode.NotFound;
                problemDetails.Title = "Không tìm thấy tài nguyên (Resource Not Found)";
                problemDetails.Type = "https://tools.ietf.org/html/rfc7231#section-6.5.4";
                problemDetails.Detail = notFoundException.Message;
                _logger.LogInformation("Không tìm thấy: {Message}", notFoundException.Message);
                break;

            case UnauthorizedException unauthorizedException:
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                problemDetails.Status = (int)HttpStatusCode.Unauthorized;
                problemDetails.Title = "Chưa được xác thực (Unauthorized)";
                problemDetails.Type = "https://tools.ietf.org/html/rfc7235#section-3.1";
                problemDetails.Detail = unauthorizedException.Message;
                _logger.LogWarning("Truy cập chưa xác thực: {Path}", context.Request.Path);
                break;

            case ForbiddenAccessException forbiddenException:
                context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                problemDetails.Status = (int)HttpStatusCode.Forbidden;
                problemDetails.Title = "Không có quyền truy cập (Forbidden)";
                problemDetails.Type = "https://tools.ietf.org/html/rfc7231#section-6.5.3";
                problemDetails.Detail = forbiddenException.Message;
                _logger.LogWarning("Truy cập bị từ chối: {Path}", context.Request.Path);
                break;

            case BadRequestException badRequestException:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                problemDetails.Status = (int)HttpStatusCode.BadRequest;
                problemDetails.Title = "Yêu cầu không hợp lệ (Bad Request)";
                problemDetails.Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1";
                problemDetails.Detail = badRequestException.Message;
                _logger.LogWarning("Yêu cầu không hợp lệ: {Message}", badRequestException.Message);
                break;

            case HrmPlatform.Domain.Exceptions.DomainException domainException:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                problemDetails.Status = (int)HttpStatusCode.BadRequest;
                problemDetails.Title = "Vi phạm quy tắc nghiệp vụ (Domain Invariant Violation)";
                problemDetails.Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1";
                problemDetails.Detail = domainException.Message;
                _logger.LogWarning("Vi phạm quy tắc nghiệp vụ: {Message}", domainException.Message);
                break;

            default:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                problemDetails.Status = (int)HttpStatusCode.InternalServerError;
                problemDetails.Title = "Lỗi máy chủ nội bộ (Internal Server Error)";
                problemDetails.Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1";
                problemDetails.Detail = _env.IsDevelopment()
                    ? $"{exception.Message} | StackTrace: {exception.StackTrace}"
                    : "Đã xảy ra lỗi không mong muốn trên hệ thống. Vui lòng liên hệ quản trị viên.";
                _logger.LogError(exception, "Lỗi chưa được xử lý (Unhandled Exception) tại {Path}", context.Request.Path);
                break;
        }

        var json = JsonSerializer.Serialize(problemDetails, JsonOptions);
        await context.Response.WriteAsync(json);
    }
}
