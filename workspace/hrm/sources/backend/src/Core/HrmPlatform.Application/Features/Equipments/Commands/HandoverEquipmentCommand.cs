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

public class HandoverEquipmentCommand : IRequest<bool>
{
    public long EquipmentId { get; set; }
    public long TargetUserId { get; set; }
    public string? ConditionStatus { get; set; }
    public string? Note { get; set; }
}

public class HandoverEquipmentCommandValidator : AbstractValidator<HandoverEquipmentCommand>
{
    public HandoverEquipmentCommandValidator()
    {
        RuleFor(x => x.EquipmentId)
            .GreaterThan(0).WithMessage("ID trang thiết bị không hợp lệ.");

        RuleFor(x => x.TargetUserId)
            .GreaterThan(0).WithMessage("Vui lòng chọn nhân sự nhận thiết bị.");
    }
}

public class HandoverEquipmentCommandHandler : IRequestHandler<HandoverEquipmentCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public HandoverEquipmentCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(HandoverEquipmentCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var equipment = await _context.Equipments
            .Include(e => e.Histories)
            .FirstOrDefaultAsync(e => e.Id == request.EquipmentId && e.TenantId == tenantId, cancellationToken);

        if (equipment == null)
            throw new NotFoundException($"Không tìm thấy trang thiết bị có ID = {request.EquipmentId}");

        if (equipment.Status == EquipmentStatus.ASSIGNED)
        {
            throw new BadRequestException($"Trang thiết bị '{equipment.Name}' ({equipment.Code}) hiện đã được bàn giao cho nhân sự khác sử dụng. Vui lòng thu hồi trước khi bàn giao mới.");
        }

        if (equipment.Status == EquipmentStatus.BROKEN)
        {
            throw new BadRequestException($"Trang thiết bị '{equipment.Name}' đang ở trạng thái báo hỏng. Vui lòng hoàn tất sửa chữa trước khi bàn giao.");
        }

        // Resolution: targetUserId might be User.Id or EmployeeProfile.Id
        var empProfile = await _context.EmployeeProfiles
            .FirstOrDefaultAsync(ep => ep.TenantId == tenantId && (ep.UserId == request.TargetUserId || ep.Id == request.TargetUserId), cancellationToken);

        var actualUserId = empProfile?.UserId ?? request.TargetUserId;

        equipment.Handover(actualUserId, request.ConditionStatus, request.Note);

        // Tạo Notification
        var notification = Notification.Create(
            tenantId: tenantId,
            userId: actualUserId,
            title: "Bàn giao trang thiết bị mới",
            message: $"Bạn đã được bàn giao thiết bị '{equipment.Name}' (Mã: {equipment.Code}). Tình trạng: {request.ConditionStatus ?? "Mới 100% / Đang hoạt động tốt"}.",
            notificationType: "EQUIPMENT_HANDOVER",
            referenceId: equipment.Id,
            targetUrl: "/hrm/equipments"
        );
        _context.Notifications.Add(notification);

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
