using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Assets.Commands;

public class CalculateAssetDepreciationCommand : IRequest<int>
{
    public int Month { get; set; }
    public int Year { get; set; }
    public int UsefulLifeMonths { get; set; } = 36; // Mặc định 36 tháng (3 năm)
}

public class CalculateAssetDepreciationCommandValidator : AbstractValidator<CalculateAssetDepreciationCommand>
{
    public CalculateAssetDepreciationCommandValidator()
    {
        RuleFor(x => x.Month).InclusiveBetween(1, 12).WithMessage("Tháng phải từ 1 đến 12.");
        RuleFor(x => x.Year).GreaterThanOrEqualTo(2020).WithMessage("Năm không hợp lệ.");
        RuleFor(x => x.UsefulLifeMonths).GreaterThan(0).WithMessage("Thời gian sử dụng hữu ích phải > 0.");
    }
}

public class CalculateAssetDepreciationCommandHandler : IRequestHandler<CalculateAssetDepreciationCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CalculateAssetDepreciationCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<int> Handle(CalculateAssetDepreciationCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var currentUserId = _currentUserService.UserId;

        // Lấy danh sách tài sản active ngoại trừ DISPOSED & DRAFT
        var activeAssets = await _context.Assets
            .Where(a => a.TenantId == tenantId && a.Status != AssetStatus.DISPOSED && a.Status != AssetStatus.DRAFT)
            .ToListAsync(cancellationToken);

        int processedCount = 0;

        foreach (var asset in activeAssets)
        {
            // Kiểm tra xem đã trích khấu hao tháng này chưa
            var existingDepr = await _context.AssetDepreciations
                .AnyAsync(d => d.TenantId == tenantId && d.AssetId == asset.Id && d.PeriodYear == request.Year && d.PeriodMonth == request.Month, cancellationToken);

            if (existingDepr)
                continue;

            // Khấu hao đường thẳng: Giá trị ban đầu / Tổng số tháng
            decimal monthlyAmount = Math.Round(asset.PurchasePrice / request.UsefulLifeMonths, 2);
            if (monthlyAmount <= 0)
                monthlyAmount = 0;

            decimal newRemainingValue = Math.Max(0, asset.CurrentValue - monthlyAmount);

            var deprRecord = AssetDepreciation.Create(
                tenantId,
                asset.Id,
                request.Month,
                request.Year,
                monthlyAmount,
                newRemainingValue);

            _context.AssetDepreciations.Add(deprRecord);
            asset.ApplyDepreciation(monthlyAmount, newRemainingValue);
            processedCount++;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return processedCount;
    }
}
