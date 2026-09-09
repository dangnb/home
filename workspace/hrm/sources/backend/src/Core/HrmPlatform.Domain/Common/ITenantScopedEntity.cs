namespace HrmPlatform.Domain.Common;

/// <summary>
/// Hợp đồng bắt buộc thực thể thuộc phạm vi của một Tenant cụ thể (Multi-Tenant Isolation)
/// </summary>
public interface ITenantScopedEntity
{
    long TenantId { get; set; }
}
