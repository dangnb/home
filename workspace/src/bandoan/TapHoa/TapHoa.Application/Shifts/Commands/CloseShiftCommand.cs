using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.Shifts.Commands;

public record CloseShiftCommand(decimal ActualCash, string? Notes) : IRequest<bool>;

public class CloseShiftCommandValidator : AbstractValidator<CloseShiftCommand>
{
    public CloseShiftCommandValidator()
    {
        RuleFor(v => v.ActualCash).GreaterThanOrEqualTo(0);
    }
}

public class CloseShiftCommandHandler : IRequestHandler<CloseShiftCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CloseShiftCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(CloseShiftCommand request, CancellationToken cancellationToken)
    {
        var userName = _currentUserService.UserName;
        if (string.IsNullOrEmpty(userName))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var shift = await _context.Shifts
            .FirstOrDefaultAsync(s => s.Username == userName && s.Status == ShiftStatus.Open, cancellationToken);

        if (shift == null)
        {
            throw new InvalidOperationException("No open shift found to close.");
        }

        // Calculate expected cash: StartingCash + (Total Cash Payments for orders created by this user since Shift StartTime)
        var cashSales = await _context.Orders
            .Where(o => o.CreatedBy == userName && 
                        o.PaymentMethod == TapHoa.Domain.Enums.PaymentMethod.Cash && 
                        o.CreatedDate >= shift.StartTime)
            .SumAsync(o => o.AmountPaid, cancellationToken);

        // Include any cash return orders (refunds)
        var cashRefunds = await _context.ReturnOrders
            .Where(r => r.CreatedBy == userName && 
                        r.Status == TapHoa.Domain.Enums.ReturnStatus.Approved &&
                        r.CreatedDate >= shift.StartTime) // Assuming refunds are given in cash
            .SumAsync(r => r.RefundAmount, cancellationToken);

        var expectedCash = shift.StartingCash + cashSales - cashRefunds;

        shift.CloseShift(request.ActualCash, expectedCash, request.Notes);

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
