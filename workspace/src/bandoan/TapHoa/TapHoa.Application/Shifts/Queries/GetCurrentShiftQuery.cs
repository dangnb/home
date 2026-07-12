using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.Shifts.Queries;

public record GetCurrentShiftQuery() : IRequest<ShiftDto?>;

public class ShiftDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public decimal StartingCash { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class GetCurrentShiftQueryHandler : IRequestHandler<GetCurrentShiftQuery, ShiftDto?>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetCurrentShiftQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<ShiftDto?> Handle(GetCurrentShiftQuery request, CancellationToken cancellationToken)
    {
        var userName = _currentUserService.UserName;
        if (string.IsNullOrEmpty(userName)) return null;

        var shift = await _context.Shifts
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.Username == userName && s.Status == ShiftStatus.Open, cancellationToken);

        if (shift == null) return null;

        return new ShiftDto
        {
            Id = shift.Id,
            Username = shift.Username,
            StartTime = shift.StartTime,
            StartingCash = shift.StartingCash,
            Status = shift.Status.ToString()
        };
    }
}
