using System.IO;
using System.Text.Json;
using FluentValidation;
using FluentValidation.Results;
using HrmPlatform.Application.Common.Behaviors;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.WebApi.Middlewares;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;
using ValidationException = HrmPlatform.Application.Common.Exceptions.ValidationException;

namespace HrmPlatform.Infrastructure.Tests;

public class CrossCuttingConcernsTests
{
    #region 1. ValidationBehavior Tests
    public class SampleCommand : IRequest<string>
    {
        public string Name { get; set; } = string.Empty;
    }

    public class SampleCommandValidator : AbstractValidator<SampleCommand>
    {
        public SampleCommandValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Tên không được để trống.");
        }
    }

    [Fact]
    public async Task ValidationBehavior_ShouldThrowValidationException_WhenValidationFails()
    {
        // Arrange
        var validators = new List<IValidator<SampleCommand>> { new SampleCommandValidator() };
        var behavior = new ValidationBehavior<SampleCommand, string>(validators);
        var invalidCommand = new SampleCommand { Name = "" };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ValidationException>(() =>
            behavior.Handle(invalidCommand, (_) => Task.FromResult("Success"), CancellationToken.None));

        Assert.True(exception.Errors.ContainsKey("Name"));
        Assert.Contains("Tên không được để trống.", exception.Errors["Name"]);
    }

    [Fact]
    public async Task ValidationBehavior_ShouldProceed_WhenValidationSucceeds()
    {
        // Arrange
        var validators = new List<IValidator<SampleCommand>> { new SampleCommandValidator() };
        var behavior = new ValidationBehavior<SampleCommand, string>(validators);
        var validCommand = new SampleCommand { Name = "Clean Architecture" };

        // Act
        var result = await behavior.Handle(validCommand, (_) => Task.FromResult("Success"), CancellationToken.None);

        // Assert
        Assert.Equal("Success", result);
    }
    #endregion

    #region 2. TenantResolverMiddleware Tests
    [Fact]
    public async Task TenantResolverMiddleware_ShouldExtractTenantIdAndCodeFromHeaders()
    {
        // Arrange
        var context = new DefaultHttpContext();
        context.Request.Headers["X-Tenant-Id"] = "42";
        context.Request.Headers["X-Tenant-Code"] = "ACME";

        var middleware = new TenantResolverMiddleware(
            next: (innerContext) => Task.CompletedTask,
            logger: NullLogger<TenantResolverMiddleware>.Instance);

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        Assert.Equal(42L, context.Items["CurrentTenantId"]);
        Assert.Equal("ACME", context.Items["CurrentTenantCode"]);
    }
    #endregion

    #region 3. ExceptionHandlingMiddleware (RFC 7807) Tests
    private class DummyHostEnv : IHostEnvironment
    {
        public string EnvironmentName { get; set; } = Environments.Production;
        public string ApplicationName { get; set; } = "Test";
        public string ContentRootPath { get; set; } = Directory.GetCurrentDirectory();
        public Microsoft.Extensions.FileProviders.IFileProvider ContentRootFileProvider { get; set; } = null!;
    }

    [Fact]
    public async Task ExceptionHandlingMiddleware_ShouldReturnRfc7807_OnValidationException()
    {
        // Arrange
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        var failures = new List<ValidationFailure>
        {
            new ValidationFailure("Email", "Email không đúng định dạng.")
        };

        var middleware = new ExceptionHandlingMiddleware(
            next: (innerContext) => throw new ValidationException(failures),
            logger: NullLogger<ExceptionHandlingMiddleware>.Instance,
            env: new DummyHostEnv());

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        Assert.Equal(400, context.Response.StatusCode);
        Assert.Equal("application/problem+json", context.Response.ContentType);

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        using var reader = new StreamReader(context.Response.Body);
        var json = await reader.ReadToEndAsync();

        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;
        Assert.Equal(400, root.GetProperty("status").GetInt32());
        Assert.Equal("https://tools.ietf.org/html/rfc7231#section-6.5.1", root.GetProperty("type").GetString());
        Assert.True(root.TryGetProperty("errors", out var errors));
        Assert.True(errors.TryGetProperty("email", out var emailErrors) || errors.TryGetProperty("Email", out emailErrors));
    }

    [Fact]
    public async Task ExceptionHandlingMiddleware_ShouldReturn404_OnNotFoundException()
    {
        // Arrange
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        var middleware = new ExceptionHandlingMiddleware(
            next: (innerContext) => throw new NotFoundException("Department", 99),
            logger: NullLogger<ExceptionHandlingMiddleware>.Instance,
            env: new DummyHostEnv());

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        Assert.Equal(404, context.Response.StatusCode);

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        using var reader = new StreamReader(context.Response.Body);
        var json = await reader.ReadToEndAsync();

        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;
        Assert.Equal(404, root.GetProperty("status").GetInt32());
        Assert.Equal("https://tools.ietf.org/html/rfc7231#section-6.5.4", root.GetProperty("type").GetString());
    }
    #endregion
}
