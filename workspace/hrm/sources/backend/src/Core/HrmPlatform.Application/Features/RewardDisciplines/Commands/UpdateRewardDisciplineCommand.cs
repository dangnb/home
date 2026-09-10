using System;
using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.RewardDisciplines.Commands;

public class UpdateRewardDisciplineCommand : IRequest<bool>
{
    public long Id { get; set; }
    public RewardDisciplineType Type { get; set; }
    public RewardDisciplineCategory Category { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? DecisionNumber { get; set; }
    public DateOnly DecisionDate { get; set; }
    public DateOnly EffectiveDate { get; set; }
    public decimal Amount { get; set; }
    public string? Reason { get; set; }
    public string? AttachmentUrl { get; set; }
}

public class UpdateRewardDisciplineCommandHandler : IRequestHandler<UpdateRewardDisciplineCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateRewardDisciplineCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<bool> Handle(UpdateRewardDisciplineCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var entity = await _context.RewardDisciplines
            .FirstOrDefaultAsync(r => r.Id == request.Id && r.TenantId == tenantId, cancellationToken);

        if (entity == null)
            throw new NotFoundException($"Không tìm thấy quyết định thưởng/phạt với ID = {request.Id}.");

        string? finalDecisionNumber = request.DecisionNumber?.Trim();

        if (!string.IsNullOrWhiteSpace(finalDecisionNumber))
        {
            var duplicateExists = await _context.RewardDisciplines
                .AnyAsync(r => r.TenantId == tenantId && r.Id != request.Id && r.DecisionNumber == finalDecisionNumber, cancellationToken);

            if (duplicateExists)
                throw new DomainException($"Số quyết định '{finalDecisionNumber}' đã được sử dụng cho bản ghi khác trong hệ thống.");
        }

        entity.Update(
            type: request.Type,
            category: request.Category,
            title: request.Title,
            decisionDate: request.DecisionDate,
            effectiveDate: request.EffectiveDate,
            amount: request.Amount,
            decisionNumber: finalDecisionNumber,
            reason: request.Reason,
            attachmentUrl: request.AttachmentUrl
        );

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
