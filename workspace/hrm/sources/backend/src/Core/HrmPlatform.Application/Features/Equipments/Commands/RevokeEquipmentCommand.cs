using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Equipments.Commands;

public class RevokeEquipmentCommand : IRequest<bool>
{
    public long EquipmentId { get; set; }
    public string? ConditionStatus { get; set; }
    public string? Note { get; set; }
}

public class RevokeEquipmentCommandValidator : AbstractValidator<RevokeEquipmentCommand>
{
    public RevokeEquipmentCommandValidator()
    {
        RuleFor(x => x.EquipmentId)
            .GreaterThan(0).WithMessage("ID trang thiết bị không hợp lệ.");
    }
}

public class RevokeEquipmentCommandHandler : IRequestHandler<RevokeEquipmentCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public RevokeEquipmentCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(RevokeEquipmentCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var equipment = await _context.Equipments
            .Include(e => e.Histories)
            .FirstOrDefaultAsync(e => e.Id == request.EquipmentId && e.TenantId == tenantId, cancellationToken);

        if (equipment == null)
            throw new NotFoundException($"Không tìm thấy trang thiết bị có ID = {request.EquipmentId}");

        if (equipment.Status == EquipmentStatus.AVAILABLE)
        {
            throw new BadRequestException($"Trang thiết bị '{equipment.Name}' ({equipment.Code}) hiện đang sẵn có trong kho.");
        }

        var previousUserId = equipment.CurrentUserId;
        equipment.Revoke(request.ConditionStatus, request.Note);

        if (previousUserId.HasValue && previousUserId.Value > 0)
        {
            var notification = Notification.Create(
                tenantId: tenantId,
                userId: previousUserId.Value,
                title: "Xác nhận thu hồi trang thiết bị",
                message: $"Thiết bị '{equipment.Name}' (Mã: {equipment.Code}) đã được thu hồi về kho thành công.",
                notificationType: "EQUIPMENT_REVOKED",
                referenceId: equipment.Id,
                targetUrl: "/hrm/equipments"
            );
            _context.Notifications.Add(notification);
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
