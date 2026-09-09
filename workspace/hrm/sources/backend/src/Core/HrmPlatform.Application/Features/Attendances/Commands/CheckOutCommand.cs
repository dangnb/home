using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Attendances.Commands;

public record CheckOutCommand : IRequest
{
    public long? UserId { get; init; }
    public DateTime? CheckOutTime { get; init; }
}

public class CheckOutCommandHandler : IRequestHandler<CheckOutCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    // Giờ kết thúc làm việc tiêu chuẩn: 17:30:00
    private static readonly TimeSpan StandardEndTime = new(17, 30, 0);

    public CheckOutCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(CheckOutCommand request, CancellationToken cancellationToken)
    {
        var targetUserId = request.UserId ?? _currentUserService.UserId;
        if (!targetUserId.HasValue)
        {
            throw new BadRequestException("Không xác định được UserId để thực hiện Check-out.");
        }

        var checkOutTime = request.CheckOutTime ?? DateTime.UtcNow;
        var workDate = DateOnly.FromDateTime(checkOutTime);

        // Tìm bản ghi chấm công trong ngày
        var attendance = await _context.Attendances
            .FirstOrDefaultAsync(a => a.UserId == targetUserId.Value && a.WorkDate == workDate, cancellationToken);

        if (attendance == null || !attendance.CheckIn.HasValue)
        {
            throw new BadRequestException($"Không tìm thấy bản ghi Check-in cho ngày {workDate:dd/MM/yyyy}. Bạn phải Check-in trước khi Check-out.");
        }

        // Tính số phút về sớm nếu Check-out trước giờ quy định
        var checkOutTimeOfDay = checkOutTime.TimeOfDay;
        int earlyMinutes = 0;

        if (checkOutTimeOfDay < StandardEndTime)
        {
            earlyMinutes = (int)(StandardEndTime - checkOutTimeOfDay).TotalMinutes;
        }

        attendance.RecordCheckOut(checkOutTime, earlyMinutes);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
