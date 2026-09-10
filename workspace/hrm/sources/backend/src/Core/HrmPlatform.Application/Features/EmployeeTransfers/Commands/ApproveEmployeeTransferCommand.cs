using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.EmployeeTransfers.Commands;

public class ApproveEmployeeTransferCommand : IRequest<bool>
{
    public long Id { get; set; }
}

public class ApproveEmployeeTransferCommandHandler : IRequestHandler<ApproveEmployeeTransferCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public ApproveEmployeeTransferCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(ApproveEmployeeTransferCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var currentUserId = _currentUserService.UserId ?? 1;

        var history = await _context.EmployeeJobHistories
            .FirstOrDefaultAsync(j => j.Id == request.Id && j.TenantId == tenantId, cancellationToken);

        if (history == null)
            throw new NotFoundException($"Không tìm thấy lệnh điều động ID = {request.Id}.");

        // 1. Mark History Entry as APPROVED
        history.Approve(currentUserId);

        // 2. Execute Auto-Sync to Employee Profile!
        var employee = await _context.EmployeeProfiles
            .FirstOrDefaultAsync(e => e.Id == history.EmployeeId && e.TenantId == tenantId, cancellationToken);

        if (employee != null)
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

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
