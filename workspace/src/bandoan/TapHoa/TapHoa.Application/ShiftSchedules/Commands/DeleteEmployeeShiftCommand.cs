using MediatR;
using TapHoa.Application.Common.Exceptions;
using TapHoa.Application.Interfaces;
using TapHoa.Domain.Entities;

namespace TapHoa.Application.ShiftSchedules.Commands;

public class DeleteEmployeeShiftCommand : IRequest<Unit>
{
    public Guid Id { get; set; }
}

public class DeleteEmployeeShiftCommandHandler : IRequestHandler<DeleteEmployeeShiftCommand, Unit>
{
    private readonly IApplicationDbContext _context;

    public DeleteEmployeeShiftCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteEmployeeShiftCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.EmployeeShifts.FindAsync(new object[] { request.Id }, cancellationToken);

        if (entity == null)
        {
            throw new NotFoundException(nameof(EmployeeShift), request.Id);
        }

        _context.EmployeeShifts.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
