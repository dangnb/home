using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Ghi nhận dữ liệu chấm công hàng ngày của nhân viên
/// </summary>
public class Attendance : BaseEntity<AttendanceStatus>, ITenantScopedEntity
{
    public Attendance()
    {
        Status = AttendanceStatus.PRESENT;
    }

    /// <summary>
    /// ID Tenant
    /// </summary>
    public long TenantId { get; set; }

    /// <summary>
    /// ID User nhân viên được chấm công
    /// </summary>
    public long UserId { get; set; }

    /// <summary>
    /// Ngày làm việc (chấm công)
    /// </summary>
    public DateOnly WorkDate { get; set; }

    /// <summary>
    /// Thời gian thực hiện Check-in
    /// </summary>
    public DateTime? CheckIn { get; set; }

    /// <summary>
    /// Thời gian thực hiện Check-out
    /// </summary>
    public DateTime? CheckOut { get; set; }

    /// <summary>
    /// Số phút đi muộn
    /// </summary>
    public int LateMinutes { get; set; } = 0;

    /// <summary>
    /// Số phút về sớm
    /// </summary>
    public int EarlyMinutes { get; set; } = 0;

    #region Navigation Properties
    public virtual Tenant Tenant { get; set; } = null!;
    public virtual User User { get; set; } = null!;
    #endregion
}
