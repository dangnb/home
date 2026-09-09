using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Employees.Commands;

public record DeleteEmployeeCommand(long Id) : IRequest;

public class DeleteEmployeeCommandHandler : IRequestHandler<DeleteEmployeeCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteEmployeeCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteEmployeeCommand request, CancellationToken cancellationToken)
    {
        var profile = await _context.EmployeeProfiles
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

        if (profile == null)
        {
            throw new NotFoundException("Hồ sơ nhân sự", request.Id);
        }

        // Xóa mềm hồ sơ nhân sự qua domain method
        profile.Delete();

        // Vô hiệu hóa tài khoản User liên kết qua domain method
        profile.User?.Deactivate();

        await _context.SaveChangesAsync(cancellationToken);
    }
}
