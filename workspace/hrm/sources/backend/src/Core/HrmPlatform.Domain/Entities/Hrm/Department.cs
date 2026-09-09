using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Đại diện cho phòng ban / bộ phận trực thuộc Tenant
/// </summary>
public class Department : BaseEntity, ITenantScopedEntity
{
    /// <summary>
    /// Định danh Tenant sở hữu phòng ban
    /// </summary>
    public long TenantId { get; set; }

    /// <summary>
    /// Tên phòng ban (vd: Phòng Kỹ thuật, Ban Giám đốc, Phòng Nhân sự)
    /// </summary>
    public string Name { get; private set; } = string.Empty;

    /// <summary>
    /// Mã định danh phòng ban duy nhất trong phạm vi Tenant (vd: IT, HR, BOD)
    /// </summary>
    public string Code { get; private set; } = string.Empty;

    /// <summary>
    /// ID người dùng giữ vị trí Trưởng phòng (nullable)
    /// </summary>
    public long? ManagerId { get; private set; }

    /// <summary>
    /// ID phòng ban cấp trên trực tiếp (Cha) - Nullable nếu là cấp cao nhất
    /// </summary>
    public long? ParentId { get; private set; }

    #region Navigation Properties
    public virtual Tenant Tenant { get; private set; } = null!;
    public virtual User? Manager { get; private set; }
    public virtual Department? Parent { get; private set; }
    public virtual ICollection<Department> Children { get; private set; } = new HashSet<Department>();
    public virtual ICollection<EmployeeProfile> Employees { get; private set; } = new HashSet<EmployeeProfile>();
    #endregion

    protected Department()
    {
    }

    /// <summary>
    /// Factory Method khởi tạo Phòng ban mới đảm bảo trạng thái hợp lệ
    /// </summary>
    public static Department Create(
        string code,
        string name,
        long? managerId = null,
        long? parentId = null,
        long tenantId = 0)
    {
        if (tenantId < 0)
            throw new DomainException("TenantId không hợp lệ.");

        if (string.IsNullOrWhiteSpace(code))
            throw new DomainException("Mã phòng ban không được để trống.");

        var cleanCode = code.Trim().ToUpperInvariant();
        if (cleanCode.Length < 2 || cleanCode.Length > 50)
            throw new DomainException("Mã phòng ban phải có độ dài từ 2 đến 50 ký tự.");

        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên phòng ban không được để trống.");

        if (managerId.HasValue && managerId.Value <= 0)
            throw new DomainException("ManagerId không hợp lệ.");

        if (parentId.HasValue && parentId.Value <= 0)
            throw new DomainException("ParentId không hợp lệ.");

        return new Department
        {
            TenantId = tenantId,
            Code = cleanCode,
            Name = name.Trim(),
            ManagerId = managerId,
            ParentId = parentId,
            Status = EntityStatus.ACTIVE,
            CreatedAt = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Cập nhật thông tin phòng ban
    /// </summary>
    public void Update(string name, string code, long? managerId = null, long? parentId = null)
    {
        if (string.IsNullOrWhiteSpace(code))
            throw new DomainException("Mã phòng ban không được để trống.");

        var cleanCode = code.Trim().ToUpperInvariant();
        if (cleanCode.Length < 2 || cleanCode.Length > 50)
            throw new DomainException("Mã phòng ban phải có độ dài từ 2 đến 50 ký tự.");

        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Tên phòng ban không được để trống.");

        if (parentId.HasValue && parentId.Value == Id && Id > 0)
            throw new DomainException("Phòng ban không thể là phòng ban cha của chính mình.");

        if (managerId.HasValue && managerId.Value <= 0)
            throw new DomainException("ManagerId không hợp lệ.");

        Code = cleanCode;
        Name = name.Trim();
        ManagerId = managerId;
        ParentId = parentId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AssignManager(long? managerId)
    {
        if (managerId.HasValue && managerId.Value <= 0)
            throw new DomainException("ManagerId không hợp lệ.");

        ManagerId = managerId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetParent(long? parentId)
    {
        if (parentId.HasValue && parentId.Value == Id && Id > 0)
            throw new DomainException("Phòng ban không thể là phòng ban cha của chính mình.");

        ParentId = parentId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        Status = EntityStatus.INACTIVE;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate()
    {
        Status = EntityStatus.ACTIVE;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Delete()
    {
        Status = EntityStatus.DELETED;
        UpdatedAt = DateTime.UtcNow;
    }
}
