using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.EquipmentParts.Commands;

public class AdjustEquipmentPartStockCommand : IRequest<bool>
{
    public long PartId { get; set; }
    public int DeltaQuantity { get; set; }
}

public class AdjustEquipmentPartStockCommandHandler : IRequestHandler<AdjustEquipmentPartStockCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public AdjustEquipmentPartStockCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(AdjustEquipmentPartStockCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var userId = _currentUserService.UserId ?? 1;

        var part = await _context.EquipmentParts
            .FirstOrDefaultAsync(p => p.Id == request.PartId && p.TenantId == tenantId && p.PartStatus != EquipmentPartStatus.DELETED, cancellationToken);

        if (part == null)
            throw new NotFoundException("EquipmentPart", request.PartId);

        part.AdjustStock(request.DeltaQuantity, userId);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
