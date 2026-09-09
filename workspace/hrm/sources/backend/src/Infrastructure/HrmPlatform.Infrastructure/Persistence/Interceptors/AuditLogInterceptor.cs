using System.Text.Json;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Audit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace HrmPlatform.Infrastructure.Persistence.Interceptors;

/// <summary>
/// Interceptor tự động ghi nhận nhật ký kiểm toán (Audit Logs) vào CSDL khi có thay đổi dữ liệu
/// </summary>
public class AuditLogInterceptor : SaveChangesInterceptor
{
    private readonly ICurrentUserService _currentUserService;
    private List<AuditEntry>? _auditEntries;

    public AuditLogInterceptor(ICurrentUserService currentUserService)
    {
        _currentUserService = currentUserService;
    }

    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        _auditEntries = BeforeSaveChanges(eventData.Context);
        return base.SavingChanges(eventData, result);
    }

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        _auditEntries = BeforeSaveChanges(eventData.Context);
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    public override int SavedChanges(SaveChangesCompletedEventData eventData, int result)
    {
        AfterSaveChanges(eventData.Context);
        return base.SavedChanges(eventData, result);
    }

    public override ValueTask<int> SavedChangesAsync(
        SaveChangesCompletedEventData eventData,
        int result,
        CancellationToken cancellationToken = default)
    {
        AfterSaveChanges(eventData.Context);
        return base.SavedChangesAsync(eventData, result, cancellationToken);
    }

    private List<AuditEntry>? BeforeSaveChanges(DbContext? context)
    {
        if (context == null) return null;

        var entries = new List<AuditEntry>();
        foreach (var entry in context.ChangeTracker.Entries())
        {
            if (entry.Entity is AuditLog || entry.State is EntityState.Detached or EntityState.Unchanged)
            {
                continue;
            }

            var auditEntry = new AuditEntry(entry)
            {
                TenantId = _currentUserService.TenantId,
                UserId = _currentUserService.UserId,
                IpAddress = _currentUserService.IpAddress,
                EntityName = entry.Entity.GetType().Name
            };

            entries.Add(auditEntry);

            foreach (var property in entry.Properties)
            {
                string propertyName = property.Metadata.Name;
                if (property.Metadata.IsPrimaryKey())
                {
                    auditEntry.KeyValues[propertyName] = property.CurrentValue;
                    continue;
                }

                switch (entry.State)
                {
                    case EntityState.Added:
                        auditEntry.Action = "CREATE";
                        auditEntry.NewValues[propertyName] = property.CurrentValue;
                        break;

                    case EntityState.Deleted:
                        auditEntry.Action = "DELETE";
                        auditEntry.OldValues[propertyName] = property.OriginalValue;
                        break;

                    case EntityState.Modified:
                        if (property.IsModified)
                        {
                            auditEntry.Action = "UPDATE";
                            auditEntry.OldValues[propertyName] = property.OriginalValue;
                            auditEntry.NewValues[propertyName] = property.CurrentValue;
                        }
                        break;
                }
            }
        }

        return entries;
    }

    private void AfterSaveChanges(DbContext? context)
    {
        if (context == null || _auditEntries == null || _auditEntries.Count == 0) return;

        var logs = new List<AuditLog>();
        foreach (var auditEntry in _auditEntries)
        {
            foreach (var prop in auditEntry.TemporaryProperties)
            {
                if (prop.Metadata.IsPrimaryKey())
                {
                    auditEntry.KeyValues[prop.Metadata.Name] = prop.CurrentValue;
                }
                else
                {
                    auditEntry.NewValues[prop.Metadata.Name] = prop.CurrentValue;
                }
            }

            logs.Add(auditEntry.ToAuditLog());
        }

        context.Set<AuditLog>().AddRange(logs);
        context.SaveChanges();
        _auditEntries = null;
    }

    private class AuditEntry
    {
        public AuditEntry(EntityEntry entry)
        {
            Entry = entry;
            foreach (var property in entry.Properties)
            {
                if (property.IsTemporary)
                {
                    TemporaryProperties.Add(property);
                }
            }
        }

        public EntityEntry Entry { get; }
        public long? TenantId { get; set; }
        public long? UserId { get; set; }
        public string? IpAddress { get; set; }
        public string EntityName { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public Dictionary<string, object?> KeyValues { get; } = new();
        public Dictionary<string, object?> OldValues { get; } = new();
        public Dictionary<string, object?> NewValues { get; } = new();
        public List<PropertyEntry> TemporaryProperties { get; } = new();

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        };

        public AuditLog ToAuditLog()
        {
            var keyStr = KeyValues.Count > 0 ? JsonSerializer.Serialize(KeyValues, JsonOptions) : "0";
            return AuditLog.Create(
                action: Action,
                entityName: EntityName,
                entityId: keyStr,
                tenantId: TenantId,
                userId: UserId,
                oldData: OldValues.Count == 0 ? null : JsonSerializer.Serialize(OldValues, JsonOptions),
                newData: NewValues.Count == 0 ? null : JsonSerializer.Serialize(NewValues, JsonOptions),
                ipAddress: IpAddress,
                status: "SUCCESS"
            );
        }
    }
}
