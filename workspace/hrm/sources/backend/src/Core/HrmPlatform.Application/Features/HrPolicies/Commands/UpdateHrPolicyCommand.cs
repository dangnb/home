using System;
using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Exceptions;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.HrPolicies.Commands;

public class UpdateHrPolicyCommand : IRequest
{
    public long Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public HrPolicyCategory Category { get; set; }
    public DateOnly EffectiveDate { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public string? Summary { get; set; }
    public string? Content { get; set; }
    public string? AttachmentUrl { get; set; }
    public HrPolicyStatus Status { get; set; }
}

public class UpdateHrPolicyCommandHandler : IRequestHandler<UpdateHrPolicyCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateHrPolicyCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task Handle(UpdateHrPolicyCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        var policy = await _context.HrPolicies
            .FirstOrDefaultAsync(p => p.Id == request.Id && p.TenantId == tenantId, cancellationToken);

        if (policy == null)
            throw new NotFoundException($"Không tìm thấy chính sách có ID = {request.Id}.");

        policy.Update(
            request.Title,
            request.Category,
            request.EffectiveDate,
            request.ExpiryDate,
            request.Summary,
            request.Content,
            request.AttachmentUrl,
            request.Status);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
