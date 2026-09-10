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

namespace HrmPlatform.Application.Features.RewardDisciplines.Commands;

public class CreateRewardDisciplineCommand : IRequest<long>
{
    public long EmployeeId { get; set; }
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

public class CreateRewardDisciplineCommandHandler : IRequestHandler<CreateRewardDisciplineCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateRewardDisciplineCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(CreateRewardDisciplineCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var employeeExists = await _context.EmployeeProfiles
            .AnyAsync(e => e.Id == request.EmployeeId && e.TenantId == tenantId, cancellationToken);

        if (!employeeExists)
            throw new NotFoundException($"Không tìm thấy nhân sự có ID = {request.EmployeeId}.");

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
            // Tự động sinh số quyết định: QĐ-KT-{NĂM}/{STT} hoặc QĐ-KL-{NĂM}/{STT}
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

        var entity = RewardDiscipline.Create(
            tenantId: tenantId,
            employeeId: request.EmployeeId,
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

        _context.RewardDisciplines.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
