using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.HrPolicies.Commands;

public class DeleteHrPolicyCommand : IRequest
{
    public Guid Id { get; set; }

    public DeleteHrPolicyCommand(Guid id)
    {
        Id = id;
    }
}

public class DeleteHrPolicyCommandHandler : IRequestHandler<DeleteHrPolicyCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public DeleteHrPolicyCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(DeleteHrPolicyCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? Guid.Parse("01956100-0000-7000-8000-000000000001");

        var policy = await _context.HrPolicies
            .FirstOrDefaultAsync(p => p.Id == request.Id && p.TenantId == tenantId, cancellationToken);

        if (policy == null)
            throw new NotFoundException($"Không tìm thấy chính sách có ID = {request.Id}.");

        _context.HrPolicies.Remove(policy);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
