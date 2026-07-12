using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.Shifts.Commands;

public record OpenShiftCommand(decimal StartingCash) : IRequest<Guid>;

public class OpenShiftCommandValidator : AbstractValidator<OpenShiftCommand>
{
    public OpenShiftCommandValidator()
    {
        RuleFor(v => v.StartingCash).GreaterThanOrEqualTo(0);
    }
}

public class OpenShiftCommandHandler : IRequestHandler<OpenShiftCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public OpenShiftCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(OpenShiftCommand request, CancellationToken cancellationToken)
    {
        var userName = _currentUserService.UserName;
        if (string.IsNullOrEmpty(userName))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        // Check if there is already an open shift for this user
        var existingShift = await _context.Shifts
            .FirstOrDefaultAsync(s => s.Username == userName && s.Status == ShiftStatus.Open, cancellationToken);

        if (existingShift != null)
        {
            throw new InvalidOperationException("You already have an open shift. Please close it first.");
        }

        var shift = new Shift(userName, request.StartingCash);

        _context.Shifts.Add(shift);
        await _context.SaveChangesAsync(cancellationToken);

        return shift.Id;
    }
}
