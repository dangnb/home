using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.EquipmentParts.Commands;

public record DeleteEquipmentPartCommand(Guid Id) : IRequest<bool>;

public class DeleteEquipmentPartCommandHandler : IRequestHandler<DeleteEquipmentPartCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public DeleteEquipmentPartCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(DeleteEquipmentPartCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? Guid.Parse("01956100-0000-7000-8000-000000000001");
        var userId = _currentUserService.UserId ?? Guid.Parse("01956100-0000-7000-8000-000000000001");

        var part = await _context.EquipmentParts
            .FirstOrDefaultAsync(p => p.Id == request.Id && p.TenantId == tenantId && p.PartStatus != EquipmentPartStatus.DELETED, cancellationToken);

        if (part == null)
            throw new NotFoundException("EquipmentPart", request.Id);

        part.SoftDelete(userId);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}
