using System;
using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.EmployeeContracts.Commands;

public class UpdateEmployeeContractCommand : IRequest
{
    public long Id { get; set; }
    public EmployeeContractType ContractType { get; set; }
    public DateOnly SignDate { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public decimal BasicSalary { get; set; }
    public decimal InsuranceSalary { get; set; }
    public EmployeeContractStatus Status { get; set; }
    public string? Note { get; set; }
    public string? AttachmentUrl { get; set; }
}

public class UpdateEmployeeContractCommandHandler : IRequestHandler<UpdateEmployeeContractCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateEmployeeContractCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(UpdateEmployeeContractCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var contract = await _context.EmployeeContracts
            .FirstOrDefaultAsync(c => c.Id == request.Id && c.TenantId == tenantId, cancellationToken);

        if (contract == null)
            throw new NotFoundException($"Không tìm thấy hợp đồng lao động có ID = {request.Id}.");

        contract.Update(
            request.ContractType,
            request.SignDate,
            request.StartDate,
            request.EndDate,
            request.BasicSalary,
            request.InsuranceSalary,
            request.Status,
            request.Note,
            request.AttachmentUrl);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
