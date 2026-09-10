using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Notifications.Commands;

public class MarkNotificationReadCommand : IRequest<bool>
{
    public long Id { get; set; }
}

public class MarkNotificationReadAllCommand : IRequest<bool>
{
}

public class MarkNotificationReadCommandHandler : 
    IRequestHandler<MarkNotificationReadCommand, bool>,
    IRequestHandler<MarkNotificationReadAllCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public MarkNotificationReadCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(MarkNotificationReadCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var userId = _currentUserService.UserId ?? 1;

        var notif = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == request.Id && n.TenantId == tenantId && n.UserId == userId, cancellationToken);

        if (notif == null)
            throw new NotFoundException($"Không tìm thấy thông báo ID = {request.Id}.");

        notif.MarkAsRead();
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> Handle(MarkNotificationReadAllCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var userId = _currentUserService.UserId ?? 1;

        var unreadNotifs = await _context.Notifications
            .Where(n => n.TenantId == tenantId && n.UserId == userId && !n.IsRead)
            .ToListAsync(cancellationToken);

        foreach (var notif in unreadNotifs)
        {
            notif.MarkAsRead();
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
