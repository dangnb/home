using System;
using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.EquipmentRepairs.Commands;

public class UpdateRepairProgressCommand : IRequest<bool>
{
    public long RepairId { get; set; }
    public string Status { get; set; } = string.Empty; // IN_PROGRESS, COMPLETED, UNREPAIRABLE
    public string? ActualError { get; set; }
    public string? SolutionDetail { get; set; }
    public string? ReplacedParts { get; set; }
    public decimal? RepairCost { get; set; }
    public string? Note { get; set; }
}

public class UpdateRepairProgressCommandHandler : IRequestHandler<UpdateRepairProgressCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateRepairProgressCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(UpdateRepairProgressCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var userId = _currentUserService.UserId ?? 1;

        var repair = await _context.EquipmentRepairs
            .Include(r => r.Equipment)
            .FirstOrDefaultAsync(r => r.Id == request.RepairId && r.TenantId == tenantId, cancellationToken);

        if (repair == null)
            throw new NotFoundException("EquipmentRepair", request.RepairId);

        repair.UpdateProgress(
            status: request.Status,
            actualError: request.ActualError,
            solutionDetail: request.SolutionDetail,
            replacedParts: request.ReplacedParts,
            repairCost: request.RepairCost,
            note: request.Note,
            performedBy: userId
        );

        var newStatus = request.Status.Trim().ToUpper();

        // Equipment status sync
        if (newStatus == EquipmentRepairStatus.COMPLETED)
        {
            // Reset equipment status back to AVAILABLE or ASSIGNED
            var equipment = repair.Equipment;
            if (equipment != null)
            {
                var newEquipmentStatus = (equipment.CurrentUserId.HasValue || equipment.CurrentDepartmentId.HasValue) 
                    ? EquipmentStatus.ASSIGNED 
                    : EquipmentStatus.AVAILABLE;

                equipment.Status = newEquipmentStatus;

                // Add history record for completion
                var defaultSolution = "Đã xử lý xong";
                var historyNote = $"Hoàn tất sửa chữa IT. Cách khắc phục: {request.SolutionDetail ?? defaultSolution}";
                if (!string.IsNullOrWhiteSpace(request.ReplacedParts))
                {
                    historyNote += $" | Linh kiện: {request.ReplacedParts}";
                }

                var targetType = equipment.CurrentDepartmentId.HasValue ? "DEPARTMENT" : "EMPLOYEE";

                var history = EquipmentHistory.Create(
                    tenantId: tenantId,
                    equipmentId: equipment.Id,
                    userId: equipment.CurrentUserId,
                    actionType: EquipmentActionType.REPAIR_COMPLETED,
                    conditionStatus: request.ActualError ?? "Đã sửa chữa hoạt động bình thường",
                    note: historyNote,
                    performedBy: userId,
                    departmentId: equipment.CurrentDepartmentId,
                    targetType: targetType
                );

                _context.EquipmentHistories.Add(history);
            }
        }
        else if (newStatus == EquipmentRepairStatus.UNREPAIRABLE)
        {
            var equipment = repair.Equipment;
            if (equipment != null)
            {
                equipment.Status = EquipmentStatus.MAINTENANCE;

                var targetType = equipment.CurrentDepartmentId.HasValue ? "DEPARTMENT" : "EMPLOYEE";

                var history = EquipmentHistory.Create(
                    tenantId: tenantId,
                    equipmentId: equipment.Id,
                    userId: equipment.CurrentUserId,
                    actionType: EquipmentActionType.REPORT_BROKEN,
                    conditionStatus: "Không thể sửa chữa - Đề xuất thanh lý",
                    note: request.Note ?? request.SolutionDetail,
                    performedBy: userId,
                    departmentId: equipment.CurrentDepartmentId,
                    targetType: targetType
                );

                _context.EquipmentHistories.Add(history);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
