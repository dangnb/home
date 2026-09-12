using System;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Thực thể Lịch sử khấu hao tài sản hàng tháng (Asset Depreciation Batch)
/// </summary>
public class AssetDepreciation : BaseEntity, ITenantScopedEntity
{
    public long TenantId { get; set; }
    public long AssetId { get; private set; }
    public int PeriodMonth { get; private set; }
    public int PeriodYear { get; private set; }
    public decimal DepreciatedAmount { get; private set; }
    public decimal RemainingValue { get; private set; }

    #region Navigation Properties
    public virtual Tenant Tenant { get; private set; } = null!;
    public virtual Asset Asset { get; private set; } = null!;
    #endregion

    protected AssetDepreciation() { }

    public static AssetDepreciation Create(
        long tenantId,
        long assetId,
        int periodMonth,
        int periodYear,
        decimal depreciatedAmount,
        decimal remainingValue)
    {
        if (tenantId <= 0)
            throw new DomainException("TenantId không hợp lệ.");

        if (assetId <= 0)
            throw new DomainException("AssetId không hợp lệ.");

        if (periodMonth < 1 || periodMonth > 12)
            throw new DomainException("Tháng khấu hao phải từ 1 đến 12.");

        if (periodYear < 2000 || periodYear > 2100)
            throw new DomainException("Năm khấu hao không hợp lệ.");

        if (depreciatedAmount < 0)
            throw new DomainException("Giá trị khấu hao không được âm.");

        if (remainingValue < 0)
            throw new DomainException("Giá trị còn lại không được âm.");

        return new AssetDepreciation
        {
            TenantId = tenantId,
            AssetId = assetId,
            PeriodMonth = periodMonth,
            PeriodYear = periodYear,
            DepreciatedAmount = depreciatedAmount,
            RemainingValue = remainingValue,
            Status = EntityStatus.ACTIVE,
            CreatedAt = DateTime.UtcNow
        };
    }
}
