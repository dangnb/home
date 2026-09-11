using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.EquipmentRepairs.Commands;

public class AssignTechnicianCommand : IRequest<bool>
{
    public long RepairId { get; set; }
    public long TechnicianUserId { get; set; }
}

public class AssignTechnicianCommandHandler : IRequestHandler<AssignTechnicianCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public AssignTechnicianCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(AssignTechnicianCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var userId = _currentUserService.UserId ?? 1;

        var repair = await _context.EquipmentRepairs
            .FirstOrDefaultAsync(r => r.Id == request.RepairId && r.TenantId == tenantId, cancellationToken);

        if (repair == null)
            throw new NotFoundException("EquipmentRepair", request.RepairId);

        var techUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == request.TechnicianUserId, cancellationToken);

        if (techUser == null)
            throw new DomainException("Kỹ thuật viên IT được chọn không tồn tại trong hệ thống.");

        repair.AssignTechnician(request.TechnicianUserId, userId);

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
