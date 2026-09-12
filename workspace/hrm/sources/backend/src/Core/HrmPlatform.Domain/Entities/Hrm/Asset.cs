using System;
using System.Collections.Generic;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Thực thể Hồ sơ tài sản & thiết bị (Asset & Equipment)
/// Ràng buộc cỗ máy trạng thái (State Machine): DRAFT -> AVAILABLE -> IN_USE -> MAINTENANCE -> BROKEN -> DISPOSED
/// </summary>
public class Asset : BaseEntity<AssetStatus>, ITenantScopedEntity
{
    public long TenantId { get; set; }
    public string AssetCode { get; private set; } = string.Empty;
    public string Name { get; private set; } = string.Empty;
    public AssetCategory Category { get; private set; } = AssetCategory.IT;
    public string? SerialNumber { get; private set; }
    public DateOnly? PurchaseDate { get; private set; }
    public decimal PurchasePrice { get; private set; }
    public decimal CurrentValue { get; private set; }
    public long? AssigneeId { get; private set; }

    #region Navigation Properties
    public virtual Tenant Tenant { get; private set; } = null!;
    public virtual User? Assignee { get; private set; }
    public virtual ICollection<AssetTransaction> Transactions { get; private set; } = new List<AssetTransaction>();
    public virtual ICollection<MaintenanceTicket> MaintenanceTickets { get; private set; } = new List<MaintenanceTicket>();
    public virtual ICollection<AssetDepreciation> Depreciations { get; private set; } = new List<AssetDepreciation>();
    #endregion

    protected Asset() { }

    public static Asset Create(
        long tenantId,
        string assetCode,
        string name,
        AssetCategory category,
        decimal purchasePrice,
        string? serialNumber = null,
        DateOnly? purchaseDate = null)
    {
        if (tenantId <= 0)
            throw new DomainException("TenantId không hợp lệ.");

        if (string.IsNullOrWhiteSpace(assetCode))
            throw new DomainException("Mã tài sản không được để trống.");

        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên tài sản không được để trống.");

        if (purchasePrice < 0)
            throw new DomainException("Giá trị mua tài sản không được âm.");

        return new Asset
        {
            TenantId = tenantId,
            AssetCode = assetCode.Trim().ToUpper(),
            Name = name.Trim(),
            Category = category,
            SerialNumber = serialNumber?.Trim(),
            PurchaseDate = purchaseDate,
            PurchasePrice = purchasePrice,
            CurrentValue = purchasePrice,
            Status = AssetStatus.DRAFT,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void ApproveToAvailable()
    {
        if (Status != AssetStatus.DRAFT)
            throw new DomainException($"Không thể chuyển tài sản ở trạng thái {Status} sang AVAILABLE.");

        Status = AssetStatus.AVAILABLE;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Allocate(long assigneeId)
    {
        if (assigneeId <= 0)
            throw new DomainException("ID người nhận tài sản không hợp lệ.");

        if (Status != AssetStatus.AVAILABLE)
            throw new DomainException($"Tài sản ở trạng thái {Status} không sẵn sàng để cấp phát. Yêu cầu trạng thái AVAILABLE.");

        AssigneeId = assigneeId;
        Status = AssetStatus.IN_USE;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Recover()
    {
        if (Status != AssetStatus.IN_USE)
            throw new DomainException($"Tài sản ở trạng thái {Status} không thể thu hồi. Yêu cầu trạng thái IN_USE.");

        AssigneeId = null;
        Status = AssetStatus.AVAILABLE;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SendToMaintenance()
    {
        if (Status != AssetStatus.IN_USE && Status != AssetStatus.AVAILABLE && Status != AssetStatus.BROKEN)
            throw new DomainException($"Tài sản ở trạng thái {Status} không thể chuyển sang bảo trì.");

        Status = AssetStatus.MAINTENANCE;
        UpdatedAt = DateTime.UtcNow;
    }

    public void CompleteMaintenance()
    {
        if (Status != AssetStatus.MAINTENANCE)
            throw new DomainException("Tài sản phải ở trạng thái MAINTENANCE mới có thể hoàn tất bảo trì.");

        Status = AssigneeId.HasValue ? AssetStatus.IN_USE : AssetStatus.AVAILABLE;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkBroken()
    {
        if (Status == AssetStatus.DISPOSED)
            throw new DomainException("Tài sản đã thanh lý không thể báo hỏng.");

        Status = AssetStatus.BROKEN;
        UpdatedAt = DateTime.UtcNow;
    }

    public void DisposeAsset()
    {
        if (Status != AssetStatus.BROKEN && Status != AssetStatus.AVAILABLE && Status != AssetStatus.MAINTENANCE)
            throw new DomainException($"Không thể thanh lý tài sản đang ở trạng thái {Status}.");

        AssigneeId = null;
        Status = AssetStatus.DISPOSED;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ApplyDepreciation(decimal depreciatedAmount, decimal newRemainingValue)
    {
        if (depreciatedAmount < 0)
            throw new DomainException("Số tiền khấu hao không được âm.");

        if (newRemainingValue < 0)
            throw new DomainException("Giá trị còn lại sau khấu hao không được âm.");

        CurrentValue = newRemainingValue;
        UpdatedAt = DateTime.UtcNow;
    }
}
