using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.EmployeeTransfers.Commands;

public class ApproveEmployeeTransferStepCommand : IRequest<bool>
{
    public long Id { get; set; }
    public int Step { get; set; }
    public string? Note { get; set; }
}

public class ApproveEmployeeTransferStepCommandHandler : IRequestHandler<ApproveEmployeeTransferStepCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public ApproveEmployeeTransferStepCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(ApproveEmployeeTransferStepCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var currentUserId = _currentUserService.UserId ?? 1;

        var history = await _context.EmployeeJobHistories
            .FirstOrDefaultAsync(j => j.Id == request.Id && j.TenantId == tenantId, cancellationToken);

        if (history == null)
            throw new NotFoundException($"Không tìm thấy lệnh điều động ID = {request.Id}.");

        // 1. Execute Domain Step Approval
        bool isDirectorApproved = history.ApproveStep(request.Step, currentUserId, request.Note);

        // 2. If Step 4 (Director) Approved, Trigger Auto-Sync to Employee Profile!
        if (isDirectorApproved)
        {
            var employee = await _context.EmployeeProfiles
                .FirstOrDefaultAsync(e => e.Id == history.EmployeeId && e.TenantId == tenantId, cancellationToken);

            if (employee != null)
            {
                if (history.ChangeType == TransferChangeType.RESIGNATION || history.ChangeType == TransferChangeType.TERMINATION)
                {
                    employee.Status = EntityStatus.INACTIVE;
                }
                else
                {
                    var targetDepartmentId = history.NewDepartmentId ?? employee.DepartmentId;
                    var targetManagerId = history.NewManagerId ?? employee.ManagerId;
                    var targetJobTitle = !string.IsNullOrWhiteSpace(history.NewJobTitle) ? history.NewJobTitle : employee.JobTitle;

                    employee.TransferDepartment(targetDepartmentId, targetManagerId);
                    if (!string.IsNullOrWhiteSpace(targetJobTitle))
                    {
                        employee.Update(
                            jobTitle: targetJobTitle,
                            gender: employee.Gender,
                            departmentId: targetDepartmentId,
                            managerId: targetManagerId,
                            dateOfBirth: employee.DateOfBirth,
                            idCardNumber: employee.IdCardNumber,
                            taxCode: employee.TaxCode,
                            socialInsuranceNumber: employee.SocialInsuranceNumber,
                            bankAccountNumber: employee.BankAccountNumber,
                            bankName: employee.BankName,
                            bankBranch: employee.BankBranch,
                            permanentAddress: employee.PermanentAddress,
                            temporaryAddress: employee.TemporaryAddress,
                            emergencyContactName: employee.EmergencyContactName,
                            emergencyContactPhone: employee.EmergencyContactPhone,
                            maritalStatus: employee.MaritalStatus,
                            joinedDate: employee.JoinedDate,
                            probationEndDate: employee.ProbationEndDate,
                            officialJoinedDate: employee.OfficialJoinedDate,
                            avatarUrl: employee.AvatarUrl);
                    }
                }
            }
        }

        if (isDirectorApproved)
        {
            await HrmPlatform.Application.Features.EmployeeTransfers.Services.TransferNotificationHelper.SendCompletedNotificationsAsync(_context, history, tenantId, cancellationToken);
        }
        else
        {
            await HrmPlatform.Application.Features.EmployeeTransfers.Services.TransferNotificationHelper.SendStepNotificationAsync(_context, history, tenantId, cancellationToken);
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
