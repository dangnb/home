using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Enums;

namespace HrmPlatform.Domain.Entities.Config;

/// <summary>
/// Bảng danh mục hệ thống dùng chung (System Catalog)
/// Một entity đơn giản, linh hoạt quản lý tất cả các loại danh mục cấu hình:
/// Loại nghỉ phép, Chức vụ, Trình độ học vấn, Danh mục tài sản, Loại hợp đồng, Dân tộc...
/// </summary>
public class SystemCatalog : BaseEntity, ITenantScopedEntity
{
    /// <summary>
    /// ID Tenant sở hữu danh mục này (Multi-tenant isolation)
    /// </summary>
    public long TenantId { get; set; }

    /// <summary>
    /// Loại danh mục (phân biệt nhóm danh mục)
    /// </summary>
    public SystemCatalogType CatalogType { get; private set; }

    /// <summary>
    /// Mã định danh duy nhất trong cùng một loại danh mục và tenant
    /// (vd: ANNUAL, SICK, ENGINEER, BACHELOR...)
    /// </summary>
    public string Code { get; private set; } = string.Empty;

    /// <summary>
    /// Tên hiển thị của danh mục (vd: Nghỉ phép năm, Kỹ sư phần mềm...)
    /// </summary>
    public string Name { get; private set; } = string.Empty;

    /// <summary>
    /// Mô tả chi tiết về danh mục này
    /// </summary>
    public string? Description { get; private set; }

    /// <summary>
    /// Thứ tự hiển thị (sort order) — số nhỏ hơn hiển thị trước
    /// </summary>
    public int SortOrder { get; private set; } = 0;

    /// <summary>
    /// Đây có phải là danh mục hệ thống mặc định (không thể xóa) không?
    /// </summary>
    public bool IsSystemDefault { get; private set; } = false;

    // ============================================================
    // Constructors
    // ============================================================

    protected SystemCatalog() { }

    private SystemCatalog(long tenantId, SystemCatalogType catalogType, string code, string name, string? description, int sortOrder, bool isSystemDefault)
    {
        TenantId = tenantId;
        CatalogType = catalogType;
        Code = code.Trim().ToUpperInvariant();
        Name = name.Trim();
        Description = description?.Trim();
        SortOrder = sortOrder;
        IsSystemDefault = isSystemDefault;
    }

    // ============================================================
    // Factory Methods
    // ============================================================

    public static SystemCatalog Create(
        long tenantId,
        SystemCatalogType catalogType,
        string code,
        string name,
        string? description = null,
        int sortOrder = 0,
        bool isSystemDefault = false)
    {
        if (string.IsNullOrWhiteSpace(code))
            throw new ArgumentException("Mã danh mục (Code) không được để trống.", nameof(code));
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Tên danh mục (Name) không được để trống.", nameof(name));

        return new SystemCatalog(tenantId, catalogType, code, name, description, sortOrder, isSystemDefault);
    }

    // ============================================================
    // Domain Methods
    // ============================================================

    public void Update(string name, string? description, int sortOrder)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Tên danh mục không được để trống.", nameof(name));

        Name = name.Trim();
        Description = description?.Trim();
        SortOrder = sortOrder;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        if (IsSystemDefault)
            throw new InvalidOperationException("Không thể vô hiệu hóa danh mục hệ thống mặc định.");

        Status = EntityStatus.INACTIVE;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate()
    {
        Status = EntityStatus.ACTIVE;
        UpdatedAt = DateTime.UtcNow;
    }
}
