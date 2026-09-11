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

public class BulkRevokeEquipmentsCommand : IRequest<int>
{
    public List<long> EquipmentIds { get; set; } = new List<long>();
    public string? ConditionStatus { get; set; }
    public string? Note { get; set; }
}

public class BulkRevokeEquipmentsCommandValidator : AbstractValidator<BulkRevokeEquipmentsCommand>
{
    public BulkRevokeEquipmentsCommandValidator()
    {
        RuleFor(x => x.EquipmentIds)
            .NotEmpty().WithMessage("Vui lòng chọn ít nhất 1 trang thiết bị để thu hồi.");
    }
}

public class BulkRevokeEquipmentsCommandHandler : IRequestHandler<BulkRevokeEquipmentsCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public BulkRevokeEquipmentsCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<int> Handle(BulkRevokeEquipmentsCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        if (request.EquipmentIds == null || !request.EquipmentIds.Any())
            throw new BadRequestException("Vui lòng chọn danh sách trang thiết bị cần thu hồi.");

        var equipments = await _context.Equipments
            .Include(e => e.Histories)
            .Where(e => request.EquipmentIds.Contains(e.Id) && e.TenantId == tenantId)
            .ToListAsync(cancellationToken);

        if (!equipments.Any())
            throw new NotFoundException("Không tìm thấy các trang thiết bị đã chọn.");

        int countRevoked = 0;

        foreach (var equipment in equipments)
        {
            if (equipment.Status == EquipmentStatus.AVAILABLE)
                continue; // Đã có trong kho rồi thì không cần thu hồi nữa

            var previousUserId = equipment.CurrentUserId;
            equipment.Revoke(request.ConditionStatus, request.Note);

            if (previousUserId.HasValue && previousUserId.Value > 0)
            {
                var notification = Notification.Create(
                    tenantId: tenantId,
                    userId: previousUserId.Value,
                    title: "Xác nhận thu hồi trang thiết bị",
                    message: $"Thiết bị '{equipment.Name}' (Mã: {equipment.Code}) đã được thu hồi về kho.",
                    notificationType: "EQUIPMENT_REVOKED",
                    referenceId: equipment.Id,
                    targetUrl: "/hrm/equipments"
                );
                _context.Notifications.Add(notification);
            }

            countRevoked++;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return countRevoked;
    }
}
