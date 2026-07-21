using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Notifications.Commands.MarkAsRead;

public record MarkAllNotificationsAsReadCommand : IRequest;

public class MarkAllNotificationsAsReadCommandHandler : IRequestHandler<MarkAllNotificationsAsReadCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public MarkAllNotificationsAsReadCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(MarkAllNotificationsAsReadCommand request, CancellationToken cancellationToken)
    {
        var username = _currentUserService.UserName;

        var unreadNotifications = await _context.Notifications
            .Where(n => n.CompanyId == _context.CurrentCompanyId && !n.IsDeleted && !n.IsRead)
            .Where(n => n.TargetUsername == null || n.TargetUsername == username)
            .ToListAsync(cancellationToken);

        foreach (var notification in unreadNotifications)
        {
            notification.MarkAsRead();
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
