using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.LeaveRequests.Commands;

public record ApproveLeaveRequestCommand : IRequest
{
    public long Id { get; init; }
    public bool IsApproved { get; init; }
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
        var approverId = _currentUserService.UserId;
        if (!approverId.HasValue)
        {
            throw new UnauthorizedException("Không xác định được danh tính người phê duyệt.");
        }

        var leaveRequest = await _context.LeaveRequests
            .FirstOrDefaultAsync(l => l.Id == request.Id, cancellationToken);

        if (leaveRequest == null)
        {
            throw new NotFoundException("Đơn xin nghỉ phép", request.Id);
        }

        if (leaveRequest.Status != LeaveRequestStatus.PENDING)
        {
            throw new BadRequestException($"Đơn xin nghỉ phép này đã được xử lý với trạng thái: {leaveRequest.Status}.");
        }

        leaveRequest.Status = request.IsApproved ? LeaveRequestStatus.APPROVED : LeaveRequestStatus.REJECTED;
        leaveRequest.ApproverId = approverId.Value;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
