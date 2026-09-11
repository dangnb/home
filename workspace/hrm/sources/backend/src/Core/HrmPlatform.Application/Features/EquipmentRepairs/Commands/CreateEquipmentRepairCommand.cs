using System;
using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.EquipmentRepairs.Commands;

public class CreateEquipmentRepairCommand : IRequest<long>
{
    public long EquipmentId { get; set; }
    public string IssueDescription { get; set; } = string.Empty;
    public string Priority { get; set; } = EquipmentRepairPriority.MEDIUM;
    public string? Note { get; set; }
}

public class CreateEquipmentRepairCommandHandler : IRequestHandler<CreateEquipmentRepairCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateEquipmentRepairCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(CreateEquipmentRepairCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var userId = _currentUserService.UserId ?? 1;

        var equipment = await _context.Equipments
            .FirstOrDefaultAsync(e => e.Id == request.EquipmentId && e.TenantId == tenantId, cancellationToken);

        if (equipment == null)
            throw new NotFoundException("Equipment", request.EquipmentId);

        // Mark equipment as broken
        equipment.ReportBroken(request.IssueDescription, request.Note);

        // Create repair code: REP-YYYYMM-RANDOM
        var randomNum = new Random().Next(1000, 9999);
        var code = $"REP-{DateTime.UtcNow:yyyyMM}-{randomNum}";

        var repair = EquipmentRepair.Create(
            tenantId: tenantId,
            code: code,
            equipmentId: equipment.Id,
            reporterUserId: userId,
            issueDescription: request.IssueDescription,
            priority: request.Priority,
            note: request.Note,
            createdBy: userId
        );

        _context.EquipmentRepairs.Add(repair);
        await _context.SaveChangesAsync(cancellationToken);

        return repair.Id;
    }
}
