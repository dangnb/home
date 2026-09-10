using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.EmployeeContracts.Commands;

public class DeleteEmployeeContractCommand : IRequest
{
    public long Id { get; set; }

    public DeleteEmployeeContractCommand(long id)
    {
        Id = id;
    }
}

public class DeleteEmployeeContractCommandHandler : IRequestHandler<DeleteEmployeeContractCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public DeleteEmployeeContractCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(DeleteEmployeeContractCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var contract = await _context.EmployeeContracts
            .FirstOrDefaultAsync(c => c.Id == request.Id && c.TenantId == tenantId, cancellationToken);

        if (contract == null)
            throw new NotFoundException($"Không tìm thấy hợp đồng lao động có ID = {request.Id}.");

        _context.EmployeeContracts.Remove(contract);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
