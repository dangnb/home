using System;
using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Hrm;

public static class EquipmentPartCategory
{
    public const string HARD_DRIVE = "HARD_DRIVE";
    public const string RAM = "RAM";
    public const string SCREEN = "SCREEN";
    public const string MAINBOARD = "MAINBOARD";
    public const string BATTERY = "BATTERY";
    public const string PERIPHERAL = "PERIPHERAL";
    public const string POWER_SUPPLY = "POWER_SUPPLY";
    public const string OTHER = "OTHER";
}

public static class EquipmentPartStatus
{
    public const string ACTIVE = "ACTIVE";
    public const string INACTIVE = "INACTIVE";
    public const string DELETED = "DELETED";
}

/// <summary>
/// Thực thể Linh kiện / Vật tư sửa chữa thiết bị IT
/// </summary>
public class EquipmentPart : BaseEntity, ITenantScopedEntity
{
    public long TenantId { get; set; }
    public string Code { get; private set; } = string.Empty;
    public string Name { get; private set; } = string.Empty;
    public string Category { get; private set; } = EquipmentPartCategory.OTHER;
    public string Unit { get; private set; } = "Cái";
    public int StockQuantity { get; private set; } = 0;
    public int MinStockQuantity { get; private set; } = 2;
    public decimal UnitPrice { get; private set; } = 0;
    public string? Specifications { get; private set; }
    public string PartStatus { get; private set; } = EquipmentPartStatus.ACTIVE;

    #region Navigation Properties
    public virtual Tenant Tenant { get; private set; } = null!;
    #endregion

    protected EquipmentPart() { }

    public static EquipmentPart Create(
        long tenantId,
        string code,
        string name,
        string category = EquipmentPartCategory.OTHER,
        string unit = "Cái",
        int stockQuantity = 0,
        int minStockQuantity = 2,
        decimal unitPrice = 0,
        string? specifications = null,
        long? createdBy = null)
    {
        if (tenantId <= 0)
            throw new DomainException("TenantId không hợp lệ.");

        if (string.IsNullOrWhiteSpace(code))
            throw new DomainException("Mã linh kiện không được để trống.");

        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên linh kiện không được để trống.");

        return new EquipmentPart
        {
            TenantId = tenantId,
            Code = code.Trim().ToUpper(),
            Name = name.Trim(),
            Category = string.IsNullOrWhiteSpace(category) ? EquipmentPartCategory.OTHER : category.Trim().ToUpper(),
            Unit = string.IsNullOrWhiteSpace(unit) ? "Cái" : unit.Trim(),
            StockQuantity = Math.Max(0, stockQuantity),
            MinStockQuantity = Math.Max(0, minStockQuantity),
            UnitPrice = Math.Max(0, unitPrice),
            Specifications = specifications?.Trim(),
            PartStatus = EquipmentPartStatus.ACTIVE,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Update(
        string name,
        string category,
        string unit,
        int stockQuantity,
        int minStockQuantity,
        decimal unitPrice,
        string? specifications,
        string status,
        long performedBy)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên linh kiện không được để trống.");

        Name = name.Trim();
        Category = string.IsNullOrWhiteSpace(category) ? EquipmentPartCategory.OTHER : category.Trim().ToUpper();
        Unit = string.IsNullOrWhiteSpace(unit) ? "Cái" : unit.Trim();
        StockQuantity = Math.Max(0, stockQuantity);
        MinStockQuantity = Math.Max(0, minStockQuantity);
        UnitPrice = Math.Max(0, unitPrice);
        Specifications = specifications?.Trim();
        PartStatus = string.IsNullOrWhiteSpace(status) ? EquipmentPartStatus.ACTIVE : status.Trim().ToUpper();
        UpdatedBy = performedBy;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AdjustStock(int deltaQuantity, long performedBy)
    {
        StockQuantity = Math.Max(0, StockQuantity + deltaQuantity);
        UpdatedBy = performedBy;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SoftDelete(long performedBy)
    {
        PartStatus = EquipmentPartStatus.DELETED;
        UpdatedBy = performedBy;
        UpdatedAt = DateTime.UtcNow;
    }
}
