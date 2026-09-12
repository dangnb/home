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

public class RecoverAssetCommand : IRequest<long>
{
    public long AssetId { get; set; }
    public string? ConditionNotes { get; set; }
}

public class RecoverAssetCommandValidator : AbstractValidator<RecoverAssetCommand>
{
    public RecoverAssetCommandValidator()
    {
        RuleFor(x => x.AssetId)
            .GreaterThan(0).WithMessage("ID tài sản không hợp lệ.");
    }
}

public class RecoverAssetCommandHandler : IRequestHandler<RecoverAssetCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public RecoverAssetCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(RecoverAssetCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var asset = await _context.Assets
            .FirstOrDefaultAsync(a => a.Id == request.AssetId && a.TenantId == tenantId, cancellationToken);

        if (asset == null)
            throw new NotFoundException($"Không tìm thấy tài sản có ID = {request.AssetId}");

        if (asset.Status != AssetStatus.IN_USE)
            throw new BadRequestException($"Tài sản '{asset.Name}' ({asset.AssetCode}) không ở trạng thái IN_USE, không thể thu hồi.");

        var oldAssigneeId = asset.AssigneeId;

        asset.Recover();

        var transaction = AssetTransaction.Create(
            tenantId: tenantId,
            assetId: asset.Id,
            actionType: AssetTransactionActionType.RECOVER,
            fromUserId: oldAssigneeId,
            toUserId: null,
            conditionNotes: request.ConditionNotes ?? "Thu hồi về kho / Hoạt động bình thường"
        );
        transaction.Approve();

        _context.AssetTransactions.Add(transaction);

        if (oldAssigneeId.HasValue && oldAssigneeId.Value > 0)
        {
            var notification = Notification.Create(
                tenantId: tenantId,
                userId: oldAssigneeId.Value,
                title: "Thu hồi tài sản thiết bị",
                message: $"Tài sản '{asset.Name}' (Mã: {asset.AssetCode}) đã được làm thủ tục thu hồi về kho.",
                notificationType: "ASSET_RECOVERED",
                referenceId: asset.Id,
                targetUrl: "/hrm/assets"
            );
            _context.Notifications.Add(notification);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return transaction.Id;
    }
}
