using System;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Assets.Commands;

public class AllocateAssetCommand : IRequest<long>
{
    public long AssetId { get; set; }
    public long AssigneeUserId { get; set; }
    public string? ConditionNotes { get; set; }
}

public class AllocateAssetCommandValidator : AbstractValidator<AllocateAssetCommand>
{
    public AllocateAssetCommandValidator()
    {
        RuleFor(x => x.AssetId)
            .GreaterThan(0).WithMessage("ID tài sản không hợp lệ.");

        RuleFor(x => x.AssigneeUserId)
            .GreaterThan(0).WithMessage("Vui lòng chọn nhân sự tiếp nhận tài sản.");
    }
}

public class AllocateAssetCommandHandler : IRequestHandler<AllocateAssetCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public AllocateAssetCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(AllocateAssetCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var asset = await _context.Assets
            .FirstOrDefaultAsync(a => a.Id == request.AssetId && a.TenantId == tenantId, cancellationToken);

        if (asset == null)
            throw new NotFoundException($"Không tìm thấy tài sản có ID = {request.AssetId}");

        if (asset.Status != AssetStatus.AVAILABLE)
            throw new BadRequestException($"Tài sản '{asset.Name}' ({asset.AssetCode}) đang ở trạng thái {asset.Status}, không thể cấp phát.");

        var assigneeUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.AssigneeUserId, cancellationToken);

        if (assigneeUser == null)
            throw new NotFoundException($"Không tìm thấy thông tin tài khoản người dùng ID = {request.AssigneeUserId}");

        asset.Allocate(request.AssigneeUserId);

        var transaction = AssetTransaction.Create(
            tenantId: tenantId,
            assetId: asset.Id,
            actionType: AssetTransactionActionType.ALLOCATE,
            fromUserId: null,
            toUserId: request.AssigneeUserId,
            conditionNotes: request.ConditionNotes ?? "Bàn giao tài sản mới / Đang hoạt động tốt"
        );
        transaction.Approve();

        _context.AssetTransactions.Add(transaction);

        var notification = Notification.Create(
            tenantId: tenantId,
            userId: request.AssigneeUserId,
            title: "Bàn giao thiết bị & tài sản mới",
            message: $"Bạn đã được cấp phát tài sản '{asset.Name}' (Mã: {asset.AssetCode}). Tình trạng: {request.ConditionNotes ?? "Đang hoạt động tốt"}.",
            notificationType: "ASSET_ALLOCATED",
            referenceId: asset.Id,
            targetUrl: "/hrm/assets"
        );
        _context.Notifications.Add(notification);

        await _context.SaveChangesAsync(cancellationToken);

        return transaction.Id;
    }
}
