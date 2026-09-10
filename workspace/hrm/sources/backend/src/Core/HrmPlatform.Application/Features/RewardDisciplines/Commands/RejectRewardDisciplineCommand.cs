using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.RewardDisciplines.Commands;

public class RejectRewardDisciplineCommand : IRequest<bool>
{
    public long Id { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class RejectRewardDisciplineCommandHandler : IRequestHandler<RejectRewardDisciplineCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public RejectRewardDisciplineCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(RejectRewardDisciplineCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var currentUserId = _currentUserService.UserId ?? 1;

        var entity = await _context.RewardDisciplines
            .FirstOrDefaultAsync(r => r.Id == request.Id && r.TenantId == tenantId, cancellationToken);

        if (entity == null)
            throw new NotFoundException($"Không tìm thấy quyết định thưởng/phạt ID = {request.Id}.");

        entity.Reject(currentUserId, request.Reason);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
