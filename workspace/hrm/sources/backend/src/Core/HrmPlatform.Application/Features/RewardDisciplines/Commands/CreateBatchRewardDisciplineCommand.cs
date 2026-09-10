using System;
using System.Collections.Generic;
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

namespace HrmPlatform.Application.Features.RewardDisciplines.Commands;

public class CreateBatchRewardDisciplineCommand : IRequest<List<long>>
{
    public List<long> EmployeeIds { get; set; } = new();
    public long? DepartmentId { get; set; }
    public bool ApplyToAllInDepartment { get; set; }
    public RewardDisciplineType Type { get; set; }
    public RewardDisciplineCategory Category { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? DecisionNumber { get; set; }
    public DateOnly DecisionDate { get; set; }
    public DateOnly EffectiveDate { get; set; }
    public decimal Amount { get; set; }
    public string? Reason { get; set; }
    public string? AttachmentUrl { get; set; }
    public RewardDisciplineStatus Status { get; set; } = RewardDisciplineStatus.PENDING;
}

public class CreateBatchRewardDisciplineCommandHandler : IRequestHandler<CreateBatchRewardDisciplineCommand, List<long>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateBatchRewardDisciplineCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<List<long>> Handle(CreateBatchRewardDisciplineCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        if (string.IsNullOrWhiteSpace(request.Title))
            throw new DomainException("Tiêu đề quyết định thưởng/phạt không được để trống.");

        if (request.Amount < 0)
            throw new DomainException("Số tiền thưởng/phạt không được là số âm.");

        // 1. Resolve Target Employee IDs
        var targetEmployeeIds = request.EmployeeIds?.Where(id => id > 0).Distinct().ToList() ?? new List<long>();

        if (request.ApplyToAllInDepartment && request.DepartmentId.HasValue && request.DepartmentId.Value > 0)
        {
            var deptEmployees = await _context.EmployeeProfiles
                .Where(e => e.TenantId == tenantId && e.DepartmentId == request.DepartmentId.Value && e.Status != EntityStatus.DELETED)
                .Select(e => e.Id)
                .ToListAsync(cancellationToken);
            
            targetEmployeeIds = targetEmployeeIds.Union(deptEmployees).Distinct().ToList();
        }

        if (!targetEmployeeIds.Any())
            throw new DomainException("Vui lòng chọn ít nhất 1 nhân sự hoặc 1 phòng ban để áp dụng quyết định tập thể.");

        // 2. Generate or Validate Decision Number (Shared for entire batch)
        string finalDecisionNumber;

        if (!string.IsNullOrWhiteSpace(request.DecisionNumber))
        {
            var trimmedNumber = request.DecisionNumber.Trim();
            var duplicateExists = await _context.RewardDisciplines
                .AnyAsync(r => r.TenantId == tenantId && r.DecisionNumber == trimmedNumber, cancellationToken);

            if (duplicateExists)
                throw new DomainException($"Số quyết định '{trimmedNumber}' đã tồn tại trong hệ thống. Vui lòng nhập số khác.");

            finalDecisionNumber = trimmedNumber;
        }
        else
        {
            var year = request.DecisionDate.Year > 2000 ? request.DecisionDate.Year : DateTime.UtcNow.Year;
            var typeCode = request.Type == RewardDisciplineType.REWARD ? "KT" : "KL";
            var prefix = $"QĐ-{typeCode}-{year}/";

            var existingNumbers = await _context.RewardDisciplines
                .Where(r => r.TenantId == tenantId && r.DecisionNumber != null && r.DecisionNumber.StartsWith(prefix))
                .Select(r => r.DecisionNumber!)
                .ToListAsync(cancellationToken);

            int maxSeq = 0;
            foreach (var num in existingNumbers)
            {
                var parts = num.Split('/');
                if (parts.Length > 1 && int.TryParse(parts[1], out int seq))
                {
                    if (seq > maxSeq) maxSeq = seq;
                }
            }

            finalDecisionNumber = $"{prefix}{(maxSeq + 1):D4}";
        }

        // 3. Create Entities for all Target Employees
        var createdEntities = new List<RewardDiscipline>();

        foreach (var empId in targetEmployeeIds)
        {
            var entity = RewardDiscipline.Create(
                tenantId: tenantId,
                employeeId: empId,
                type: request.Type,
                category: request.Category,
                title: request.Title,
                decisionDate: request.DecisionDate,
                effectiveDate: request.EffectiveDate,
                amount: request.Amount,
                decisionNumber: finalDecisionNumber,
                reason: request.Reason,
                attachmentUrl: request.AttachmentUrl,
                status: request.Status
            );

            createdEntities.Add(entity);
        }

        _context.RewardDisciplines.AddRange(createdEntities);
        await _context.SaveChangesAsync(cancellationToken);

        return createdEntities.Select(e => e.Id).ToList();
    }
}
