using HrmPlatform.Domain.Common;
using HrmPlatform.Domain.Entities.Identity;
using HrmPlatform.Domain.Entities.Tenants;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;

namespace HrmPlatform.Domain.Entities.Hrm;

/// <summary>
/// Ghi nhận dữ liệu chấm công hàng ngày của nhân viên
/// </summary>
public class Attendance : BaseEntity<AttendanceStatus>, ITenantScopedEntity
{
    public long TenantId { get; set; }
    public long UserId { get; private set; }
    public DateOnly WorkDate { get; private set; }
    public DateTime? CheckIn { get; private set; }
    public DateTime? CheckOut { get; private set; }
    public int LateMinutes { get; private set; } = 0;
    public int EarlyMinutes { get; private set; } = 0;

    #region Navigation Properties
    public virtual Tenant Tenant { get; private set; } = null!;
    public virtual User User { get; private set; } = null!;
    #endregion

    protected Attendance()
    {
    }

    /// <summary>
    /// Factory Method tạo bản ghi chấm công mới
    /// </summary>
    public static Attendance Create(
        long tenantId,
        long userId,
        DateOnly workDate,
        DateTime? checkIn = null,
        DateTime? checkOut = null,
        int lateMinutes = 0,
        int earlyMinutes = 0,
        AttendanceStatus status = AttendanceStatus.PRESENT)
    {
        if (tenantId <= 0)
            throw new DomainException("TenantId không hợp lệ (phải lớn hơn 0).");

        if (userId <= 0)
            throw new DomainException("UserId không hợp lệ (phải lớn hơn 0).");

        if (lateMinutes < 0)
            throw new DomainException("Số phút đi muộn không được là số âm.");

        if (earlyMinutes < 0)
            throw new DomainException("Số phút về sớm không được là số âm.");

        if (checkIn.HasValue && checkOut.HasValue && checkOut.Value < checkIn.Value)
            throw new DomainException("Thời gian Check-out không thể diễn ra trước thời gian Check-in.");

        return new Attendance
        {
            TenantId = tenantId,
            UserId = userId,
            WorkDate = workDate,
            CheckIn = checkIn,
            CheckOut = checkOut,
            LateMinutes = lateMinutes,
            EarlyMinutes = earlyMinutes,
            Status = status,
            CreatedAt = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Ghi nhận Check-in của nhân viên
    /// </summary>
    public void RecordCheckIn(DateTime checkInTime, int lateMinutes = 0)
    {
        if (lateMinutes < 0)
            throw new DomainException("Số phút đi muộn không thể là số âm.");

        if (CheckOut.HasValue && checkInTime > CheckOut.Value)
            throw new DomainException("Thời gian Check-in không thể diễn ra sau thời gian Check-out.");

        CheckIn = checkInTime;
        LateMinutes = lateMinutes;
        Status = lateMinutes > 0 ? AttendanceStatus.LATE : AttendanceStatus.PRESENT;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Ghi nhận Check-out của nhân viên
    /// </summary>
    public void RecordCheckOut(DateTime checkOutTime, int earlyMinutes = 0)
    {
        if (earlyMinutes < 0)
            throw new DomainException("Số phút về sớm không thể là số âm.");

        if (CheckIn.HasValue && checkOutTime < CheckIn.Value)
            throw new DomainException("Thời gian Check-out không thể diễn ra trước thời gian Check-in.");

        CheckOut = checkOutTime;
        EarlyMinutes = earlyMinutes;
        UpdatedAt = DateTime.UtcNow;
    }
}
