using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.EmployeeTransfers.Commands;

public class AcknowledgeEmployeeTransferCommand : IRequest<bool>
{
    public long Id { get; set; }
    public string? Note { get; set; }
}

public class AcknowledgeEmployeeTransferCommandHandler : IRequestHandler<AcknowledgeEmployeeTransferCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public AcknowledgeEmployeeTransferCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(AcknowledgeEmployeeTransferCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var history = await _context.EmployeeJobHistories
            .FirstOrDefaultAsync(j => j.Id == request.Id && j.TenantId == tenantId, cancellationToken);

        if (history == null)
            throw new NotFoundException($"Không tìm thấy lệnh điều động ID = {request.Id}.");

        // Call domain method to record employee acknowledgment
        history.AcknowledgeByEmployee(history.EmployeeId, request.Note);

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
