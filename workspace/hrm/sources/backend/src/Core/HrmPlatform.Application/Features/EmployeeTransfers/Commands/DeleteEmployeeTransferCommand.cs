using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.EmployeeTransfers.Commands;

public class DeleteEmployeeTransferCommand : IRequest
{
    public long Id { get; set; }

    public DeleteEmployeeTransferCommand(long id)
    {
        Id = id;
    }
}

public class DeleteEmployeeTransferCommandHandler : IRequestHandler<DeleteEmployeeTransferCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public DeleteEmployeeTransferCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(DeleteEmployeeTransferCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var history = await _context.EmployeeJobHistories
            .FirstOrDefaultAsync(j => j.Id == request.Id && j.TenantId == tenantId, cancellationToken);

        if (history == null)
            throw new NotFoundException($"Không tìm thấy lịch sử điều động có ID = {request.Id}.");

        _context.EmployeeJobHistories.Remove(history);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
