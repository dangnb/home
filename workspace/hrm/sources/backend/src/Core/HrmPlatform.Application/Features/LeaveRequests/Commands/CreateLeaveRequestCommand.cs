using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.LeaveRequests.Commands;

public record CreateLeaveRequestCommand : IRequest<long>
{
    public LeaveType LeaveType { get; init; } = LeaveType.ANNUAL;
    public DateOnly StartDate { get; init; }
    public DateOnly EndDate { get; init; }
    public string? Reason { get; init; }
}

public class CreateLeaveRequestCommandValidator : AbstractValidator<CreateLeaveRequestCommand>
{
    public CreateLeaveRequestCommandValidator()
    {
        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("Ngày bắt đầu nghỉ không được để trống.");

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage("Ngày kết thúc nghỉ không được để trống.")
            .GreaterThanOrEqualTo(x => x.StartDate).WithMessage("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.");

        RuleFor(x => x.Reason)
            .MaximumLength(500).WithMessage("Lý do nghỉ tối đa 500 ký tự.");
    }
}

public class CreateLeaveRequestCommandHandler : IRequestHandler<CreateLeaveRequestCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateLeaveRequestCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(CreateLeaveRequestCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId;
        var userId = _currentUserService.UserId;

        if (!tenantId.HasValue || !userId.HasValue)
        {
            throw new BadRequestException("Không xác định được danh tính nhân viên trong phiên làm việc.");
        }

        // Kiểm tra xem có đơn xin nghỉ trùng lặp ngày đang PENDING hoặc APPROVED không
        var hasOverlap = await _context.LeaveRequests
            .AnyAsync(l => l.UserId == userId.Value
                && l.Status != LeaveRequestStatus.REJECTED
                && l.StartDate <= request.EndDate
                && l.EndDate >= request.StartDate, cancellationToken);

        if (hasOverlap)
        {
            throw new BadRequestException("Bạn đã có đơn xin nghỉ phép trong khoảng thời gian này đang chờ duyệt hoặc đã được phê duyệt.");
        }

        var leaveRequest = new LeaveRequest
        {
            TenantId = tenantId.Value,
            UserId = userId.Value,
            LeaveType = request.LeaveType,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Reason = request.Reason?.Trim(),
            Status = LeaveRequestStatus.PENDING
        };

        _context.LeaveRequests.Add(leaveRequest);
        await _context.SaveChangesAsync(cancellationToken);

        return leaveRequest.Id;
    }
}
