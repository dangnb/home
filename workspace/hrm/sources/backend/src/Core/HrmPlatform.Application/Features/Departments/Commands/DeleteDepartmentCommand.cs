using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Departments.Commands;

public record DeleteDepartmentCommand(long Id) : IRequest;

public class DeleteDepartmentCommandHandler : IRequestHandler<DeleteDepartmentCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteDepartmentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteDepartmentCommand request, CancellationToken cancellationToken)
    {
        var department = await _context.Departments
            .FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);

        if (department == null)
        {
            throw new NotFoundException("Phòng ban", request.Id);
        }

        // Kiểm tra xem phòng ban có nhân viên đang hoạt động không
        var hasActiveEmployees = await _context.EmployeeProfiles
            .AnyAsync(e => e.DepartmentId == request.Id, cancellationToken);

        if (hasActiveEmployees)
        {
            throw new BadRequestException("Không thể xóa phòng ban đang có nhân viên trực thuộc. Vui lòng chuyển nhân viên sang phòng ban khác trước.");
        }

        // Thao tác Remove sẽ được AuditableEntityInterceptor tự động chuyển thành Soft Delete (Status = DELETED)
        _context.Departments.Remove(department);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
