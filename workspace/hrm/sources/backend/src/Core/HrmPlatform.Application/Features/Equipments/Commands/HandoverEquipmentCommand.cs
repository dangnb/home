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
    public string TargetType { get; set; } = "EMPLOYEE"; // EMPLOYEE or DEPARTMENT
    public long? TargetUserId { get; set; }
    public long? TargetDepartmentId { get; set; }
    public string? ConditionStatus { get; set; }
    public string? Note { get; set; }
}

public class HandoverEquipmentCommandValidator : AbstractValidator<HandoverEquipmentCommand>
{
    public HandoverEquipmentCommandValidator()
    {
        RuleFor(x => x.EquipmentId)
            .GreaterThan(0).WithMessage("ID trang thiết bị không hợp lệ.");
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
            throw new BadRequestException($"Trang thiết bị '{equipment.Name}' ({equipment.Code}) hiện đã được cấp phát sử dụng. Vui lòng thu hồi trước khi bàn giao mới.");
        }

        if (equipment.Status == EquipmentStatus.BROKEN)
        {
            throw new BadRequestException($"Trang thiết bị '{equipment.Name}' đang ở trạng thái báo hỏng. Vui lòng hoàn tất sửa chữa trước khi bàn giao.");
        }

        var isDept = string.Equals(request.TargetType, "DEPARTMENT", StringComparison.OrdinalIgnoreCase);

        if (isDept)
        {
            if (!request.TargetDepartmentId.HasValue || request.TargetDepartmentId <= 0)
                throw new BadRequestException("Vui lòng chọn phòng ban nhận bàn giao thiết bị.");

            var dept = await _context.Departments.FirstOrDefaultAsync(d => d.Id == request.TargetDepartmentId.Value && d.TenantId == tenantId, cancellationToken);
            if (dept == null)
                throw new NotFoundException("Phòng ban không tồn tại trong hệ thống.");

            equipment.Handover(null, request.TargetDepartmentId.Value, request.ConditionStatus, request.Note, "DEPARTMENT");
        }
        else
        {
            if (!request.TargetUserId.HasValue || request.TargetUserId <= 0)
                throw new BadRequestException("Vui lòng chọn nhân sự nhận bàn giao thiết bị.");

            var empProfile = await _context.EmployeeProfiles
                .FirstOrDefaultAsync(ep => ep.TenantId == tenantId && (ep.UserId == request.TargetUserId.Value || ep.Id == request.TargetUserId.Value), cancellationToken);

            var actualUserId = empProfile?.UserId ?? request.TargetUserId.Value;

            equipment.Handover(actualUserId, null, request.ConditionStatus, request.Note, "EMPLOYEE");

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
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
