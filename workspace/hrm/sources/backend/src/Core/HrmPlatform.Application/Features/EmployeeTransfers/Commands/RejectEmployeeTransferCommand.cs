using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.EmployeeTransfers.Commands;

public class RejectEmployeeTransferCommand : IRequest<bool>
{
    public long Id { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class RejectEmployeeTransferCommandHandler : IRequestHandler<RejectEmployeeTransferCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public RejectEmployeeTransferCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(RejectEmployeeTransferCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var currentUserId = _currentUserService.UserId ?? 1;

        var history = await _context.EmployeeJobHistories
            .FirstOrDefaultAsync(j => j.Id == request.Id && j.TenantId == tenantId, cancellationToken);

        if (history == null)
            throw new NotFoundException($"Không tìm thấy lệnh điều động ID = {request.Id}.");

        history.Reject(currentUserId, request.Reason);

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
