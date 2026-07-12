using MediatR;

using TapHoa.Application.Interfaces;

namespace TapHoa.Application.ShiftSchedules.Commands;

public class MoveEmployeeShiftCommand : IRequest
{
    public Guid Id { get; set; }
    public DateTime NewDate { get; set; }
}

public class MoveEmployeeShiftCommandHandler : IRequestHandler<MoveEmployeeShiftCommand>
{
    private readonly IApplicationDbContext _context;

    public MoveEmployeeShiftCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(MoveEmployeeShiftCommand request, CancellationToken cancellationToken)
    {
        var shift = await _context.EmployeeShifts.FindAsync(new object[] { request.Id }, cancellationToken);

        if (shift == null)
        {
            throw new KeyNotFoundException($"EmployeeShift with ID {request.Id} not found.");
        }

        shift.MoveToDate(request.NewDate);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
