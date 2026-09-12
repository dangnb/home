using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using HrmPlatform.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HrmPlatform.Application.Features.Assets.Queries;

public class GetMyAssetsQuery : IRequest<List<AssetDto>>
{
}

public class GetMyAssetsQueryHandler : IRequestHandler<GetMyAssetsQuery, List<AssetDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetMyAssetsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<List<AssetDto>> Handle(GetMyAssetsQuery request, CancellationToken cancellationToken)
    {
        var tenantId = _currentUserService.TenantId ?? 1;
        var currentUserId = _currentUserService.UserId ?? 0;

        return await _context.Assets
            .Include(a => a.Assignee)
            .Where(a => a.TenantId == tenantId && a.AssigneeId == currentUserId)
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new AssetDto
            {
                Id = a.Id,
                TenantId = a.TenantId,
                AssetCode = a.AssetCode,
                Name = a.Name,
                Category = a.Category.ToString(),
                SerialNumber = a.SerialNumber,
                PurchaseDate = a.PurchaseDate,
                PurchasePrice = a.PurchasePrice,
                CurrentValue = a.CurrentValue,
                AssigneeId = a.AssigneeId,
                AssigneeName = a.Assignee != null ? a.Assignee.FullName : null,
                Status = a.Status.ToString(),
                CreatedAt = a.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
