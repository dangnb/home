using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Common.Models;
using TapHoa.Application.Interfaces;
using TapHoa.Application.Notifications.DTOs;

namespace TapHoa.Application.Notifications.Queries.GetNotifications;

public record GetNotificationsQuery(int PageNumber = 1, int PageSize = 10, bool UnreadOnly = false) 
    : IRequest<PagedResult<NotificationDto>>;

public class GetNotificationsQueryHandler : IRequestHandler<GetNotificationsQuery, PagedResult<NotificationDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetNotificationsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<PagedResult<NotificationDto>> Handle(GetNotificationsQuery request, CancellationToken cancellationToken)
    {
        var username = _currentUserService.UserName;

        var query = _context.Notifications
            .Where(n => n.CompanyId == _context.CurrentCompanyId && !n.IsDeleted)
            .Where(n => n.TargetUsername == null || n.TargetUsername == username)
            .AsNoTracking();

        if (request.UnreadOnly)
        {
            query = query.Where(n => !n.IsRead);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(n => n.CreatedDate)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(n => new NotificationDto
            {
                Id = n.Id,
                Title = n.Title,
                Message = n.Message,
                Type = n.Type,
                Priority = n.Priority,
                IsRead = n.IsRead,
                ReadAt = n.ReadAt,
                ActionUrl = n.ActionUrl,
                ReferenceId = n.ReferenceId,
                CreatedDate = n.CreatedDate!.Value
            })
            .ToListAsync(cancellationToken);

        return new PagedResult<NotificationDto>(items, totalCount, request.PageNumber, request.PageSize);
    }
}
