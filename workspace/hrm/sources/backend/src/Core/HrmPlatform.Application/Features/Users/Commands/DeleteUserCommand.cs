using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Users.Commands;

public record DeleteUserCommand(long Id) : IRequest;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteUserCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

        if (user == null)
        {
            throw new NotFoundException("Người dùng", request.Id);
        }

        // Không cho phép xóa tài khoản SuperAdmin
        if (user.Id == 1 || user.Username.Equals("superadmin", StringComparison.OrdinalIgnoreCase))
        {
            throw new BadRequestException("Không thể xóa tài khoản Quản trị viên cấp cao nhất (SuperAdmin).");
        }

        // Thực hiện Xóa mềm (Soft Delete) qua domain method
        user.Delete();

        await _context.SaveChangesAsync(cancellationToken);
    }
}
