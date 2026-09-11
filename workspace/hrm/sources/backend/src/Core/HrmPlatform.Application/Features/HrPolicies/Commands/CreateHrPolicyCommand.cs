using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Interfaces;
using HrmPlatform.Domain.Entities.Hrm;
using HrmPlatform.Domain.Enums;
using HrmPlatform.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.HrPolicies.Commands;

public class CreateHrPolicyCommand : IRequest<long>
{
    public string? PolicyCode { get; set; }
    public string Title { get; set; } = string.Empty;
    public HrPolicyCategory Category { get; set; }
    public DateOnly EffectiveDate { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public string? Summary { get; set; }
    public string? Content { get; set; }
    public string? AttachmentUrl { get; set; }
    public HrPolicyStatus Status { get; set; } = HrPolicyStatus.PUBLISHED;
}

public class CreateHrPolicyCommandHandler : IRequestHandler<CreateHrPolicyCommand, long>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public CreateHrPolicyCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<long> Handle(CreateHrPolicyCommand request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;

        string finalCode;

        if (!string.IsNullOrWhiteSpace(request.PolicyCode))
        {
            var trimmedCode = request.PolicyCode.Trim().ToUpper();
            var duplicateExists = await _context.HrPolicies
                .AnyAsync(p => p.TenantId == tenantId && p.PolicyCode == trimmedCode, cancellationToken);

            if (duplicateExists)
                throw new DomainException($"Mã chính sách '{trimmedCode}' đã tồn tại trong hệ thống. Vui lòng nhập mã khác.");

            finalCode = trimmedCode;
        }
        else
        {
            var currentYear = DateTime.Now.Year;
            var prefix = $"CS-{currentYear}/";

            var maxCodes = await _context.HrPolicies
                .Where(p => p.TenantId == tenantId && p.PolicyCode.StartsWith(prefix))
                .Select(p => p.PolicyCode)
                .ToListAsync(cancellationToken);

            var maxIndex = 0;
            foreach (var code in maxCodes)
            {
                var suffix = code.Replace(prefix, "");
                if (int.TryParse(suffix, out int parsedIndex))
                {
                    if (parsedIndex > maxIndex) maxIndex = parsedIndex;
                }
            }

            finalCode = $"{prefix}{(maxIndex + 1):D4}";
        }

        var policy = HrPolicy.Create(
            tenantId,
            finalCode,
            request.Title,
            request.Category,
            request.EffectiveDate,
            request.ExpiryDate,
            request.Summary,
            request.Content,
            request.AttachmentUrl,
            request.Status);

        _context.HrPolicies.Add(policy);
        await _context.SaveChangesAsync(cancellationToken);

        return policy.Id;
    }
}
