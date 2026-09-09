using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace HrmPlatform.Infrastructure.Persistence.Interceptors;

/// <summary>
/// Interceptor tự động gán dữ liệu Audit Trail (CreatedAt, CreatedBy, UpdatedAt, UpdatedBy),
/// tự động gán TenantId cho thực thể mới và chuyển đổi xóa vật lý sang xóa mềm (Soft Delete)
/// </summary>
public class AuditableEntityInterceptor : SaveChangesInterceptor
{
    private readonly ICurrentUserService _currentUserService;

    public AuditableEntityInterceptor(ICurrentUserService currentUserService)
    {
        _currentUserService = currentUserService;
    }

    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        UpdateEntities(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        UpdateEntities(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private void UpdateEntities(DbContext? context)
    {
        if (context == null) return;

        var now = DateTime.UtcNow;
        var currentUserId = _currentUserService.UserId;
        var currentTenantId = _currentUserService.TenantId;

        foreach (var entry in context.ChangeTracker.Entries())
        {
            // 1. Tự động gán TenantId cho ITenantScopedEntity khi thêm mới nếu chưa có giá trị
            if (entry.Entity is ITenantScopedEntity tenantScoped && entry.State == EntityState.Added)
            {
                if (tenantScoped.TenantId == 0 && currentTenantId.HasValue)
                {
                    tenantScoped.TenantId = currentTenantId.Value;
                }
            }

            // 2. Tự động hóa Soft Delete cho ISoftDeletable
            if (entry.Entity is ISoftDeletable softDeletable && entry.State == EntityState.Deleted)
            {
                entry.State = EntityState.Modified;
                softDeletable.Status = EntityStatus.DELETED;

                if (entry.Entity is IAuditableEntity auditable)
                {
                    auditable.UpdatedAt = now;
                    auditable.UpdatedBy = currentUserId;
                }
                continue;
            }

            // 3. Tự động gán Audit Trails cho IAuditableEntity
            if (entry.Entity is IAuditableEntity auditableEntity)
            {
                if (entry.State == EntityState.Added)
                {
                    auditableEntity.CreatedAt = now;
                    if (auditableEntity.CreatedBy == null && currentUserId.HasValue)
                    {
                        auditableEntity.CreatedBy = currentUserId;
                    }
                }
                else if (entry.State == EntityState.Modified)
                {
                    auditableEntity.UpdatedAt = now;
                    if (currentUserId.HasValue)
                    {
                        auditableEntity.UpdatedBy = currentUserId;
                    }
                }
            }
        }
    }
}
