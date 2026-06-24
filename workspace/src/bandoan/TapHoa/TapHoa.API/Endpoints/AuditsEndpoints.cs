using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TapHoa.API.Authorization;
using TapHoa.Domain.Enums;
using TapHoa.Infrastructure.Data;

namespace TapHoa.API.Endpoints;

public record AuditLogDto(int Id, string Action, string RequestName, string RequestData, string Username, DateTime Timestamp);
public record GetAuditLogsQuery() : IRequest<List<AuditLogDto>>;

public class GetAuditLogsQueryHandler : IRequestHandler<GetAuditLogsQuery, List<AuditLogDto>>
{
    private readonly AppDbContext _context;

    public GetAuditLogsQueryHandler(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<AuditLogDto>> Handle(GetAuditLogsQuery request, CancellationToken cancellationToken)
    {
        var logs = await _context.AuditLogs
            .OrderByDescending(x => x.Timestamp)
            .Take(100)
            .ToListAsync(cancellationToken);

        return logs.Select(x => new AuditLogDto(x.Id, x.Action, x.RequestName, x.RequestData ?? "", x.Username, x.Timestamp)).ToList();
    }
}

public static class AuditsEndpoints
{
    public static RouteGroupBuilder MapAuditsEndpoints(this RouteGroupBuilder group)
    {
        group.RequireAuthorization();

        group.MapGet("/", async ([FromServices] ISender sender) =>
        {
            var logs = await sender.Send(new GetAuditLogsQuery());
            return Results.Ok(logs);
        })
        .WithName("GetAuditLogs")
        .WithDescription("Gets top recent audit logs")
        .RequireAuthorization(RequirePermissionAttribute.PolicyPrefix + "-1");

        return group;
    }
}
