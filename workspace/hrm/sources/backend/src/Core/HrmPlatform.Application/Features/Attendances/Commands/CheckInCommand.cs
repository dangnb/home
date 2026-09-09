using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Attendances.Commands;

public record CheckInCommand : IRequest<long>
{
    public long? UserId { get; init; }
    public DateTime? CheckInTime { get; init; }
}

public class CheckInCommandHandler : IRequestHandler<CheckInCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    // Giờ bắt đầu làm việc tiêu chuẩn: 08:30:00
    private static readonly TimeSpan StandardStartTime = new(8, 30, 0);

    public CheckInCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(CheckInCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId;
        if (!tenantId.HasValue)
        {
            throw new BadRequestException("Không xác định được TenantId trong phiên làm việc.");
        }

        var targetUserId = request.UserId ?? _currentUserService.UserId;
        if (!targetUserId.HasValue)
        {
            throw new BadRequestException("Không xác định được UserId để thực hiện chấm công.");
        }

        var checkInTime = request.CheckInTime ?? DateTime.UtcNow;
        var workDate = DateOnly.FromDateTime(checkInTime);

        // Kiểm tra xem đã chấm công ngày hôm nay chưa
        var attendance = await _context.Attendances
            .FirstOrDefaultAsync(a => a.UserId == targetUserId.Value && a.WorkDate == workDate, cancellationToken);

        if (attendance != null && attendance.CheckIn.HasValue)
        {
            throw new BadRequestException($"Nhân viên đã thực hiện Check-in vào lúc {attendance.CheckIn:HH:mm:ss} cho ngày {workDate:dd/MM/yyyy}.");
        }

        // Tính số phút đi muộn
        var checkInTimeOfDay = checkInTime.TimeOfDay;
        int lateMinutes = 0;
        var status = AttendanceStatus.PRESENT;

        if (checkInTimeOfDay > StandardStartTime)
        {
            lateMinutes = (int)(checkInTimeOfDay - StandardStartTime).TotalMinutes;
            status = AttendanceStatus.LATE;
        }

        if (attendance == null)
        {
            attendance = new Attendance
            {
                TenantId = tenantId.Value,
                UserId = targetUserId.Value,
                WorkDate = workDate,
                CheckIn = checkInTime,
                LateMinutes = lateMinutes,
                Status = status
            };
            _context.Attendances.Add(attendance);
        }
        else
        {
            attendance.CheckIn = checkInTime;
            attendance.LateMinutes = lateMinutes;
            attendance.Status = status;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return attendance.Id;
    }
}
