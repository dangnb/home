using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Identity;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Roles.Commands;

public record UpdateRoleCommand : IRequest<Unit>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public List<Guid> PermissionIds { get; init; } = new();
}

public class UpdateRoleCommandValidator : AbstractValidator<UpdateRoleCommand>
{
    public UpdateRoleCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("ID vai trò không hợp lệ.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên vai trò không được để trống.")
            .MaximumLength(100).WithMessage("Tên vai trò tối đa 100 ký tự.");
    }
}

public class UpdateRoleCommandHandler : IRequestHandler<UpdateRoleCommand, Unit>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateRoleCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Unit> Handle(UpdateRoleCommand request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles
            .Include(r => r.RolePermissions)
            .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

        if (role == null)
        {
            throw new NotFoundException($"Không tìm thấy vai trò với ID {request.Id}.");
        }

        role.Update(request.Name, request.Description);

        // Đồng bộ danh sách permissions
        var existingPermIds = role.RolePermissions.Select(rp => rp.PermissionId).ToHashSet();
        var desiredPermIds = (request.PermissionIds ?? new List<Guid>()).Distinct().ToHashSet();

        // Xóa những quyền không còn được chọn
        var permsToRemove = role.RolePermissions.Where(rp => !desiredPermIds.Contains(rp.PermissionId)).ToList();
        foreach (var rp in permsToRemove)
        {
            _context.RolePermissions.Remove(rp);
        }

        // Thêm các quyền mới được chọn
        var permsToAdd = desiredPermIds.Where(pId => !existingPermIds.Contains(pId)).ToList();
        if (permsToAdd.Any())
        {
            var validToAdd = await _context.Permissions
                .Where(p => permsToAdd.Contains(p.Id))
                .Select(p => p.Id)
                .ToListAsync(cancellationToken);

            var currentUserId = _currentUserService.UserId;
            foreach (var permId in validToAdd)
            {
                var rolePerm = RolePermission.Create(role.Id, permId, currentUserId);
                _context.RolePermissions.Add(rolePerm);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
