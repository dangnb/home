using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.Notifications.Commands.MarkAsRead;

public record MarkNotificationAsReadCommand(Guid Id) : IRequest;

public class MarkNotificationAsReadCommandHandler : IRequestHandler<MarkNotificationAsReadCommand>
{
    private readonly IApplicationDbContext _context;

    public MarkNotificationAsReadCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(MarkNotificationAsReadCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Notifications
            .Where(x => x.Id == request.Id && x.CompanyId == _context.CurrentCompanyId && !x.IsDeleted)
            .FirstOrDefaultAsync(cancellationToken);

        if (entity == null)
        {
            throw new KeyNotFoundException($"Notification with ID {request.Id} not found");
        }

        entity.MarkAsRead();

        await _context.SaveChangesAsync(cancellationToken);
    }
}
