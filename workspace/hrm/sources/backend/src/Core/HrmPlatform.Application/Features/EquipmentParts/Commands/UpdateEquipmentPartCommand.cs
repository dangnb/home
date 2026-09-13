using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.EquipmentParts.Commands;

public class UpdateEquipmentPartCommand : IRequest<bool>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = EquipmentPartCategory.OTHER;
    public string Unit { get; set; } = "Cái";
    public int StockQuantity { get; set; }
    public int MinStockQuantity { get; set; }
    public decimal UnitPrice { get; set; }
    public string? Specifications { get; set; }
    public string Status { get; set; } = EquipmentPartStatus.ACTIVE;
}

public class UpdateEquipmentPartCommandHandler : IRequestHandler<UpdateEquipmentPartCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateEquipmentPartCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(UpdateEquipmentPartCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? Guid.Parse("01956100-0000-7000-8000-000000000001");
        var userId = _currentUserService.UserId ?? Guid.Parse("01956100-0000-7000-8000-000000000001");

        var part = await _context.EquipmentParts
            .FirstOrDefaultAsync(p => p.Id == request.Id && p.TenantId == tenantId && p.PartStatus != EquipmentPartStatus.DELETED, cancellationToken);

        if (part == null)
            throw new NotFoundException("EquipmentPart", request.Id);

        part.Update(
            name: request.Name,
            category: request.Category,
            unit: request.Unit,
            stockQuantity: request.StockQuantity,
            minStockQuantity: request.MinStockQuantity,
            unitPrice: request.UnitPrice,
            specifications: request.Specifications,
            status: request.Status,
            performedBy: userId
        );

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
