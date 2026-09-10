using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.RewardDisciplines.Commands;

public class ApproveRewardDisciplineCommand : IRequest<bool>
{
    public long Id { get; set; }
}

public class ApproveRewardDisciplineCommandHandler : IRequestHandler<ApproveRewardDisciplineCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public ApproveRewardDisciplineCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(ApproveRewardDisciplineCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var currentUserId = _currentUserService.UserId ?? 1;

        var entity = await _context.RewardDisciplines
            .FirstOrDefaultAsync(r => r.Id == request.Id && r.TenantId == tenantId, cancellationToken);

        if (entity == null)
            throw new NotFoundException($"Không tìm thấy quyết định thưởng/phạt ID = {request.Id}.");

        entity.Approve(currentUserId);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
