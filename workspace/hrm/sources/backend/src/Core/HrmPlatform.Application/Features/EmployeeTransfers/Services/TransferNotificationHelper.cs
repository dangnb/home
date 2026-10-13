using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.EmployeeTransfers.Services;

public static class TransferNotificationHelper
{
    private static readonly Guid DefaultAdminUserId = Guid.Parse("01956100-0000-7000-8000-000000000003");

    public static async Task SendStepNotificationAsync(
        IApplicationDbContext context,
        EmployeeJobHistory history,
        Guid tenantId,
        CancellationToken cancellationToken)
    {
        var employee = await context.EmployeeProfiles
            .FirstOrDefaultAsync(e => e.Id == history.EmployeeId && e.TenantId == tenantId, cancellationToken);
        var employeeName = employee != null ? await GetUserNameAsync(context, employee.UserId, cancellationToken) : "Nhân viên";

        Guid targetUserId = DefaultAdminUserId;
        string stepRole = "";

        switch (history.CurrentStep)
        {
            case 1:
                targetUserId = await ResolveUserIdAsync(context, history.OldManagerId ?? employee?.ManagerId, DefaultAdminUserId, tenantId, cancellationToken);
                stepRole = "Trưởng phòng Quản lý hiện tại";
                break;
            case 2:
                targetUserId = await ResolveUserIdAsync(context, history.NewManagerId ?? employee?.ManagerId, DefaultAdminUserId, tenantId, cancellationToken);
                stepRole = "Trưởng phòng tiếp nhận";
                break;
            case 3:
                targetUserId = await GetHRManagerUserIdAsync(context, tenantId, cancellationToken);
                stepRole = "Phòng Nhân Sự (HR)";
                break;
            case 4:
                targetUserId = await GetDirectorUserIdAsync(context, tenantId, cancellationToken);
                stepRole = "Ban Giám Đốc";
                break;
        }

        var targetUserIds = new HashSet<Guid> { targetUserId };
        // Always include creator / default admin so current user sees notification in test environment
        if (history.CreatedBy.HasValue && history.CreatedBy.Value != Guid.Empty)
            targetUserIds.Add(history.CreatedBy.Value);
        targetUserIds.Add(DefaultAdminUserId);

        foreach (var userId in targetUserIds)
        {
            var notif = Notification.Create(
                tenantId: tenantId,
                userId: userId,
                title: $"🔔 Lệnh điều động {history.DecisionNumber} đang chờ phê duyệt",
                message: $"Lệnh điều động của nhân sự '{employeeName}' đang chờ ({stepRole}) xem xét phê duyệt tại Bước {history.CurrentStep}.",
                notificationType: "TRANSFER_APPROVAL_REQUIRED",
                referenceId: history.Id,
                targetUrl: "/hrm/transfers"
            );

            context.Notifications.Add(notif);
        }
    }

    public static async Task SendCompletedNotificationsAsync(
        IApplicationDbContext context,
        EmployeeJobHistory history,
        Guid tenantId,
        CancellationToken cancellationToken)
    {
        var employee = await context.EmployeeProfiles
            .FirstOrDefaultAsync(e => e.Id == history.EmployeeId && e.TenantId == tenantId, cancellationToken);

        var employeeName = employee != null ? await GetUserNameAsync(context, employee.UserId, cancellationToken) : "Nhân viên";

        var targetUserIds = new HashSet<Guid> { DefaultAdminUserId }; // Always include admin

        if (employee != null && employee.UserId != Guid.Empty)
            targetUserIds.Add(employee.UserId);

        var oldManagerUserId = await ResolveUserIdAsync(context, history.OldManagerId, Guid.Empty, tenantId, cancellationToken);
        if (oldManagerUserId != Guid.Empty) targetUserIds.Add(oldManagerUserId);

        var newManagerUserId = await ResolveUserIdAsync(context, history.NewManagerId, Guid.Empty, tenantId, cancellationToken);
        if (newManagerUserId != Guid.Empty) targetUserIds.Add(newManagerUserId);

        if (history.CreatedBy.HasValue && history.CreatedBy.Value != Guid.Empty)
            targetUserIds.Add(history.CreatedBy.Value);

        foreach (var userId in targetUserIds)
        {
            var notif = Notification.Create(
                tenantId: tenantId,
                userId: userId,
                title: $"✅ Lệnh điều động {history.DecisionNumber} đã hoàn thành phê duyệt!",
                message: $"Lệnh điều động nhân sự '{employeeName}' (Số QĐ: {history.DecisionNumber}) đã được Giám Đốc phê duyệt hoàn tất và chính thức có hiệu lực từ ngày {history.EffectiveDate:dd/MM/yyyy}.",
                notificationType: "TRANSFER_COMPLETED",
                referenceId: history.Id,
                targetUrl: "/hrm/transfers"
            );

            context.Notifications.Add(notif);
        }
    }

