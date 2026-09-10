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
    public static async Task SendStepNotificationAsync(
        IApplicationDbContext context,
        EmployeeJobHistory history,
        long tenantId,
        CancellationToken cancellationToken)
    {
        var employee = await context.EmployeeProfiles
            .FirstOrDefaultAsync(e => e.Id == history.EmployeeId && e.TenantId == tenantId, cancellationToken);
        var employeeName = employee != null ? await GetUserNameAsync(context, employee.UserId, cancellationToken) : "Nhân viên";

        long targetUserId = 1;
        string stepRole = "";

        switch (history.CurrentStep)
        {
            case 1:
                targetUserId = await ResolveUserIdAsync(context, history.OldManagerId ?? employee?.ManagerId, 1, tenantId, cancellationToken);
                stepRole = "Trưởng phòng Quản lý hiện tại";
                break;
            case 2:
                targetUserId = await ResolveUserIdAsync(context, history.NewManagerId ?? employee?.ManagerId, 1, tenantId, cancellationToken);
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

        var targetUserIds = new HashSet<long> { targetUserId };
        // Always include creator / default admin so current user sees notification in test environment
        if (history.CreatedBy.HasValue && history.CreatedBy.Value > 0)
            targetUserIds.Add(history.CreatedBy.Value);
        targetUserIds.Add(1);

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
        long tenantId,
        CancellationToken cancellationToken)
    {
        var employee = await context.EmployeeProfiles
            .FirstOrDefaultAsync(e => e.Id == history.EmployeeId && e.TenantId == tenantId, cancellationToken);

        var employeeName = employee != null ? await GetUserNameAsync(context, employee.UserId, cancellationToken) : "Nhân viên";

        var targetUserIds = new HashSet<long> { 1 }; // Always include admin

        if (employee != null && employee.UserId > 0)
            targetUserIds.Add(employee.UserId);

        var oldManagerUserId = await ResolveUserIdAsync(context, history.OldManagerId, 0, tenantId, cancellationToken);
        if (oldManagerUserId > 0) targetUserIds.Add(oldManagerUserId);

        var newManagerUserId = await ResolveUserIdAsync(context, history.NewManagerId, 0, tenantId, cancellationToken);
        if (newManagerUserId > 0) targetUserIds.Add(newManagerUserId);

        if (history.CreatedBy.HasValue && history.CreatedBy.Value > 0)
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
        long tenantId,
        string reason,
        CancellationToken cancellationToken)
    {
        var employee = await context.EmployeeProfiles
            .FirstOrDefaultAsync(e => e.Id == history.EmployeeId && e.TenantId == tenantId, cancellationToken);

        var employeeName = employee != null ? await GetUserNameAsync(context, employee.UserId, cancellationToken) : "Nhân viên";

        var targetUserIds = new HashSet<long> { 1 };

        if (employee != null && employee.UserId > 0)
            targetUserIds.Add(employee.UserId);

        if (history.CreatedBy.HasValue && history.CreatedBy.Value > 0)
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

    private static async Task<long> ResolveUserIdAsync(IApplicationDbContext context, long? employeeId, long fallbackUserId, long tenantId, CancellationToken ct)
    {
        if (employeeId.HasValue && employeeId.Value > 0)
        {
            var emp = await context.EmployeeProfiles.FirstOrDefaultAsync(e => e.Id == employeeId.Value && e.TenantId == tenantId, ct);
            if (emp != null && emp.UserId > 0)
            {
                return emp.UserId;
            }
        }
        return fallbackUserId;
    }

    private static async Task<string> GetUserNameAsync(IApplicationDbContext context, long userId, CancellationToken ct)
    {
        var u = await context.Users.FirstOrDefaultAsync(x => x.Id == userId, ct);
        return u?.FullName ?? "Nhân viên";
    }

    private static async Task<long> GetHRManagerUserIdAsync(IApplicationDbContext context, long tenantId, CancellationToken ct)
    {
        var hrUser = await context.Users.FirstOrDefaultAsync(u => u.TenantId == tenantId && u.Username.Contains("hr"), ct);
        return hrUser?.Id ?? 1;
    }

    private static async Task<long> GetDirectorUserIdAsync(IApplicationDbContext context, long tenantId, CancellationToken ct)
    {
        var dirUser = await context.Users.FirstOrDefaultAsync(u => u.TenantId == tenantId && (u.Username.Contains("director") || u.Username.Contains("admin")), ct);
        return dirUser?.Id ?? 1;
    }
}
