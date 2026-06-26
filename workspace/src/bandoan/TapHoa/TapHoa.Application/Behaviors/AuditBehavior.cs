using System.Threading;
using System.Threading.Tasks;
using MediatR;
using System.Text.Json;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace TapHoa.Application.Behaviors;

/// <summary>
/// Pipeline chặn ngang các Command (Create/Update/Delete) trên tầng Use-Case.
/// Chịu trách nhiệm ghi lại lịch sử thao tác (Audit Logs: lưu ai làm gì, lúc nào)
/// giúp truy vết hành vi của các User trên hệ thống WMS một cách minh bạch.
/// 
/// Refactored to Clean Architecture: 
/// Phụ thuộc vào interface IApplicationDbContext và ICurrentUserService thay vì framework web.
/// </summary>
public class AuditBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<AuditBehavior<TRequest, TResponse>> _logger;

    public AuditBehavior(IApplicationDbContext dbContext, ICurrentUserService currentUserService, ILogger<AuditBehavior<TRequest, TResponse>> logger)
    {
        _dbContext = dbContext;
        _currentUserService = currentUserService;
        _logger = logger;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        
        // Chỉ lưu log với các command (Create, Update, Delete)
        if (requestName.EndsWith("Command"))
        {
            var username = _currentUserService.UserName ?? "System";
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
