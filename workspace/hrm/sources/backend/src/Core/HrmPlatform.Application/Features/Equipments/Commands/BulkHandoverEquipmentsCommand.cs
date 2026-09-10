using System;
using System.Collections.Generic;
using System.Linq;
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

public class BulkHandoverEquipmentsCommand : IRequest<int>
{
    public List<long> EquipmentIds { get; set; } = new List<long>();
    public string TargetType { get; set; } = "EMPLOYEE"; // EMPLOYEE or DEPARTMENT
    public long? TargetUserId { get; set; }
    public long? TargetDepartmentId { get; set; }
    public string? ConditionStatus { get; set; }
    public string? Note { get; set; }
}

public class BulkHandoverEquipmentsCommandValidator : AbstractValidator<BulkHandoverEquipmentsCommand>
{
    public BulkHandoverEquipmentsCommandValidator()
    {
        RuleFor(x => x.EquipmentIds)
            .NotEmpty().WithMessage("Vui lòng chọn ít nhất 1 trang thiết bị để bàn giao.");
    }
}

public class BulkHandoverEquipmentsCommandHandler : IRequestHandler<BulkHandoverEquipmentsCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public BulkHandoverEquipmentsCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<int> Handle(BulkHandoverEquipmentsCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        if (request.EquipmentIds == null || !request.EquipmentIds.Any())
            throw new BadRequestException("Vui lòng chọn danh sách trang thiết bị cần bàn giao.");

        var equipments = await _context.Equipments
            .Include(e => e.Histories)
            .Where(e => request.EquipmentIds.Contains(e.Id) && e.TenantId == tenantId)
            .ToListAsync(cancellationToken);

        if (!equipments.Any())
            throw new NotFoundException("Không tìm thấy các trang thiết bị đã chọn.");

        var isDept = string.Equals(request.TargetType, "DEPARTMENT", StringComparison.OrdinalIgnoreCase);

        long? actualUserId = null;
        if (isDept)
        {
            if (!request.TargetDepartmentId.HasValue || request.TargetDepartmentId <= 0)
                throw new BadRequestException("Vui lòng chọn phòng ban nhận bàn giao thiết bị.");

            var dept = await _context.Departments.FirstOrDefaultAsync(d => d.Id == request.TargetDepartmentId.Value && d.TenantId == tenantId, cancellationToken);
            if (dept == null)
                throw new NotFoundException("Phòng ban không tồn tại trong hệ thống.");
        }
        else
        {
            if (!request.TargetUserId.HasValue || request.TargetUserId <= 0)
                throw new BadRequestException("Vui lòng chọn nhân sự nhận bàn giao thiết bị.");

            var empProfile = await _context.EmployeeProfiles
                .FirstOrDefaultAsync(ep => ep.TenantId == tenantId && (ep.UserId == request.TargetUserId.Value || ep.Id == request.TargetUserId.Value), cancellationToken);

            actualUserId = empProfile?.UserId ?? request.TargetUserId.Value;
        }

        int countHandedOver = 0;

        foreach (var equipment in equipments)
        {
            if (equipment.Status == EquipmentStatus.BROKEN)
                continue; // Bỏ qua thiết bị đang hỏng

            if (isDept)
            {
                equipment.Handover(null, request.TargetDepartmentId.Value, request.ConditionStatus, request.Note, "DEPARTMENT");
            }
            else
            {
                equipment.Handover(actualUserId.Value, null, request.ConditionStatus, request.Note, "EMPLOYEE");
            }

            countHandedOver++;
        }

        if (countHandedOver > 0 && !isDept && actualUserId.HasValue)
        {
            var notification = Notification.Create(
                tenantId: tenantId,
                userId: actualUserId.Value,
                title: "Bàn giao trang thiết bị hàng loạt",
                message: $"Bạn đã được bàn giao {countHandedOver} trang thiết bị mới. Vui lòng kiểm tra danh mục thiết bị của bạn.",
                notificationType: "EQUIPMENT_HANDOVER",
                referenceId: equipments.First().Id,
                targetUrl: "/hrm/equipments"
            );
            _context.Notifications.Add(notification);
        }

        await _context.SaveChangesAsync(cancellationToken);
        return countHandedOver;
    }
}
