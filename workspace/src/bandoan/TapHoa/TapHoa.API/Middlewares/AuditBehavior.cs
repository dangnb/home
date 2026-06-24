using MediatR;
using Microsoft.AspNetCore.Http;
using System.Text.Json;
using TapHoa.Infrastructure.Data;
using TapHoa.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace TapHoa.API.Middlewares;

public class AuditBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly AppDbContext _dbContext;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<AuditBehavior<TRequest, TResponse>> _logger;

    public AuditBehavior(AppDbContext dbContext, IHttpContextAccessor httpContextAccessor, ILogger<AuditBehavior<TRequest, TResponse>> logger)
    {
        _dbContext = dbContext;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        
        // Chỉ lưu log với các command (Create, Update, Delete)
        if (requestName.EndsWith("Command"))
        {
            var username = _httpContextAccessor.HttpContext?.User?.Identity?.Name ?? "System";
            var requestData = JsonSerializer.Serialize(request);

            var action = "Unknown";
            if (requestName.StartsWith("Create")) action = "Create";
            else if (requestName.StartsWith("Update")) action = "Update";
            else if (requestName.StartsWith("Delete")) action = "Delete";

            var auditLog = AuditLog.Create(action, requestName, requestData, username);
            
            _dbContext.AuditLogs.Add(auditLog);
            await _dbContext.SaveChangesAsync(cancellationToken);
            
            _logger.LogInformation("Audit Logged: {Action} by {Username} - {RequestName}", action, username, requestName);
        }

        return await next();
    }
}
