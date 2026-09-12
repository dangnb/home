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

public class CreateAssetCommand : IRequest<long>
{
    public string AssetCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public AssetCategory Category { get; set; } = AssetCategory.IT;
    public string? SerialNumber { get; set; }
    public DateOnly? PurchaseDate { get; set; }
    public decimal PurchasePrice { get; set; }
    public bool AutoApproveToAvailable { get; set; } = true;
}

public class CreateAssetCommandValidator : AbstractValidator<CreateAssetCommand>
{
    public CreateAssetCommandValidator()
    {
        RuleFor(x => x.AssetCode)
            .NotEmpty().WithMessage("Mã tài sản không được để trống.")
            .MaximumLength(50).WithMessage("Mã tài sản không vượt quá 50 ký tự.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên tài sản không được để trống.")
            .MaximumLength(255).WithMessage("Tên tài sản không vượt quá 255 ký tự.");

        RuleFor(x => x.PurchasePrice)
            .GreaterThanOrEqualTo(0).WithMessage("Giá trị mua tài sản không được âm.");
    }
}

public class CreateAssetCommandHandler : IRequestHandler<CreateAssetCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateAssetCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(CreateAssetCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var codeExists = await _context.Assets
            .AnyAsync(a => a.TenantId == tenantId && a.AssetCode == request.AssetCode.Trim().ToUpper(), cancellationToken);

        if (codeExists)
            throw new BadRequestException($"Mã tài sản '{request.AssetCode}' đã tồn tại trong hệ thống.");

        var asset = Asset.Create(
            tenantId: tenantId,
            assetCode: request.AssetCode,
            name: request.Name,
            category: request.Category,
            purchasePrice: request.PurchasePrice,
            serialNumber: request.SerialNumber,
            purchaseDate: request.PurchaseDate
        );

        if (request.AutoApproveToAvailable)
        {
            asset.ApproveToAvailable();
        }

        _context.Assets.Add(asset);
        await _context.SaveChangesAsync(cancellationToken);

        return asset.Id;
    }
}
