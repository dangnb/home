using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.EmployeeTransfers.Commands;

public class CreateEmployeeTransferCommand : IRequest<long>
{
    public long EmployeeId { get; set; }
    public string? DecisionNumber { get; set; }
    public TransferChangeType ChangeType { get; set; }
    public long? NewDepartmentId { get; set; }
    public string? NewJobTitle { get; set; }
    public long? NewManagerId { get; set; }
    public DateOnly EffectiveDate { get; set; }
    public string? Note { get; set; }
}

public class CreateEmployeeTransferCommandHandler : IRequestHandler<CreateEmployeeTransferCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateEmployeeTransferCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(CreateEmployeeTransferCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var employee = await _context.EmployeeProfiles
            .FirstOrDefaultAsync(e => e.Id == request.EmployeeId && e.TenantId == tenantId, cancellationToken);

        if (employee == null)
            throw new NotFoundException($"Không tìm thấy nhân sự có ID = {request.EmployeeId}.");

        // Record Old Values
        var oldDepartmentId = employee.DepartmentId;
        var oldJobTitle = employee.JobTitle;
        var oldManagerId = employee.ManagerId;

        // Finalize New Values (use old value if new is not specified)
        var targetDepartmentId = request.NewDepartmentId ?? oldDepartmentId;
        var targetJobTitle = !string.IsNullOrWhiteSpace(request.NewJobTitle) ? request.NewJobTitle.Trim() : oldJobTitle;
        var targetManagerId = request.NewManagerId ?? oldManagerId;

        string finalDecisionNumber;

        if (!string.IsNullOrWhiteSpace(request.DecisionNumber))
        {
            var trimmedNumber = request.DecisionNumber.Trim().ToUpper();
            finalDecisionNumber = trimmedNumber;
        }
        else
        {
            var currentYear = DateTime.Now.Year;
            var prefix = $"QDDD-{currentYear}/";

            var maxNumbers = await _context.EmployeeJobHistories
                .Where(j => j.TenantId == tenantId && j.DecisionNumber != null && j.DecisionNumber.StartsWith(prefix))
                .Select(j => j.DecisionNumber!)
                .ToListAsync(cancellationToken);

            var maxIndex = 0;
            foreach (var num in maxNumbers)
            {
                var suffix = num.Replace(prefix, "");
                if (int.TryParse(suffix, out int parsedIndex))
                {
                    if (parsedIndex > maxIndex) maxIndex = parsedIndex;
                }
            }

            finalDecisionNumber = $"{prefix}{(maxIndex + 1):D4}";
        }

        // Create Job History Entry in PENDING_APPROVAL status
        var history = EmployeeJobHistory.Create(
            tenantId,
            request.EmployeeId,
            finalDecisionNumber,
            request.ChangeType,
            oldDepartmentId,
            targetDepartmentId,
            oldJobTitle,
            targetJobTitle,
            oldManagerId,
            targetManagerId,
            request.EffectiveDate,
            request.Note,
            TransferApprovalStatus.PENDING_APPROVAL);

        _context.EmployeeJobHistories.Add(history);
        await _context.SaveChangesAsync(cancellationToken);

        // Send notification to step 1 approver
        await HrmPlatform.Application.Features.EmployeeTransfers.Services.TransferNotificationHelper.SendStepNotificationAsync(_context, history, tenantId, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return history.Id;
    }
}
