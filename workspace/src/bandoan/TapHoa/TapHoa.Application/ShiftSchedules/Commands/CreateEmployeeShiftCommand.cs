using FluentValidation;
using MediatR;
using TapHoa.Domain.Exceptions;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.ShiftSchedules.Commands;

public class CreateEmployeeShiftCommand : IRequest<Guid>
{
    public string Username { get; set; } = null!;
    public DateTime ShiftDate { get; set; }
    public string ShiftType { get; set; } = null!;
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string? Notes { get; set; }
}

public class CreateEmployeeShiftCommandValidator : AbstractValidator<CreateEmployeeShiftCommand>
{
    public CreateEmployeeShiftCommandValidator()
    {
        RuleFor(x => x.Username).NotEmpty();
        RuleFor(x => x.ShiftDate).NotEmpty();
        RuleFor(x => x.ShiftType).NotEmpty();
        RuleFor(x => x.EndTime).GreaterThan(x => x.StartTime).WithMessage("End time must be after start time");
    }
}

public class CreateEmployeeShiftCommandHandler : IRequestHandler<CreateEmployeeShiftCommand, Guid>
{
    private readonly IApplicationDbContext _context;

    public CreateEmployeeShiftCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> Handle(CreateEmployeeShiftCommand request, CancellationToken cancellationToken)
    {
        var shift = new EmployeeShift(
            request.Username,
            request.ShiftDate,
            request.ShiftType,
            request.StartTime,
            request.EndTime,
            request.Notes
        );

        _context.EmployeeShifts.Add(shift);
        await _context.SaveChangesAsync(cancellationToken);

        return shift.Id;
    }
}
