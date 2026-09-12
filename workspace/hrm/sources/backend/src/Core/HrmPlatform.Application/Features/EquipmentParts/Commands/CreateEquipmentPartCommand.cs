using System;
using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.EquipmentParts.Commands;

public class CreateEquipmentPartCommand : IRequest<long>
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = EquipmentPartCategory.OTHER;
    public string Unit { get; set; } = "Cái";
    public int StockQuantity { get; set; } = 0;
    public int MinStockQuantity { get; set; } = 2;
    public decimal UnitPrice { get; set; } = 0;
    public string? Specifications { get; set; }
}

public class CreateEquipmentPartCommandHandler : IRequestHandler<CreateEquipmentPartCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateEquipmentPartCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(CreateEquipmentPartCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var userId = _currentUserService.UserId ?? 1;

        var codeUpper = request.Code.Trim().ToUpper();
        var exists = await _context.EquipmentParts
            .AnyAsync(p => p.TenantId == tenantId && p.Code == codeUpper && p.PartStatus != EquipmentPartStatus.DELETED, cancellationToken);

        if (exists)
            throw new DomainException($"Mã linh kiện '{codeUpper}' đã tồn tại trong hệ thống.");

        var part = EquipmentPart.Create(
            tenantId: tenantId,
            code: codeUpper,
            name: request.Name,
            category: request.Category,
            unit: request.Unit,
            stockQuantity: request.StockQuantity,
            minStockQuantity: request.MinStockQuantity,
            unitPrice: request.UnitPrice,
            specifications: request.Specifications,
            createdBy: userId
        );

        _context.EquipmentParts.Add(part);
        await _context.SaveChangesAsync(cancellationToken);

        return part.Id;
    }
}
