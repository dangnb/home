using System;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Assets.Commands;

public class DisposeAssetCommand : IRequest<Guid>
{
    public Guid AssetId { get; set; }
    public string DisposalReason { get; set; } = string.Empty;
    public decimal SalvageValue { get; set; }
}

public class DisposeAssetCommandValidator : AbstractValidator<DisposeAssetCommand>
{
    public DisposeAssetCommandValidator()
    {
        RuleFor(x => x.AssetId).NotEmpty().WithMessage("AssetId không hợp lệ.");
        RuleFor(x => x.DisposalReason).NotEmpty().WithMessage("Lý do thanh lý không được để trống.");
        RuleFor(x => x.SalvageValue).GreaterThanOrEqualTo(0).WithMessage("Giá trị thu hồi phế liệu phải >= 0.");
    }
}

public class DisposeAssetCommandHandler : IRequestHandler<DisposeAssetCommand, Guid>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public DisposeAssetCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Guid> Handle(DisposeAssetCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? Guid.Parse("01956100-0000-7000-8000-000000000001");
        var currentUserId = _currentUserService.UserId;

        var asset = await _context.Assets
            .FirstOrDefaultAsync(a => a.Id == request.AssetId && a.TenantId == tenantId, cancellationToken);

        if (asset == null)
        {
            throw new NotFoundException($"Không tìm thấy tài sản có Id = {request.AssetId}");
        }

        // Chuyển trạng thái sang DISPOSED
        asset.DisposeAsset();
        asset.ApplyDepreciation(0, request.SalvageValue);
        asset.UpdatedBy = currentUserId;

        await _context.SaveChangesAsync(cancellationToken);

        return asset.Id;
    }
}
