using System;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Thực thể Lịch sử giao dịch cấp phát & thu hồi tài sản
/// </summary>
public class AssetTransaction : BaseEntity<AssetTransactionStatus>, ITenantScopedEntity
{
    public long TenantId { get; set; }
    public long AssetId { get; private set; }
    public AssetTransactionActionType ActionType { get; private set; }
    public long? FromUserId { get; private set; }
    public long? ToUserId { get; private set; }
    public DateTime TransactionDate { get; private set; }
    public string? ConditionNotes { get; private set; }

    #region Navigation Properties
    public virtual Tenant Tenant { get; private set; } = null!;
    public virtual Asset Asset { get; private set; } = null!;
    public virtual User? FromUser { get; private set; }
    public virtual User? ToUser { get; private set; }
    #endregion

    protected AssetTransaction() { }

    public static AssetTransaction Create(
        long tenantId,
        long assetId,
        AssetTransactionActionType actionType,
        long? fromUserId,
        long? toUserId,
        string? conditionNotes = null)
    {
        if (tenantId <= 0)
            throw new DomainException("TenantId không hợp lệ.");

        if (assetId <= 0)
            throw new DomainException("AssetId không hợp lệ.");

        if (actionType == AssetTransactionActionType.ALLOCATE && (!toUserId.HasValue || toUserId <= 0))
            throw new DomainException("Cấp phát tài sản bắt buộc phải chọn người nhận (ToUserId).");

        return new AssetTransaction
        {
            TenantId = tenantId,
            AssetId = assetId,
            ActionType = actionType,
            FromUserId = fromUserId,
            ToUserId = toUserId,
            TransactionDate = DateTime.UtcNow,
            ConditionNotes = conditionNotes?.Trim(),
            Status = AssetTransactionStatus.PENDING,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Approve()
    {
        if (Status != AssetTransactionStatus.PENDING)
            throw new DomainException("Giao dịch không ở trạng thái PENDING để duyệt.");

        Status = AssetTransactionStatus.APPROVED;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Reject()
    {
        if (Status != AssetTransactionStatus.PENDING)
            throw new DomainException("Giao dịch không ở trạng thái PENDING để từ chối.");

        Status = AssetTransactionStatus.REJECTED;
        UpdatedAt = DateTime.UtcNow;
    }
}
