using MediatR;
using Microsoft.EntityFrameworkCore;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.ShiftSchedules.Queries;

public class GetEmployeeShiftsQuery : IRequest<List<EmployeeShiftDto>>
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? Username { get; set; }
}

public class EmployeeShiftDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public DateTime ShiftDate { get; set; }
    public string ShiftType { get; set; } = null!;
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string? Notes { get; set; }
}

public class GetEmployeeShiftsQueryHandler : IRequestHandler<GetEmployeeShiftsQuery, List<EmployeeShiftDto>>
{
    private readonly IApplicationDbContext _context;

    public GetEmployeeShiftsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<EmployeeShiftDto>> Handle(GetEmployeeShiftsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.EmployeeShifts
            .Where(x => x.ShiftDate >= request.StartDate.Date && x.ShiftDate <= request.EndDate.Date);

        if (!string.IsNullOrEmpty(request.Username))
        {
            query = query.Where(x => x.Username == request.Username);
        }

        var list = await query
            .OrderBy(x => x.ShiftDate)
            .ThenBy(x => x.StartTime)
            .Select(x => new EmployeeShiftDto
            {
                Id = x.Id,
                Username = x.Username,
                ShiftDate = x.ShiftDate,
                ShiftType = x.ShiftType,
                StartTime = x.StartTime,
                EndTime = x.EndTime,
                Notes = x.Notes
            })
            .ToListAsync(cancellationToken);

        return list;
    }
}
