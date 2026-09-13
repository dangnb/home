using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Roles.Commands;

public record DeleteRoleCommand(Guid Id) : IRequest<Unit>;

public class DeleteRoleCommandHandler : IRequestHandler<DeleteRoleCommand, Unit>
{
    private static readonly HashSet<string> SystemRoles = new(new[]
    {
        "SUPER_ADMIN",
        "TENANT_ADMIN",
        "HR_MANAGER",
        "EMPLOYEE"
    }, StringComparer.OrdinalIgnoreCase);

    private readonly IApplicationDbContext _context;

    public DeleteRoleCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Unit> Handle(DeleteRoleCommand request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles.FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);
        if (role == null)
        {
            throw new NotFoundException($"Không tìm thấy vai trò với ID {request.Id}.");
        }

        // Bảo vệ vai trò hệ thống
        if (role.TenantId == null || SystemRoles.Contains(role.Code))
        {
            throw new BadRequestException($"Vai trò hệ thống mặc định '{role.Name}' ({role.Code}) không được phép xóa.");
        }

        // Kiểm tra xem có người dùng nào đang giữ vai trò này không
        var userCount = await _context.UserRoles.CountAsync(ur => ur.RoleId == role.Id, cancellationToken);
        if (userCount > 0)
        {
            throw new BadRequestException($"Không thể xóa vai trò '{role.Name}' vì đang có {userCount} người dùng được gán vai trò này.");
        }

        // Xóa các liên kết quyền
        var rolePerms = await _context.RolePermissions.Where(rp => rp.RoleId == role.Id).ToListAsync(cancellationToken);
        _context.RolePermissions.RemoveRange(rolePerms);

        _context.Roles.Remove(role);
        await _context.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
