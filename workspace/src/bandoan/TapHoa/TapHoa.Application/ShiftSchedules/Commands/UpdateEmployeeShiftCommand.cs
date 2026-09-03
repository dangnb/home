using FluentValidation;
using MediatR;
using TapHoa.Domain.Exceptions;
using TapHoa.Application.Interfaces;

namespace TapHoa.Application.ShiftSchedules.Commands;

public class UpdateEmployeeShiftCommand : IRequest
{
    public Guid Id { get; set; }
    public string ShiftType { get; set; } = null!;
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public bool IsOvertime { get; set; }
    public decimal SalaryMultiplier { get; set; }
    public string? Notes { get; set; }
}

public class UpdateEmployeeShiftCommandValidator : AbstractValidator<UpdateEmployeeShiftCommand>
{
    public UpdateEmployeeShiftCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.ShiftType).NotEmpty();
        RuleFor(x => x.EndTime).GreaterThan(x => x.StartTime).WithMessage("End time must be after start time");
        RuleFor(x => x.SalaryMultiplier).GreaterThan(0);
    }
}

public class UpdateEmployeeShiftCommandHandler : IRequestHandler<UpdateEmployeeShiftCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateEmployeeShiftCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateEmployeeShiftCommand request, CancellationToken cancellationToken)
    {
        var shift = await _context.EmployeeShifts.FindAsync(new object[] { request.Id }, cancellationToken);

        if (shift == null)
        {
            throw new KeyNotFoundException($"EmployeeShift with ID {request.Id} not found.");
        }

        shift.UpdateDetails(
            request.ShiftType,
            request.StartTime,
            request.EndTime,
            request.IsOvertime,
            request.SalaryMultiplier,
            request.Notes
        );

        await _context.SaveChangesAsync(cancellationToken);
    }
}
