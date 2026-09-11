using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.RewardDisciplines.Commands;

public class DeleteRewardDisciplineCommand : IRequest<bool>
{
    public long Id { get; set; }
}

public class DeleteRewardDisciplineCommandHandler : IRequestHandler<DeleteRewardDisciplineCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public DeleteRewardDisciplineCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(DeleteRewardDisciplineCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var entity = await _context.RewardDisciplines
            .FirstOrDefaultAsync(r => r.Id == request.Id && r.TenantId == tenantId, cancellationToken);

        if (entity == null)
            throw new NotFoundException($"Không tìm thấy quyết định thưởng/phạt với ID = {request.Id}.");

        _context.RewardDisciplines.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