    public static async Task SendRejectedNotificationsAsync(
        IApplicationDbContext context,
        EmployeeJobHistory history,
        Guid tenantId,
        string reason,
        CancellationToken cancellationToken)
    {
        var employee = await context.EmployeeProfiles
            .FirstOrDefaultAsync(e => e.Id == history.EmployeeId && e.TenantId == tenantId, cancellationToken);

        var employeeName = employee != null ? await GetUserNameAsync(context, employee.UserId, cancellationToken) : "Nhân viên";

        var targetUserIds = new HashSet<Guid> { DefaultAdminUserId };

        if (employee != null && employee.UserId != Guid.Empty)
            targetUserIds.Add(employee.UserId);

        if (history.CreatedBy.HasValue && history.CreatedBy.Value != Guid.Empty)
            targetUserIds.Add(history.CreatedBy.Value);

        foreach (var userId in targetUserIds)
        {
            var notif = Notification.Create(
                tenantId: tenantId,
                userId: userId,
                title: $"❌ Lệnh điều động {history.DecisionNumber} đã bị từ chối",
                message: $"Lệnh điều động nhân sự '{employeeName}' (Số QĐ: {history.DecisionNumber}) bị từ chối phê duyệt. Lý do: {reason}",
                notificationType: "TRANSFER_REJECTED",
                referenceId: history.Id,
                targetUrl: "/hrm/transfers"
            );

            context.Notifications.Add(notif);
        }
    }

    private static async Task<Guid> ResolveUserIdAsync(IApplicationDbContext context, Guid? employeeId, Guid fallbackUserId, Guid tenantId, CancellationToken ct)
    {
        if (employeeId.HasValue && employeeId.Value != Guid.Empty)
        {
            var emp = await context.EmployeeProfiles.FirstOrDefaultAsync(e => e.Id == employeeId.Value && e.TenantId == tenantId, ct);
            if (emp != null && emp.UserId != Guid.Empty)
            {
                return emp.UserId;
            }
        }
        return fallbackUserId;
    }

    private static async Task<string> GetUserNameAsync(IApplicationDbContext context, Guid userId, CancellationToken ct)
    {
        var u = await context.Users.FirstOrDefaultAsync(x => x.Id == userId, ct);
        return u?.FullName ?? "Nhân viên";
    }

    private static async Task<Guid> GetHRManagerUserIdAsync(IApplicationDbContext context, Guid tenantId, CancellationToken ct)
    {
        var hrUser = await context.Users.FirstOrDefaultAsync(u => u.TenantId == tenantId && u.Username.Contains("hr"), ct);
        return hrUser?.Id ?? DefaultAdminUserId;
    }

    private static async Task<Guid> GetDirectorUserIdAsync(IApplicationDbContext context, Guid tenantId, CancellationToken ct)
    {
        var dirUser = await context.Users.FirstOrDefaultAsync(u => u.TenantId == tenantId && (u.Username.Contains("director") || u.Username.Contains("admin")), ct);
        return dirUser?.Id ?? DefaultAdminUserId;
    }
}
