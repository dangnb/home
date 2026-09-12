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

public class TransferAssetCommand : IRequest<long>
{
    public long AssetId { get; set; }
    public long TargetUserId { get; set; }
    public string? Reason { get; set; }
}

public class TransferAssetCommandValidator : AbstractValidator<TransferAssetCommand>
{
    public TransferAssetCommandValidator()
    {
        RuleFor(x => x.AssetId).GreaterThan(0).WithMessage("AssetId không hợp lệ.");
        RuleFor(x => x.TargetUserId).GreaterThan(0).WithMessage("TargetUserId người tiếp nhận không hợp lệ.");
    }
}

public class TransferAssetCommandHandler : IRequestHandler<TransferAssetCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public TransferAssetCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(TransferAssetCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var currentUserId = _currentUserService.UserId;

        var asset = await _context.Assets
            .FirstOrDefaultAsync(a => a.Id == request.AssetId && a.TenantId == tenantId, cancellationToken);

        if (asset == null)
        {
            throw new NotFoundException($"Không tìm thấy tài sản có Id = {request.AssetId}");
        }

        var targetUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.TargetUserId && (u.TenantId == tenantId || u.TenantId == null), cancellationToken);

        if (targetUser == null)
        {
            throw new NotFoundException($"Không tìm thấy nhân sự có Id = {request.TargetUserId}");
        }

        var previousAssigneeId = asset.AssigneeId;

        // Nếu tài sản đang ở trạng thái AVAILABLE, cấp phát cho user mới
        // Nếu tài sản đang ở IN_USE, chuyển giao trực tiếp
        if (asset.Status == AssetStatus.AVAILABLE)
        {
            asset.Allocate(request.TargetUserId);
        }
        else if (asset.Status == AssetStatus.IN_USE)
        {
            // Recover then Allocate
            asset.Recover();
            asset.Allocate(request.TargetUserId);
        }
        else
        {
            throw new InvalidOperationException($"Tài sản đang ở trạng thái {asset.Status}, không thể điều chuyển.");
        }

        var transaction = AssetTransaction.Create(
            tenantId,
            asset.Id,
            AssetTransactionActionType.TRANSFER,
            previousAssigneeId,
            request.TargetUserId,
            request.Reason ?? "Điều chuyển tài sản nội bộ");

        _context.AssetTransactions.Add(transaction);

        await _context.SaveChangesAsync(cancellationToken);

        return transaction.Id;
    }
}
