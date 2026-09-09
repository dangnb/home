using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

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
    public long UserId { get; private set; }

    /// <summary>
    /// ID phòng ban trực thuộc
    /// </summary>
    public long? DepartmentId { get; private set; }

    /// <summary>
    /// Quản lý trực tiếp của nhân viên (FK -> User)
    /// </summary>
    public long? ManagerId { get; private set; }

    /// <summary>
    /// Chức danh / Vị trí công việc (vd: Software Engineer, Senior HR)
    /// </summary>
    public string JobTitle { get; private set; } = string.Empty;

    /// <summary>
    /// Giới tính
    /// </summary>
    public Gender Gender { get; private set; } = Gender.OTHER;

    /// <summary>
    /// Ngày sinh
    /// </summary>
    public DateOnly? DateOfBirth { get; private set; }

    /// <summary>
    /// Số CMND / CCCD / Hộ chiếu
    /// </summary>
    public string? IdCardNumber { get; private set; }

    /// <summary>
    /// Ngày chính thức gia nhập tổ chức
    /// </summary>
    public DateOnly? JoinedDate { get; private set; }

    #region Navigation Properties
    public virtual Tenant Tenant { get; private set; } = null!;
    public virtual User User { get; private set; } = null!;
    public virtual Department? Department { get; private set; }
    public virtual User? Manager { get; private set; }
    #endregion

    protected EmployeeProfile()
    {
    }

    /// <summary>
    /// Factory Method tạo Hồ sơ nhân sự mới đảm bảo tính toàn vẹn
    /// </summary>
    public static EmployeeProfile Create(
        long tenantId,
        long userId,
        string jobTitle,
        Gender gender = Gender.OTHER,
        long? departmentId = null,
        long? managerId = null,
        DateOnly? dateOfBirth = null,
        string? idCardNumber = null,
        DateOnly? joinedDate = null)
    {
        if (tenantId <= 0)
            throw new DomainException("TenantId không hợp lệ (phải lớn hơn 0).");

        if (userId <= 0)
            throw new DomainException("UserId không hợp lệ (phải lớn hơn 0).");

        if (string.IsNullOrWhiteSpace(jobTitle))
            throw new DomainException("Chức danh / vị trí công việc không được để trống.");

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (dateOfBirth.HasValue && dateOfBirth.Value > today)
            throw new DomainException("Ngày sinh không thể ở trong tương lai.");

        if (departmentId.HasValue && departmentId.Value <= 0)
            throw new DomainException("DepartmentId không hợp lệ.");

        if (managerId.HasValue && managerId.Value <= 0)
            throw new DomainException("ManagerId không hợp lệ.");

        return new EmployeeProfile
        {
            TenantId = tenantId,
            UserId = userId,
            JobTitle = jobTitle.Trim(),
            Gender = gender,
            DepartmentId = departmentId,
            ManagerId = managerId,
            DateOfBirth = dateOfBirth,
            IdCardNumber = idCardNumber?.Trim(),
            JoinedDate = joinedDate ?? today,
            Status = EntityStatus.ACTIVE,
            CreatedAt = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Cập nhật thông tin hồ sơ nhân viên
    /// </summary>
    public void Update(
        string jobTitle,
        Gender gender,
        long? departmentId = null,
        long? managerId = null,
        DateOnly? dateOfBirth = null,
        string? idCardNumber = null,
        DateOnly? joinedDate = null)
    {
        if (string.IsNullOrWhiteSpace(jobTitle))
            throw new DomainException("Chức danh / vị trí công việc không được để trống.");

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (dateOfBirth.HasValue && dateOfBirth.Value > today)
            throw new DomainException("Ngày sinh không thể ở trong tương lai.");

        if (departmentId.HasValue && departmentId.Value <= 0)
            throw new DomainException("DepartmentId không hợp lệ.");

        if (managerId.HasValue && managerId.Value <= 0)
            throw new DomainException("ManagerId không hợp lệ.");

        JobTitle = jobTitle.Trim();
        Gender = gender;
        DepartmentId = departmentId;
        ManagerId = managerId;
        DateOfBirth = dateOfBirth;
        IdCardNumber = idCardNumber?.Trim();
        if (joinedDate.HasValue)
        {
            JoinedDate = joinedDate.Value;
        }
        UpdatedAt = DateTime.UtcNow;
    }

    public void TransferDepartment(long? departmentId, long? newManagerId = null)
    {
        if (departmentId.HasValue && departmentId.Value <= 0)
            throw new DomainException("DepartmentId không hợp lệ.");

        if (newManagerId.HasValue && newManagerId.Value <= 0)
            throw new DomainException("ManagerId không hợp lệ.");

        DepartmentId = departmentId;
        ManagerId = newManagerId;
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
