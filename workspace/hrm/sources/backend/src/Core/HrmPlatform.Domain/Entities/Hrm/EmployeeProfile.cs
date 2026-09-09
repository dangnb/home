using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Hồ sơ thông tin chi tiết nhân sự
/// </summary>
public class EmployeeProfile : BaseEntity, ITenantScopedEntity
{
    /// <summary>
    /// ID Tenant sở hữu hồ sơ nhân sự
    /// </summary>
    public long TenantId { get; set; }

    /// <summary>
    /// ID tài khoản User tương ứng (1-1)
    /// </summary>
    public long UserId { get; set; }

    /// <summary>
    /// ID phòng ban trực thuộc
    /// </summary>
    public long? DepartmentId { get; set; }

    /// <summary>
    /// Quản lý trực tiếp của nhân viên (FK -> User)
    /// </summary>
    public long? ManagerId { get; set; }

    /// <summary>
    /// Chức danh / Vị trí công việc (vd: Software Engineer, Senior HR)
    /// </summary>
    public string JobTitle { get; set; } = string.Empty;

    /// <summary>
    /// Giới tính
    /// </summary>
    public Gender Gender { get; set; } = Gender.OTHER;

    /// <summary>
    /// Ngày sinh
    /// </summary>
    public DateOnly? DateOfBirth { get; set; }

    /// <summary>
    /// Số CMND / CCCD / Hộ chiếu
    /// </summary>
    public string? IdCardNumber { get; set; }

    /// <summary>
    /// Ngày chính thức gia nhập tổ chức
    /// </summary>
    public DateOnly? JoinedDate { get; set; }

    #region Navigation Properties
    public virtual Tenant Tenant { get; set; } = null!;
    public virtual User User { get; set; } = null!;
    public virtual Department? Department { get; set; }
    public virtual User? Manager { get; set; }
    #endregion
}
