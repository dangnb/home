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

public record CreateRoleCommand : IRequest<long>
{
    public string Code { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public List<long> PermissionIds { get; init; } = new();
}

public class CreateRoleCommandValidator : AbstractValidator<CreateRoleCommand>
{
    public CreateRoleCommandValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Mã vai trò không được để trống.")
            .MaximumLength(50).WithMessage("Mã vai trò tối đa 50 ký tự.")
            .Matches("^[A-Za-z0-9_]+$").WithMessage("Mã vai trò chỉ chứa chữ cái, số và dấu gạch dưới (_).");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên vai trò không được để trống.")
            .MaximumLength(100).WithMessage("Tên vai trò tối đa 100 ký tự.");
    }
}

public class CreateRoleCommandHandler : IRequestHandler<CreateRoleCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateRoleCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId;
        var currentUserId = _currentUserService.UserId;
        var code = request.Code.Trim().ToUpperInvariant();

        // Kiểm tra trùng mã vai trò
        var exists = await _context.Roles
            .AnyAsync(r => r.Code == code && (r.TenantId == null || r.TenantId == tenantId), cancellationToken);

        if (exists)
        {
            throw new BadRequestException($"Mã vai trò '{code}' đã tồn tại trong hệ thống.");
        }

        var role = Role.Create(code, request.Name, request.Description, tenantId);
        _context.Roles.Add(role);
        await _context.SaveChangesAsync(cancellationToken);

        // Gán các permissions
        if (request.PermissionIds != null && request.PermissionIds.Any())
        {
            var validPermissionIds = await _context.Permissions
                .Where(p => request.PermissionIds.Contains(p.Id))
                .Select(p => p.Id)
                .ToListAsync(cancellationToken);

            foreach (var permId in validPermissionIds)
            {
                var rolePerm = RolePermission.Create(role.Id, permId, currentUserId);
                _context.RolePermissions.Add(rolePerm);
            }

            await _context.SaveChangesAsync(cancellationToken);
        }

        return role.Id;
    }
}
