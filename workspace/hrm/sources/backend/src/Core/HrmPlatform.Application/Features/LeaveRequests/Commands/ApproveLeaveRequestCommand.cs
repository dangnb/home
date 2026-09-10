using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.LeaveRequests.Commands;

public record ApproveLeaveRequestCommand : IRequest
{
    public long Id { get; init; }
    public bool IsApproved { get; init; }
    public string? Comment { get; init; }
}

public class ApproveLeaveRequestCommandValidator : AbstractValidator<ApproveLeaveRequestCommand>
{
    public ApproveLeaveRequestCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("ID đơn xin nghỉ không hợp lệ.");
    }
}

public class ApproveLeaveRequestCommandHandler : IRequestHandler<ApproveLeaveRequestCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public ApproveLeaveRequestCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(ApproveLeaveRequestCommand request, CancellationToken cancellationToken)
    {
        var approverId = _currentUserService.UserId ?? 1;

        var leaveRequest = await _context.LeaveRequests
            .FirstOrDefaultAsync(l => l.Id == request.Id, cancellationToken);

        if (leaveRequest == null)
        {
            throw new NotFoundException("Đơn xin nghỉ phép / thôi việc", request.Id);
        }

        if (leaveRequest.Status != LeaveRequestStatus.PENDING)
        {
            throw new BadRequestException($"Đơn xin nghỉ phép/thôi việc này đã được xử lý với trạng thái: {leaveRequest.Status}.");
        }

        if (request.IsApproved)
        {
            leaveRequest.Approve(approverId);

            // Nếu đây là đơn xin nghỉ việc (RESIGNATION), tự động cập nhật trạng thái hồ sơ nhân sự sang INACTIVE (Đã thôi việc)
            if (leaveRequest.LeaveType == LeaveType.RESIGNATION)
            {
                var profile = await _context.EmployeeProfiles
                    .FirstOrDefaultAsync(p => p.UserId == leaveRequest.UserId, cancellationToken);
                if (profile != null)
                {
                    profile.Deactivate();
                }
            }

            // Tạo thông báo cho nhân viên
            var notification = Notification.Create(
                tenantId: leaveRequest.TenantId,
                userId: leaveRequest.UserId,
                title: leaveRequest.LeaveType == LeaveType.RESIGNATION ? "Đơn xin thôi việc đã được duyệt" : "Đơn xin nghỉ phép đã được duyệt",
                message: leaveRequest.LeaveType == LeaveType.RESIGNATION 
                    ? $"Đơn xin nghỉ việc của bạn từ ngày {leaveRequest.StartDate:dd/MM/yyyy} đã được Ban Giám Đốc phê duyệt chính thức."
                    : $"Đơn xin nghỉ phép từ ngày {leaveRequest.StartDate:dd/MM/yyyy} đến ngày {leaveRequest.EndDate:dd/MM/yyyy} đã được phê duyệt.",
                notificationType: "LEAVE_APPROVED",
                referenceId: leaveRequest.Id,
                targetUrl: "/hrm/leave-requests"
            );
            _context.Notifications.Add(notification);
        }
        else
        {
            leaveRequest.Reject(approverId, request.Comment);

            // Tạo thông báo từ chối
            var notification = Notification.Create(
                tenantId: leaveRequest.TenantId,
                userId: leaveRequest.UserId,
                title: leaveRequest.LeaveType == LeaveType.RESIGNATION ? "Đơn xin thôi việc bị từ chối" : "Đơn xin nghỉ phép bị từ chối",
                message: $"Đơn xin {(leaveRequest.LeaveType == LeaveType.RESIGNATION ? "thôi việc" : "nghỉ phép")} của bạn bị từ chối. Lý do: {request.Comment ?? "Không có lý do cụ thể"}.",
                notificationType: "LEAVE_REJECTED",
                referenceId: leaveRequest.Id,
                targetUrl: "/hrm/leave-requests"
            );
            _context.Notifications.Add(notification);
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
