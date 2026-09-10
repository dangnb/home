using System;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Nhật ký lịch sử bàn giao / thu hồi / báo hỏng thiết bị
/// </summary>
public class EquipmentHistory : BaseEntity<EntityStatus>, ITenantScopedEntity
{
    public long TenantId { get; set; }
    public long EquipmentId { get; private set; }
    public long? UserId { get; private set; }
    public EquipmentActionType ActionType { get; private set; }
    public DateTime ActionDate { get; private set; }
    public string? ConditionStatus { get; private set; }
    public long? PerformedBy { get; private set; }
    public string? Note { get; private set; }

    #region Navigation Properties
    public virtual Tenant Tenant { get; private set; } = null!;
    public virtual Equipment Equipment { get; private set; } = null!;
    public virtual User? User { get; private set; }
    public virtual User? PerformedByUser { get; private set; }
    #endregion

    protected EquipmentHistory() { }

    public static EquipmentHistory Create(
        long tenantId,
        long equipmentId,
        long? userId,
        EquipmentActionType actionType,
        string? conditionStatus = null,
        string? note = null,
        long? performedBy = null)
    {
        return new EquipmentHistory
        {
            TenantId = tenantId,
            EquipmentId = equipmentId,
            UserId = userId,
            ActionType = actionType,
            ActionDate = DateTime.UtcNow,
            ConditionStatus = conditionStatus?.Trim(),
            Note = note?.Trim(),
            PerformedBy = performedBy,
            Status = EntityStatus.ACTIVE,
            CreatedAt = DateTime.UtcNow
        };
    }
}
