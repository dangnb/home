using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.Notifications.Queries.GetUnreadCount;

public record GetUnreadCountQuery : IRequest<int>;

public class GetUnreadCountQueryHandler : IRequestHandler<GetUnreadCountQuery, int>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetUnreadCountQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<int> Handle(GetUnreadCountQuery request, CancellationToken cancellationToken)
    {
        var username = _currentUserService.UserName;

        return await _context.Notifications
            .Where(n => n.CompanyId == _context.CurrentCompanyId && !n.IsDeleted && !n.IsRead)
            .Where(n => n.TargetUsername == null || n.TargetUsername == username)
            .CountAsync(cancellationToken);
    }
}
