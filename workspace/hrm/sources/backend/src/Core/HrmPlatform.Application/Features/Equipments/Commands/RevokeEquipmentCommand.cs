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
    public Guid EquipmentId { get; set; }
    public string? ConditionStatus { get; set; }
    public string? Note { get; set; }
}

public class RevokeEquipmentCommandValidator : AbstractValidator<RevokeEquipmentCommand>
{
    public RevokeEquipmentCommandValidator()
    {
        RuleFor(x => x.EquipmentId)
            .NotEmpty().WithMessage("ID trang thiết bị không hợp lệ.");
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
        var tenantId = _currentUserService.TenantId ?? Guid.Parse("01956100-0000-7000-8000-000000000001");

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

        if (previousUserId.HasValue && previousUserId.Value != Guid.Empty)
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
