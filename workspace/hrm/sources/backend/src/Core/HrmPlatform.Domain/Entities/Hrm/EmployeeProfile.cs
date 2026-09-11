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
    /// Mã số thuế cá nhân
    /// </summary>
    public string? TaxCode { get; private set; }

    /// <summary>
    /// Số sổ BHXH
    /// </summary>
    public string? SocialInsuranceNumber { get; private set; }

    /// <summary>
    /// Số tài khoản ngân hàng nhận lương
    /// </summary>
    public string? BankAccountNumber { get; private set; }

    /// <summary>
    /// Tên ngân hàng
    /// </summary>
    public string? BankName { get; private set; }

    /// <summary>
    /// Chi nhánh ngân hàng
    /// </summary>
    public string? BankBranch { get; private set; }

    /// <summary>
    /// Địa chỉ thường trú
    /// </summary>
    public string? PermanentAddress { get; private set; }

    /// <summary>
    /// Địa chỉ tạm trú / Nơi ở hiện tại
    /// </summary>
    public string? TemporaryAddress { get; private set; }

    /// <summary>
    /// Người liên hệ khẩn cấp
    /// </summary>
    public string? EmergencyContactName { get; private set; }

    /// <summary>
    /// SĐT người liên hệ khẩn cấp
    /// </summary>
    public string? EmergencyContactPhone { get; private set; }

    /// <summary>
    /// Tình trạng hôn nhân (SINGLE, MARRIED, DIVORCED)
    /// </summary>
    public string? MaritalStatus { get; private set; } = "SINGLE";

    /// <summary>
    /// Ngày gia nhập tổ chức (thử việc)
    /// </summary>
    public DateOnly? JoinedDate { get; private set; }

    /// <summary>
    /// Ngày kết thúc thử việc
    /// </summary>
    public DateOnly? ProbationEndDate { get; private set; }

    /// <summary>
    /// Ngày vào chính thức
    /// </summary>
    public DateOnly? OfficialJoinedDate { get; private set; }

    /// <summary>
    /// Đường dẫn ảnh đại diện avatar
    /// </summary>
    public string? AvatarUrl { get; private set; }

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
        string? taxCode = null,
        string? socialInsuranceNumber = null,
        string? bankAccountNumber = null,
        string? bankName = null,
        string? bankBranch = null,
        string? permanentAddress = null,
        string? temporaryAddress = null,
        string? emergencyContactName = null,
        string? emergencyContactPhone = null,
        string? maritalStatus = null,
        DateOnly? joinedDate = null,
        DateOnly? probationEndDate = null,
        DateOnly? officialJoinedDate = null,
        string? avatarUrl = null)
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
            TaxCode = taxCode?.Trim(),
            SocialInsuranceNumber = socialInsuranceNumber?.Trim(),
            BankAccountNumber = bankAccountNumber?.Trim(),
            BankName = bankName?.Trim(),
            BankBranch = bankBranch?.Trim(),
            PermanentAddress = permanentAddress?.Trim(),
            TemporaryAddress = temporaryAddress?.Trim(),
            EmergencyContactName = emergencyContactName?.Trim(),
            EmergencyContactPhone = emergencyContactPhone?.Trim(),
            MaritalStatus = maritalStatus?.Trim() ?? "SINGLE",
            JoinedDate = joinedDate ?? today,
            ProbationEndDate = probationEndDate,
            OfficialJoinedDate = officialJoinedDate,
            AvatarUrl = avatarUrl?.Trim(),
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
        string? taxCode = null,
        string? socialInsuranceNumber = null,
        string? bankAccountNumber = null,
        string? bankName = null,
        string? bankBranch = null,
        string? permanentAddress = null,
        string? temporaryAddress = null,
        string? emergencyContactName = null,
        string? emergencyContactPhone = null,
        string? maritalStatus = null,
        DateOnly? joinedDate = null,
        DateOnly? probationEndDate = null,
        DateOnly? officialJoinedDate = null,
        string? avatarUrl = null)
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
        TaxCode = taxCode?.Trim();
        SocialInsuranceNumber = socialInsuranceNumber?.Trim();
        BankAccountNumber = bankAccountNumber?.Trim();
        BankName = bankName?.Trim();
        BankBranch = bankBranch?.Trim();
        PermanentAddress = permanentAddress?.Trim();
        TemporaryAddress = temporaryAddress?.Trim();
        EmergencyContactName = emergencyContactName?.Trim();
        EmergencyContactPhone = emergencyContactPhone?.Trim();
        MaritalStatus = maritalStatus?.Trim() ?? "SINGLE";
        if (joinedDate.HasValue) JoinedDate = joinedDate.Value;
        ProbationEndDate = probationEndDate;
        OfficialJoinedDate = officialJoinedDate;
        AvatarUrl = avatarUrl?.Trim();
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
