using System.Collections.Generic;
using System.Linq;
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

public class OffboardingRecoverAssetsCommand : IRequest<int>
{
    public long EmployeeUserId { get; set; }
    public string? Reason { get; set; }
}

public class OffboardingRecoverAssetsCommandValidator : AbstractValidator<OffboardingRecoverAssetsCommand>
{
    public OffboardingRecoverAssetsCommandValidator()
    {
        RuleFor(x => x.EmployeeUserId)
            .GreaterThan(0).WithMessage("ID nhân sự nghỉ việc không hợp lệ.");
    }
}

public class OffboardingRecoverAssetsCommandHandler : IRequestHandler<OffboardingRecoverAssetsCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public OffboardingRecoverAssetsCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<int> Handle(OffboardingRecoverAssetsCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var assignedAssets = await _context.Assets
            .Where(a => a.TenantId == tenantId && a.AssigneeId == request.EmployeeUserId && a.Status == AssetStatus.IN_USE)
            .ToListAsync(cancellationToken);

        if (!assignedAssets.Any())
            return 0;

        int count = 0;
        foreach (var asset in assignedAssets)
        {
            var oldAssigneeId = asset.AssigneeId;
            asset.Recover();

            var transaction = AssetTransaction.Create(
                tenantId: tenantId,
                assetId: asset.Id,
                actionType: AssetTransactionActionType.RECOVER,
                fromUserId: oldAssigneeId,
                toUserId: null,
                conditionNotes: $"Thu hồi tự động khi làm thủ tục thôi việc (Offboarding). {request.Reason ?? ""}".Trim()
            );
            transaction.Approve();
            _context.AssetTransactions.Add(transaction);
            count++;
        }

        await _context.SaveChangesAsync(cancellationToken);
        return count;
    }
}
