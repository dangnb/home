using System;
using System.Collections.Generic;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Thực thể trang thiết bị công ty (Equipment / Asset)
/// </summary>
public class Equipment : BaseEntity<EquipmentStatus>, ITenantScopedEntity
{
    public long TenantId { get; set; }
    public string Code { get; private set; } = string.Empty;
    public string Name { get; private set; } = string.Empty;
    public EquipmentCategory Category { get; private set; } = EquipmentCategory.LAPTOP;
    public string? SerialNumber { get; private set; }
    public string? Specifications { get; private set; }
    public DateOnly? PurchaseDate { get; private set; }
    public DateOnly? WarrantyEndDate { get; private set; }
    public long? CurrentUserId { get; private set; }
    public DateTime? AssignedDate { get; private set; }
    public string? Note { get; private set; }

    #region Navigation Properties
    public virtual Tenant Tenant { get; private set; } = null!;
    public virtual User? CurrentUser { get; private set; }
    public virtual ICollection<EquipmentHistory> Histories { get; private set; } = new List<EquipmentHistory>();
    #endregion

    protected Equipment() { }

    public static Equipment Create(
        long tenantId,
        string code,
        string name,
        EquipmentCategory category,
        string? serialNumber = null,
        string? specifications = null,
        DateOnly? purchaseDate = null,
        DateOnly? warrantyEndDate = null,
        string? note = null)
    {
        if (tenantId <= 0)
            throw new DomainException("TenantId không hợp lệ.");

        if (string.IsNullOrWhiteSpace(code))
            throw new DomainException("Mã trang thiết bị không được để trống.");

        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên trang thiết bị không được để trống.");

        return new Equipment
        {
            TenantId = tenantId,
            Code = code.Trim().ToUpper(),
            Name = name.Trim(),
            Category = category,
            SerialNumber = serialNumber?.Trim(),
            Specifications = specifications?.Trim(),
            PurchaseDate = purchaseDate,
            WarrantyEndDate = warrantyEndDate,
            Status = EquipmentStatus.AVAILABLE,
            Note = note?.Trim(),
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Handover(long targetUserId, string? conditionStatus, string? note)
    {
        if (targetUserId <= 0)
            throw new DomainException("Tài khoản nhân sự nhận thiết bị không hợp lệ.");

        CurrentUserId = targetUserId;
        AssignedDate = DateTime.UtcNow;
        Status = EquipmentStatus.ASSIGNED;
        UpdatedAt = DateTime.UtcNow;

        Histories.Add(EquipmentHistory.Create(
            tenantId: TenantId,
            equipmentId: Id,
            userId: targetUserId,
            actionType: EquipmentActionType.HANDOVER,
            conditionStatus: conditionStatus ?? "Mới 100% / Đang hoạt động tốt",
            note: note
        ));
    }

    public void Revoke(string? conditionStatus, string? note)
    {
        var oldUserId = CurrentUserId;
        CurrentUserId = null;
        AssignedDate = null;
        Status = EquipmentStatus.AVAILABLE;
        UpdatedAt = DateTime.UtcNow;

        Histories.Add(EquipmentHistory.Create(
            tenantId: TenantId,
            equipmentId: Id,
            userId: oldUserId,
            actionType: EquipmentActionType.REVOKE,
            conditionStatus: conditionStatus ?? "Hoạt động bình thường",
            note: note
        ));
    }

    public void ReportBroken(string? conditionStatus, string? note)
    {
        Status = EquipmentStatus.BROKEN;
        UpdatedAt = DateTime.UtcNow;

        Histories.Add(EquipmentHistory.Create(
            tenantId: TenantId,
            equipmentId: Id,
            userId: CurrentUserId,
            actionType: EquipmentActionType.REPORT_BROKEN,
            conditionStatus: conditionStatus ?? "Gặp sự cố / Hỏng hóc",
            note: note
        ));
    }
}
